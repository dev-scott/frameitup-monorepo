"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/lib/convex";

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  token?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginMutation = useMutation(api.mutations.auth.login);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("frameitup_admin_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Erreur lecture session admin:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await loginMutation({ email, password: pass });
      if (res && res.success) {
        const adminData: AdminUser = {
          id: res.user.id,
          email: res.user.email,
          firstName: res.user.firstName,
          lastName: res.user.lastName,
          role: res.user.role,
          token: res.token,
        };
        setUser(adminData);
        localStorage.setItem("frameitup_admin_user", JSON.stringify(adminData));
        return { success: true };
      }
      return { success: false, error: "Identifiants invalides." };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Erreur de connexion. Vérifiez vos identifiants.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("frameitup_admin_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
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
  if (!ctx) {
    throw new Error("useAuth doit être utilisé au sein d'un AuthProvider");
  }
  return ctx;
}
