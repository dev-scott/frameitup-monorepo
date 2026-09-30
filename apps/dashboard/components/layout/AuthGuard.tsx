"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--surface-950)",
          color: "var(--brand-300)",
          fontFamily: "var(--font-outfit)",
          fontSize: "1.125rem",
          gap: 12,
        }}
      >
        <div
          className="animate-spin"
          style={{
            width: 24,
            height: 24,
            border: "2px solid var(--brand-400)",
            borderTopColor: "transparent",
            borderRadius: "50%",
          }}
        />
        Chargement de l&apos;espace administrateur...
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
