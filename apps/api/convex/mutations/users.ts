import { mutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { hashPassword } from "../lib/crypto";
import { requirePermission, logAudit, validatePasswordStrength, ROLE_LABELS } from "../lib/auth";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

/**
 * Mutations Convex — Gestion de l'équipe (réservé au rôle « Propriétaire »)
 */

const roleValidator = v.union(
  v.literal("super_admin"),
  v.literal("admin"),
  v.literal("manager"),
  v.literal("stock"),
  v.literal("viewer")
);

async function revokeAllSessions(ctx: MutationCtx, userId: Id<"users">) {
  const sessions = await ctx.db.query("sessions").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
  for (const s of sessions) await ctx.db.delete(s._id);
}

async function countActiveOwners(ctx: MutationCtx) {
  const users = await ctx.db.query("users").collect();
  return users.filter((u) => u.role === "super_admin" && u.isActive).length;
}

export const create = mutation({
  args: {
    sessionToken: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: roleValidator,
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.sessionToken, "users.manage");
    const email = args.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ConvexError({ code: "INVALID", message: "Adresse e-mail invalide." });
    }
    validatePasswordStrength(args.password);
    const existing = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", email)).first();
    if (existing) throw new ConvexError({ code: "CONFLICT", message: "Un compte existe déjà avec cette adresse." });

    const userId = await ctx.db.insert("users", {
      email,
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      role: args.role,
      isActive: true,
      passwordHash: hashPassword(args.password),
      failedLoginAttempts: 0,
      passwordChangedAt: Date.now(),
    });
    await logAudit(ctx, {
      user: actor,
      action: "user.create",
      entity: "user",
      entityId: userId,
      summary: `Compte créé pour ${email} — ${ROLE_LABELS[args.role]}`,
    });
    return { userId };
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    userId: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.optional(roleValidator),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.sessionToken, "users.manage");
    const target = await ctx.db.get(args.userId);
    if (!target) throw new ConvexError({ code: "NOT_FOUND", message: "Utilisateur introuvable." });

    const isSelf = target._id === actor._id;
    if (isSelf && (args.isActive === false || (args.role && args.role !== actor.role))) {
      throw new ConvexError({ code: "INVALID", message: "Vous ne pouvez pas modifier votre propre rôle ni désactiver votre compte." });
    }
    const demotingOwner =
      target.role === "super_admin" && ((args.role && args.role !== "super_admin") || args.isActive === false);
    if (demotingOwner && (await countActiveOwners(ctx)) <= 1) {
      throw new ConvexError({ code: "INVALID", message: "Il doit rester au moins un propriétaire actif." });
    }

    const patch: Record<string, unknown> = {};
    const changes: string[] = [];
    if (args.firstName !== undefined) patch.firstName = args.firstName.trim();
    if (args.lastName !== undefined) patch.lastName = args.lastName.trim();
    if (args.role && args.role !== target.role) {
      patch.role = args.role;
      changes.push(`rôle ${ROLE_LABELS[target.role]} → ${ROLE_LABELS[args.role]}`);
    }
    if (args.isActive !== undefined && args.isActive !== target.isActive) {
      patch.isActive = args.isActive;
      changes.push(args.isActive ? "réactivé" : "désactivé");
    }
    await ctx.db.patch(target._id, patch);

    // Désactivation ou changement de rôle : on coupe les sessions en cours
    if (patch.isActive === false || patch.role) await revokeAllSessions(ctx, target._id);

    await logAudit(ctx, {
      user: actor,
      action: "user.update",
      entity: "user",
      entityId: target._id,
      summary: `${target.email} : ${changes.length ? changes.join(", ") : "informations mises à jour"}`,
    });
    return { success: true };
  },
});

export const resetPassword = mutation({
  args: { sessionToken: v.string(), userId: v.id("users"), newPassword: v.string() },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.sessionToken, "users.manage");
    const target = await ctx.db.get(args.userId);
    if (!target) throw new ConvexError({ code: "NOT_FOUND", message: "Utilisateur introuvable." });
    validatePasswordStrength(args.newPassword);
    await ctx.db.patch(target._id, {
      passwordHash: hashPassword(args.newPassword),
      password: undefined,
      failedLoginAttempts: 0,
      lockedUntil: undefined,
      passwordChangedAt: Date.now(),
    });
    if (target._id !== actor._id) await revokeAllSessions(ctx, target._id);
    await logAudit(ctx, {
      user: actor,
      action: "user.reset_password",
      entity: "user",
      entityId: target._id,
      summary: `Mot de passe réinitialisé pour ${target.email}`,
    });
    return { success: true };
  },
});

export const remove = mutation({
  args: { sessionToken: v.string(), userId: v.id("users") },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.sessionToken, "users.manage");
    const target = await ctx.db.get(args.userId);
    if (!target) throw new ConvexError({ code: "NOT_FOUND", message: "Utilisateur introuvable." });
    if (target._id === actor._id) {
      throw new ConvexError({ code: "INVALID", message: "Vous ne pouvez pas supprimer votre propre compte." });
    }
    if (target.role === "super_admin" && (await countActiveOwners(ctx)) <= 1) {
      throw new ConvexError({ code: "INVALID", message: "Il doit rester au moins un propriétaire actif." });
    }
    await revokeAllSessions(ctx, target._id);
    await ctx.db.delete(target._id);
    await logAudit(ctx, {
      user: actor,
      action: "user.delete",
      entity: "user",
      entityId: target._id,
      summary: `Compte ${target.email} supprimé`,
    });
    return { success: true };
  },
});
