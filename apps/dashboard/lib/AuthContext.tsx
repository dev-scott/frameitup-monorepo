"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/lib/convex";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type Permission =
  | "dashboard.read"
  | "orders.write"
  | "stock.write"
  | "products.write"
  | "customers.write"
  | "finances.write"
  | "users.manage"
  | "audit.read";

export type Role = "super_admin" | "admin" | "manager" | "stock" | "viewer";

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  roleLabel: string;
  permissions: Permission[];
  isActive: boolean;
  lastLoginAt?: number;
  createdAt?: number;
}

interface StoredSession {
  user: AdminUser;
  token: string;
  expiresAt: number; // client-side TTL (7 days) — server validates authoritatively
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (p: Permission) => boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const SESSION_KEY = "frameitup_session_v2";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const TOUCH_INTERVAL_MS = 5 * 60 * 1000;

// ─── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginMutation = useMutation(api.mutations.auth.login);
  const logoutMutation = useMutation(api.mutations.auth.logout);
  const touchSessionMutation = useMutation(api.mutations.auth.touchSession);

  const touchRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Restore session from storage ────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const stored: StoredSession = JSON.parse(raw);
        if (stored.expiresAt > Date.now()) {
          setUser(stored.user);
          setToken(stored.token);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Periodic session touch ───────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    touchRef.current = setInterval(() => {
      touchSessionMutation({ sessionToken: token }).catch(() => {
        // session expired — force logout
        clearSession();
        router.push("/login");
      });
    }, TOUCH_INTERVAL_MS);
    return () => {
      if (touchRef.current) clearInterval(touchRef.current);
    };
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function saveSession(u: AdminUser, t: string) {
    const stored: StoredSession = { user: u, token: t, expiresAt: Date.now() + SESSION_TTL_MS };
    localStorage.setItem(SESSION_KEY, JSON.stringify(stored));
    setUser(u);
    setToken(t);
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setToken(null);
  }

  // ── Login ────────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await loginMutation({
          email,
          password: pass,
          userAgent: navigator.userAgent,
        });

        if (res?.success) {
          const adminUser: AdminUser = {
            id: res.user.id,
            email: res.user.email,
            firstName: res.user.firstName,
            lastName: res.user.lastName,
            role: res.user.role as Role,
            roleLabel: res.user.roleLabel,
            permissions: (res.user.permissions ?? []) as Permission[],
            isActive: res.user.isActive,
            lastLoginAt: res.user.lastLoginAt,
            createdAt: res.user.createdAt,
          };
          saveSession(adminUser, res.token);
          return { success: true };
        }
        return { success: false, error: (res as any)?.error ?? "Identifiants invalides." };
      } catch (err: any) {
        return {
          success: false,
          error: err?.data?.message ?? err?.message ?? "Erreur de connexion.",
        };
      }
    },
    [loginMutation]
  );

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    if (token) {
      logoutMutation({ sessionToken: token }).catch(() => {});
    }
    clearSession();
    router.push("/login");
  }, [token, logoutMutation, router]);

  // ── Permission check ─────────────────────────────────────────────────────────
  const hasPermission = useCallback(
    (p: Permission) => user?.permissions.includes(p) ?? false,
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        hasPermission,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/** Convenient hook — returns true if the current user has the given permission */
export function usePermission(permission: Permission): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}
