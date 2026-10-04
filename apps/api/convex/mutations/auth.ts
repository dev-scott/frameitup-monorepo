import { mutation, internalMutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { hashPassword, verifyPassword, generateToken, hashToken } from "../lib/crypto";
import {
  requireSession,
  logAudit,
  publicUser,
  validatePasswordStrength,
  SESSION_TTL_MS,
  MAX_FAILED_ATTEMPTS,
  LOCKOUT_MS,
} from "../lib/auth";

/**
 * Mutations Convex — Authentification
 *
 * - Mots de passe hachés (PBKDF2-SHA256, sel unique)
 * - Sessions serveur révocables (seul le hash du jeton est stocké)
 * - Verrouillage temporaire après 5 échecs consécutifs
 * - Aucun compte « magique » ni mot de passe par défaut
 */

const GENERIC_ERROR = "Adresse e-mail ou mot de passe incorrect.";

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    // On ne lève pas d'exception pour les échecs : une exception annulerait
    // l'incrément du compteur de tentatives (transaction rollback).
    if (!user) {
      return { success: false as const, error: GENERIC_ERROR };
    }

    const now = Date.now();
    if (user.lockedUntil && user.lockedUntil > now) {
      const minutes = Math.ceil((user.lockedUntil - now) / 60000);
      return {
        success: false as const,
        error: `Compte temporairement verrouillé après plusieurs tentatives. Réessayez dans ${minutes} min.`,
      };
    }

    if (!user.isActive) {
      return { success: false as const, error: "Ce compte a été désactivé. Contactez le propriétaire." };
    }

    let valid = false;
    let migratedHash: string | undefined;
    if (user.passwordHash) {
      valid = verifyPassword(args.password, user.passwordHash);
    } else if (user.password) {
      // Migration transparente des anciens comptes stockés en clair
      valid = user.password === args.password;
      if (valid) migratedHash = hashPassword(args.password);
    }

    if (!valid) {
      const attempts = (user.failedLoginAttempts ?? 0) + 1;
      const locked = attempts >= MAX_FAILED_ATTEMPTS;
      await ctx.db.patch(user._id, {
        failedLoginAttempts: locked ? 0 : attempts,
        lockedUntil: locked ? now + LOCKOUT_MS : undefined,
      });
      if (locked) {
        await logAudit(ctx, {
          user,
          action: "auth.locked",
          entity: "user",
          entityId: user._id,
          summary: `Compte verrouillé 15 min après ${MAX_FAILED_ATTEMPTS} échecs de connexion`,
        });
      }
      return { success: false as const, error: GENERIC_ERROR };
    }

    await ctx.db.patch(user._id, {
      lastLoginAt: now,
      failedLoginAttempts: 0,
      lockedUntil: undefined,
      ...(migratedHash ? { passwordHash: migratedHash, password: undefined } : {}),
    });

    const token = generateToken();
    await ctx.db.insert("sessions", {
      userId: user._id,
      tokenHash: hashToken(token),
      expiresAt: now + SESSION_TTL_MS,
      lastSeenAt: now,
      userAgent: args.userAgent?.slice(0, 200),
    });

    await logAudit(ctx, {
      user,
      action: "auth.login",
      entity: "session",
      summary: "Connexion au tableau de bord",
    });

    const fresh = (await ctx.db.get(user._id))!;
    return { success: true as const, token, user: publicUser(fresh) };
  },
});

export const logout = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", hashToken(args.sessionToken)))
      .first();
    if (session) {
      const user = await ctx.db.get(session.userId);
      await ctx.db.delete(session._id);
      await logAudit(ctx, { user, action: "auth.logout", entity: "session", summary: "Déconnexion" });
    }
    return { success: true };
  },
});

/** Prolonge la session active (fenêtre glissante) — appelée périodiquement par le client */
export const touchSession = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const { session } = await requireSession(ctx, args.sessionToken);
    const now = Date.now();
    if (now - session.lastSeenAt > 5 * 60 * 1000) {
      await ctx.db.patch(session._id, { lastSeenAt: now, expiresAt: now + SESSION_TTL_MS });
    }
    return { success: true };
  },
});

export const updateProfile = mutation({
  args: {
    sessionToken: v.string(),
    firstName: v.string(),
    lastName: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await requireSession(ctx, args.sessionToken);
    const firstName = args.firstName.trim();
    const lastName = args.lastName.trim();
    if (!firstName || !lastName) {
      throw new ConvexError({ code: "INVALID", message: "Le prénom et le nom sont requis." });
    }
    await ctx.db.patch(user._id, { firstName, lastName });
    await logAudit(ctx, { user, action: "user.profile", entity: "user", entityId: user._id, summary: "Profil mis à jour" });
    return { success: true };
  },
});

