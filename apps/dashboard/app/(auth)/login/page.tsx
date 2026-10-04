"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useMutation } from "convex/react";
import { api } from "@/lib/convex";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const setupAdminMutation = useMutation(api.mutations.auth.setupAdmin);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.push("/overview");
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
        if (password.length < 10 || !/[0-9]/.test(password)) {
          setError(
            "Le mot de passe doit contenir au moins 10 caractères avec des lettres et des chiffres.",
          );
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
        setSuccessMsg("Compte créé ! Connexion en cours…");
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
      setError(err?.data?.message ?? err?.message ?? "Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        background: "var(--surface-950)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Ambient background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Top-left orb */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "-10%",
            width: "55vw",
            height: "55vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(43 80% 42% / 0.07) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        {/* Bottom-right orb */}
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "50vw",
            height: "50vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(212 100% 62% / 0.05) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(hsl(224 28% 16% / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(224 28% 16% / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Left panel (branding) ── */}
      <div
        className="animate-fade-in"
        style={{
          display: "none",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3rem",
          borderRight: "1px solid var(--border)",
          position: "relative",
          ...(typeof window !== "undefined" && window.innerWidth >= 1024
            ? { display: "flex" }
            : {}),
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              background: "linear-gradient(135deg, var(--brand-400) 0%, var(--brand-700) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
              boxShadow: "0 0 30px hsl(43 80% 42% / 0.4), 0 4px 12px hsl(0 0% 0% / 0.4)",
            }}
          >
            🖼️
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "white",
              }}
            >
              FrameItUp
            </div>
            <div
              style={{
                fontSize: "0.6875rem",
                color: "var(--brand-400)",
                letterSpacing: "0.1em",
                fontWeight: 700,
              }}
            >
              DASHBOARD
            </div>
          </div>
        </div>

        {/* Feature list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "2.25rem",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            <span style={{ color: "white" }}>Gérez votre atelier</span>
            <br />
            <span className="text-gradient">avec précision.</span>
          </h2>
          {[
            { icon: "📊", title: "Tableau de bord complet", desc: "Suivez vos KPIs en temps réel" },
            {
              icon: "🔒",
              title: "Accès sécurisé par rôles",
              desc: "Propriétaire, admin, gestionnaire…",
            },
            {
              icon: "📦",
              title: "Gestion du stock avancée",
              desc: "Alertes automatiques, suivi par produit",
            },
          ].map((f) => (
            <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  background: "var(--surface-800)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    color: "white",
                    fontSize: "0.9375rem",
                    lineHeight: 1.3,
                  }}
                >
                  {f.title}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 2 }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
          FrameItUp © {new Date().getFullYear()} — Atelier d&apos;encadrement professionnel
        </p>
      </div>

      {/* ── Right panel (form) ── */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2.5rem 2rem",
          position: "relative",
        }}
      >
        {/* Mobile logo */}
        <div
          className="animate-slide-down"
          style={{
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              background: "linear-gradient(135deg, var(--brand-400) 0%, var(--brand-700) 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
              marginBottom: "1rem",
              boxShadow: "0 0 40px hsl(43 80% 42% / 0.35), 0 8px 24px hsl(0 0% 0% / 0.5)",
              border: "1px solid hsl(43 80% 42% / 0.3)",
            }}
          >
            🖼️
          </div>
          <h1
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "2rem",
              fontWeight: 800,
              color: "white",
              margin: 0,
              letterSpacing: "-0.025em",
            }}
          >
            FrameItUp
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.375rem", fontSize: "0.9rem" }}>
            Espace d&apos;administration & Atelier
          </p>
        </div>

        {/* Form card */}
        <div
          className="animate-slide-up"
          style={{
            width: "100%",
            background: "linear-gradient(160deg, var(--surface-900) 0%, var(--surface-800) 100%)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "2rem",
            boxShadow: "0 24px 80px hsl(0 0% 0% / 0.4)",
          }}
        >
          {/* Tab switch */}
          <div
            style={{
              display: "flex",
              gap: "0.25rem",
              background: "var(--surface-950)",
              padding: "4px",
              borderRadius: 11,
              marginBottom: "1.75rem",
              border: "1px solid var(--border)",
            }}
          >
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError("");
                  setSuccessMsg("");
                }}
                style={{
                  flex: 1,
                  padding: "0.55rem",
                  borderRadius: 8,
                  border: "none",
                  background:
                    mode === m
                      ? "linear-gradient(135deg, var(--surface-700) 0%, var(--surface-600) 100%)"
                      : "transparent",
                  color: mode === m ? "white" : "var(--text-muted)",
                  fontSize: "0.875rem",
                  fontWeight: mode === m ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                }}
              >
                {m === "login" ? (
                  <>
                    <LogIn size={14} /> Connexion
                  </>
                ) : (
                  <>
                    <UserPlus size={14} /> Créer un compte
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Alerts */}
          {error && (
            <div
              className="animate-slide-down"
              style={{
                padding: "0.75rem 1rem",
                borderRadius: 10,
                background: "hsl(350 89% 60% / 0.08)",
                border: "1px solid hsl(350 89% 60% / 0.2)",
                color: "var(--danger)",
                fontSize: "0.875rem",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
              }}
            >
              <span style={{ flexShrink: 0, marginTop: 1 }}>⚠️</span>
              {error}
            </div>
          )}
          {successMsg && (
            <div
              className="animate-slide-down"
              style={{
                padding: "0.75rem 1rem",
                borderRadius: 10,
                background: "hsl(158 76% 44% / 0.08)",
                border: "1px solid hsl(158 76% 44% / 0.2)",
                color: "var(--success)",
                fontSize: "0.875rem",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <CheckCircle2 size={16} />
              {successMsg}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Register fields */}
            {mode === "register" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label
                    htmlFor="firstName"
                    style={{
                      display: "block",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Prénom
                  </label>
                  <div style={{ position: "relative" }}>
                    <User
                      size={15}
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-faint)",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jean"
                      required
                      style={{ paddingLeft: "2.25rem" }}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    style={{
                      display: "block",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Nom
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dupont"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "0.4rem",
                }}
              >
                Adresse e-mail
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-faint)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@frameitup.com"
                  autoComplete="email"
                  required
                  style={{ paddingLeft: "2.25rem" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "0.4rem",
                }}
              >
                Mot de passe
                {mode === "register" && (
                  <span style={{ fontWeight: 400, color: "var(--text-faint)", marginLeft: 6 }}>
                    (min. 10 car., lettres + chiffres)
                  </span>
                )}
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-faint)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  style={{ paddingLeft: "2.25rem", paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-faint)",
                    display: "flex",
                    padding: 4,
                    borderRadius: 5,
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-faint)")
                  }
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "0.875rem",
                fontSize: "0.9375rem",
                marginTop: "0.25rem",
                borderRadius: 11,
              }}
            >
              {loading ? (
                <span
                  className="animate-spin"
                  style={{
                    width: 18,
                    height: 18,
                    border: "2.5px solid hsl(34 80% 12% / 0.4)",
                    borderTopColor: "hsl(34 80% 12%)",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                />
              ) : mode === "login" ? (
                <>
                  Se connecter
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Créer le compte propriétaire
                </>
              )}
            </button>
          </form>

          {/* Security note */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1rem",
              borderRadius: 10,
              background: "var(--surface-950)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <ShieldCheck
              size={15}
              style={{ color: "var(--brand-400)", flexShrink: 0, marginTop: 1 }}
            />
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              <span style={{ color: "var(--brand-300)", fontWeight: 600 }}>
                Connexion sécurisée.
              </span>{" "}
              Sessions chiffrées, verrouillage après 5 tentatives, journalisation des accès.
            </div>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "var(--text-faint)",
            fontSize: "0.75rem",
            marginTop: "1.5rem",
          }}
        >
          FrameItUp © {new Date().getFullYear()} — Tableau de bord d&apos;atelier
        </p>
      </div>
    </div>
  );
}
