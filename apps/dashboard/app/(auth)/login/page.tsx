"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, LogIn, UserPlus, CheckCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useMutation } from "convex/react";
import { api } from "@/lib/convex";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const setupAdminMutation = useMutation(api.mutations.auth.setupAdmin);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("admin@frameitup.com");
  const [password, setPassword] = useState("admin");
  const [firstName, setFirstName] = useState("Directeur");
  const [lastName, setLastName] = useState("FrameItUp");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/overview");
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email || !password) {
      setError("Veuillez renseigner tous les champs requis.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        if (!firstName.trim()) {
          setError("Veuillez renseigner un prénom.");
          setLoading(false);
          return;
        }

        await setupAdminMutation({
          email: email.trim().toLowerCase(),
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim() || "Admin",
          role: "super_admin",
        });

        setSuccessMsg("Compte administrateur créé avec succès ! Connexion en cours…");
        const res = await login(email, password);
        if (res.success) {
          router.push("/overview");
        } else {
          setMode("login");
          setLoading(false);
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          router.push("/overview");
        } else {
          setError(res.error || "Email ou mot de passe incorrect.");
          setLoading(false);
        }
      }
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue lors de la tentative d'authentification.");
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
          radial-gradient(ellipse at 20% 20%, hsl(43 80% 42% / 0.08) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 80%, hsl(210 100% 60% / 0.05) 0%, transparent 55%),
          var(--surface-950)
        `,
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "linear-gradient(135deg, var(--brand-500) 0%, var(--brand-700) 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
              marginBottom: "1rem",
              boxShadow: "0 0 40px hsl(43 80% 42% / 0.35), 0 8px 32px hsl(0 0% 0% / 0.4)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            🖼️
          </div>
          <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.875rem", fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
            FrameItUp
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.375rem", fontSize: "0.9375rem" }}>
            Espace d&apos;administration &amp; Atelier
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: "2rem", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.25rem", fontWeight: 700, color: "white", margin: 0 }}>
              {mode === "login" ? "Connexion sécurisée" : "Créer un administrateur"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
                setSuccessMsg("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--brand-300)",
                fontSize: "0.8125rem",
                cursor: "pointer",
                fontWeight: 500,
                textDecoration: "underline",
              }}
            >
              {mode === "login" ? "+ Nouveau compte" : "Déjà un compte ?"}
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            {/* Feedback messages */}
            {error && (
              <div style={{ padding: "0.75rem 1rem", borderRadius: 10, background: "hsl(350 89% 56% / 0.1)", border: "1px solid hsl(350 89% 56% / 0.25)", color: "var(--danger)", fontSize: "0.875rem" }}>
                {error}
              </div>
            )}

            {successMsg && (
              <div style={{ padding: "0.75rem 1rem", borderRadius: 10, background: "hsl(160 84% 44% / 0.1)", border: "1px solid hsl(160 84% 44% / 0.25)", color: "var(--success)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle size={16} />
                {successMsg}
              </div>
            )}

            {/* In Register mode: firstName & lastName */}
            {mode === "register" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label htmlFor="firstName" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jean"
                    required
                    style={{ width: "100%", background: "var(--surface-800)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.625rem", color: "white", fontSize: "0.875rem" }}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                    Nom
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dupont"
                    style={{ width: "100%", background: "var(--surface-800)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.625rem", color: "white", fontSize: "0.875rem" }}
                  />
                </div>
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
                style={{ width: "100%", background: "var(--surface-800)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.625rem", color: "white", fontSize: "0.875rem" }}
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
                  style={{ width: "100%", background: "var(--surface-800)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.625rem 2.5rem 0.625rem 0.625rem", color: "white", fontSize: "0.875rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 4 }}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "0.875rem", fontSize: "0.9375rem", marginTop: "0.5rem", height: 46 }}
            >
              {loading ? (
                <span className="animate-spin" style={{ width: 18, height: 18, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block" }} />
              ) : mode === "login" ? (
                <>
                  <LogIn size={17} />
                  Se connecter
                </>
              ) : (
                <>
                  <UserPlus size={17} />
                  Créer et accéder au dashboard
                </>
              )}
            </button>
          </form>

          {/* Preset hint */}
          <div style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1.5rem", padding: "0.75rem", borderRadius: 8, background: "var(--surface-800)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4, color: "var(--brand-300)", fontWeight: 600 }}>
              <ShieldCheck size={14} /> Accès par défaut
            </div>
            Email : <span style={{ fontFamily: "var(--font-jetbrains-mono)", color: "white" }}>admin@frameitup.com</span>
            <br />
            Mot de passe : <span style={{ fontFamily: "var(--font-jetbrains-mono)", color: "white" }}>admin</span>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "1.5rem" }}>
          FrameItUp © {new Date().getFullYear()} — Accès direct Convex Cloud
        </p>
      </div>
    </div>
  );
}