export const changePassword = mutation({
  args: {
    sessionToken: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const { user, session } = await requireSession(ctx, args.sessionToken);
    const ok = user.passwordHash
      ? verifyPassword(args.currentPassword, user.passwordHash)
      : user.password === args.currentPassword;
    if (!ok) {
      throw new ConvexError({ code: "INVALID", message: "Le mot de passe actuel est incorrect." });
    }
    validatePasswordStrength(args.newPassword);
    await ctx.db.patch(user._id, {
      passwordHash: hashPassword(args.newPassword),
      password: undefined,
      passwordChangedAt: Date.now(),
    });

    // Révoque toutes les autres sessions
    const sessions = await ctx.db.query("sessions").withIndex("by_user", (q) => q.eq("userId", user._id)).collect();
    for (const s of sessions) if (s._id !== session._id) await ctx.db.delete(s._id);

    await logAudit(ctx, {
      user,
      action: "user.password",
      entity: "user",
      entityId: user._id,
      summary: "Mot de passe modifié — autres sessions révoquées",
    });
    return { success: true };
  },
});

export const revokeOtherSessions = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const { user, session } = await requireSession(ctx, args.sessionToken);
    const sessions = await ctx.db.query("sessions").withIndex("by_user", (q) => q.eq("userId", user._id)).collect();
    let count = 0;
    for (const s of sessions) {
      if (s._id !== session._id) {
        await ctx.db.delete(s._id);
        count++;
      }
    }
    await logAudit(ctx, { user, action: "auth.revoke", entity: "session", summary: `${count} autre(s) session(s) révoquée(s)` });
    return { revoked: count };
  },
});

/**
 * Initialisation des comptes — fonction INTERNE (non exposée au client).
 * Exécution : npx convex run mutations/auth:bootstrapAccount '{"email":"...","password":"...","firstName":"...","lastName":"...","role":"super_admin"}'
 */
export const bootstrapAccount = internalMutation({
  args: {
    email: v.string(),
    password: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: v.union(
      v.literal("super_admin"),
      v.literal("admin"),
      v.literal("manager"),
      v.literal("stock"),
      v.literal("viewer")
    ),
  },
  handler: async (ctx, args) => {
    validatePasswordStrength(args.password);
    const email = args.email.trim().toLowerCase();
    const existing = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", email)).first();
    const data = {
      firstName: args.firstName,
      lastName: args.lastName,
      role: args.role,
      isActive: true,
      passwordHash: hashPassword(args.password),
      password: undefined,
      failedLoginAttempts: 0,
      lockedUntil: undefined,
      passwordChangedAt: Date.now(),
    };
    if (existing) {
      await ctx.db.patch(existing._id, data);
      return { updated: true, userId: existing._id };
    }
    const userId = await ctx.db.insert("users", { email, ...data });
    await logAudit(ctx, {
      action: "user.create",
      entity: "user",
      entityId: userId,
      summary: `Compte ${email} initialisé (${args.role}) via la console`,
    });
    return { created: true, userId };
  },
});

/**
 * Initialisation publique du premier compte (bootstrap UI)
 * Autorisée uniquement si aucun super_admin n'existe encore.
 */
export const setupAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: v.union(
      v.literal("super_admin"),
      v.literal("admin"),
      v.literal("manager"),
      v.literal("stock"),
      v.literal("viewer")
    ),
  },
  handler: async (ctx, args) => {
    validatePasswordStrength(args.password);
    const email = args.email.trim().toLowerCase();

    // Si un super_admin existe déjà, bloquer la création publique
    const existing = await ctx.db
      .query("users")
      .collect();
    const hasOwner = existing.some((u) => u.role === "super_admin" && u.isActive);
    if (hasOwner) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Un propriétaire existe déjà. Utilisez l'interface de gestion des utilisateurs.",
      });
    }

    const dup = existing.find((u) => u.email === email);
    const data = {
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      role: args.role,
      isActive: true,
      passwordHash: hashPassword(args.password),
      password: undefined,
      failedLoginAttempts: 0,
      passwordChangedAt: Date.now(),
    };
    if (dup) {
      await ctx.db.patch(dup._id, data);
      return { userId: dup._id };
    }
    const userId = await ctx.db.insert("users", { email, ...data });
    await logAudit(ctx, {
      action: "user.create",
      entity: "user",
      entityId: userId,
      summary: `Premier compte propriétaire créé : ${email}`,
    });
    return { userId };
  },
});

/** Purge des sessions expirées (appelée par le cron) */
export const purgeExpiredSessions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const sessions = await ctx.db.query("sessions").collect();
    let removed = 0;
    for (const s of sessions) {
      if (s.expiresAt < now) {
        await ctx.db.delete(s._id);
        removed++;
      }
    }
    return { removed };
  },
});
