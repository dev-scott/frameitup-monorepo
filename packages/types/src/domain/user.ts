import type { Id, Timestamps } from "./common";

// ─── Auth / Users ─────────────────────────────────────────────────────────────
export type UserId = Id<"users">;

export type UserRole =
  | "super_admin"   // accès total
  | "admin"         // accès total sauf paramètres système
  | "manager"       // commandes + stock + finances (lecture)
  | "stock"         // stock uniquement
  | "viewer";       // lecture seule

export interface User extends Timestamps {
  _id: UserId;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  lastLoginAt?: number;
}

export type Permission =
  | "products:read"  | "products:write"  | "products:delete"
  | "orders:read"    | "orders:write"    | "orders:delete"
  | "stock:read"     | "stock:write"
  | "finance:read"   | "finance:write"
  | "customers:read" | "customers:write"
  | "users:read"     | "users:write"     | "users:delete"
  | "settings:read"  | "settings:write";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: ["products:read","products:write","products:delete","orders:read","orders:write","orders:delete","stock:read","stock:write","finance:read","finance:write","customers:read","customers:write","users:read","users:write","users:delete","settings:read","settings:write"],
  admin:       ["products:read","products:write","products:delete","orders:read","orders:write","orders:delete","stock:read","stock:write","finance:read","finance:write","customers:read","customers:write","users:read","settings:read","settings:write"],
  manager:     ["products:read","orders:read","orders:write","stock:read","finance:read","customers:read","customers:write"],
  stock:       ["products:read","stock:read","stock:write","orders:read"],
  viewer:      ["products:read","orders:read","stock:read","finance:read","customers:read"],
};
