import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface-950)",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "7rem",
            fontWeight: 900,
            lineHeight: 1,
            background: "linear-gradient(135deg, var(--brand-300) 0%, var(--brand-600) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "1rem",
          }}
        >
          404
        </div>
        <h1
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "white",
            margin: "0 0 0.75rem",
          }}
        >
          Page introuvable
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link href="/overview" className="btn-primary" style={{ display: "inline-flex" }}>
          <Home size={15} />
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
