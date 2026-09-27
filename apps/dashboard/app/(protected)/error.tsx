"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "hsl(350 89% 56% / 0.1)",
            border: "1px solid hsl(350 89% 56% / 0.25)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <AlertTriangle size={28} style={{ color: "var(--danger)" }} />
        </div>

        <h2
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "white",
            margin: "0 0 0.5rem",
          }}
        >
          Une erreur s'est produite
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "0 0 1.5rem" }}>
          {error.message || "Quelque chose s'est mal passé. Réessayez."}
        </p>
        {error.digest && (
          <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            Code: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          className="btn-primary"
          style={{ margin: "0 auto" }}
        >
          <RefreshCw size={15} />
          Réessayer
        </button>
      </div>
    </div>
  );
}
