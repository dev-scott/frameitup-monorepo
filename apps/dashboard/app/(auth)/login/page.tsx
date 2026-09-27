"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, LogIn } from "lucide-react";
import type { Metadata } from "next";

// Note: metadata ne fonctionne pas dans les Client Components
// Pour les métadonnées, utiliser un Server Component parent ou generateMetadata
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    // Simulation auth — remplacer par NextAuth signIn()
    await new Promise((r) => setTimeout(r, 1200));

    if (email === "admin@frameitup.com" && password === "admin") {
      router.push("/overview");
    } else {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `
          radial-gradient(ellipse at 20% 20%, hsl(43 80% 42% / 0.06) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 80%, hsl(210 100% 60% / 0.04) 0%, transparent 55%),
          var(--surface-950)
        `,
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              background: "linear-gradient(135deg, var(--brand-500) 0%, var(--brand-700) 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.625rem",
              marginBottom: "1.25rem",
              boxShadow: "0 0 40px hsl(43 80% 42% / 0.35), 0 8px 32px hsl(0 0% 0% / 0.4)",
            }}
          >
            🖼️
          </div>
          <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.875rem", fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
            FrameItUp
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.375rem", fontSize: "0.9375rem" }}>
            Dashboard d'administration
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.125rem", fontWeight: 700, color: "white", margin: "0 0 1.5rem" }}>
            Connexion
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            {/* Error */}
            {error && (
              <div style={{ padding: "0.75rem 1rem", borderRadius: 10, background: "hsl(350 89% 56% / 0.1)", border: "1px solid hsl(350 89% 56% / 0.25)", color: "var(--danger)", fontSize: "0.875rem" }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@frameitup.com"
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                Mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 4 }}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div style={{ textAlign: "right", marginTop: "-0.5rem" }}>
              <button type="button" style={{ background: "none", border: "none", color: "var(--brand-300)", fontSize: "0.8125rem", cursor: "pointer", padding: 0 }}>
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "0.875rem", fontSize: "1rem", marginTop: "0.25rem", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span className="animate-spin" style={{ width: 18, height: 18, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block" }} />
              ) : (
                <LogIn size={17} />
              )}
              {loading ? "Connexion en cours…" : "Se connecter"}
            </button>
          </form>

          {/* Demo hint */}
          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1.5rem", padding: "0.75rem", borderRadius: 8, background: "var(--surface-800)", border: "1px solid var(--border)" }}>
            Demo : <span style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--brand-300)" }}>admin@frameitup.com</span> / <span style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--brand-300)" }}>admin</span>
          </p>
        </div>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "1.5rem" }}>
          FrameItUp © {new Date().getFullYear()} — Usage interne uniquement
        </p>
      </div>
    </div>
  );
}
