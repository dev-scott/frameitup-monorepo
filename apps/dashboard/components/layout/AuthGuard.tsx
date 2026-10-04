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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--surface-950)",
          gap: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background orb */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40vw",
            height: "40vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(43 80% 42% / 0.06) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div
          className="animate-float"
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "linear-gradient(135deg, var(--brand-400) 0%, var(--brand-700) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.6rem",
            boxShadow: "0 0 40px hsl(43 80% 42% / 0.3), 0 8px 24px hsl(0 0% 0% / 0.5)",
          }}
        >
          🖼️
        </div>

        {/* Spinner */}
        <div
          className="animate-spin"
          style={{
            width: 32,
            height: 32,
            border: "3px solid var(--surface-700)",
            borderTopColor: "var(--brand-400)",
            borderRadius: "50%",
          }}
        />

        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "0.9rem",
            color: "var(--text-muted)",
            letterSpacing: "0.01em",
          }}
        >
          Chargement de l&apos;espace admin…
        </p>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
