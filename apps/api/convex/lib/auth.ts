import { ConvexError } from "convex/values";
import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";
import { hashToken } from "./crypto";

/**
 * Contrôle d'accès basé sur les rôles (RBAC)
 *
 * Chaque fonction protégée reçoit un `sessionToken` et vérifie
 * côté serveur que la session est valide ET que le rôle possède la permission.
 * L'interface masque les actions interdites, mais la sécurité réelle est ici.
 */

export const ROLES = ["super_admin", "admin", "manager", "stock", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "dashboard.read",
  "orders.write",
  "stock.write",
  "products.write",
  "customers.write",
  "finances.write",
  "users.manage",
  "audit.read",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  super_admin: PERMISSIONS,
  admin: [
    "dashboard.read",
    "orders.write",
    "stock.write",
    "products.write",
    "customers.write",
    "finances.write",
    "audit.read",
  ],
  manager: ["dashboard.read", "orders.write", "stock.write", "customers.write"],
  stock: ["dashboard.read", "stock.write"],
  viewer: ["dashboard.read"],
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Propriétaire",
  admin: "Administrateur",
  manager: "Gestionnaire",
  stock: "Magasinier",
  viewer: "Lecture seule",
};

export function permissionsFor(role: Role): Permission[] {
  return [...(ROLE_PERMISSIONS[role] ?? [])];
}

export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export function validatePasswordStrength(password: string) {
  if (password.length < 10) {
    throw new ConvexError({ code: "WEAK_PASSWORD", message: "Le mot de passe doit contenir au moins 10 caractères." });
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    throw new ConvexError({ code: "WEAK_PASSWORD", message: "Le mot de passe doit contenir des lettres et des chiffres." });
  }
}

export type AuthContext = {
  user: Doc<"users">;
  session: Doc<"sessions">;
  permissions: Permission[];
};

/** Résout la session sans lever d'erreur (null si invalide) */
export async function getSession(
  ctx: QueryCtx | MutationCtx,
  sessionToken: string | undefined | null
): Promise<AuthContext | null> {
  if (!sessionToken) return null;
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token_hash", (q) => q.eq("tokenHash", hashToken(sessionToken)))
    .first();
  if (!session || session.expiresAt < Date.now()) return null;
  const user = await ctx.db.get(session.userId);
  if (!user || !user.isActive) return null;
  return { user, session, permissions: permissionsFor(user.role) };
}

/** Exige une session valide — lève UNAUTHENTICATED sinon */
export async function requireSession(
  ctx: QueryCtx | MutationCtx,
  sessionToken: string | undefined | null
): Promise<AuthContext> {
  const auth = await getSession(ctx, sessionToken);
  if (!auth) {
    throw new ConvexError({ code: "UNAUTHENTICATED", message: "Session expirée. Veuillez vous reconnecter." });
  }
  return auth;
}

/** Exige une permission précise — lève FORBIDDEN sinon */
export async function requirePermission(
  ctx: QueryCtx | MutationCtx,
  sessionToken: string | undefined | null,
  permission: Permission
): Promise<AuthContext> {
  const auth = await requireSession(ctx, sessionToken);
  if (!auth.permissions.includes(permission)) {
    throw new ConvexError({
      code: "FORBIDDEN",
      message: "Votre rôle ne vous permet pas d'effectuer cette action.",
    });
  }
  return auth;
}

/** Journal d'audit : trace qui a fait quoi et quand */
export async function logAudit(
  ctx: MutationCtx,
  entry: {
    user?: Doc<"users"> | null;
    action: string;
    entity: string;
    entityId?: string;
    summary: string;
    metadata?: Record<string, unknown>;
  }
) {
  await ctx.db.insert("auditLogs", {
    userId: entry.user?._id as Id<"users"> | undefined,
    userEmail: entry.user?.email,
    userName: entry.user ? `${entry.user.firstName} ${entry.user.lastName}` : undefined,
    action: entry.action,
    entity: entry.entity,
    entityId: entry.entityId,
    summary: entry.summary,
    metadata: entry.metadata,
  });
}

export function publicUser(user: Doc<"users">) {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    roleLabel: ROLE_LABELS[user.role],
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user._creationTime,
    permissions: permissionsFor(user.role),
  };
}
