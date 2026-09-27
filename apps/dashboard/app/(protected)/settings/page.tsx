import type { Metadata } from "next";
import { Topbar } from "@/components/layout/Topbar";
import { User, Shield, Globe, Bell } from "lucide-react";

export const metadata: Metadata = { title: "Paramètres" };

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Paramètres" subtitle="Configuration du shop, utilisateurs et rôles" />

      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.5rem", alignItems: "start" }}>
          {/* Sidebar nav settings */}
          <div className="glass-card" style={{ padding: "0.75rem" }}>
            {[
              { label: "Profil", icon: User },
              { label: "Sécurité", icon: Shield },
              { label: "Shop", icon: Globe },
              { label: "Notifications", icon: Bell },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.625rem 0.875rem",
                    borderRadius: 10,
                    border: i === 0 ? "1px solid hsl(43 80% 42% / 0.25)" : "1px solid transparent",
                    background: i === 0 ? "hsl(43 80% 42% / 0.1)" : "transparent",
                    color: i === 0 ? "white" : "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    textAlign: "left",
                  }}
                >
                  <Icon size={16} style={{ color: i === 0 ? "var(--brand-400)" : "var(--text-muted)" }} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="glass-card" style={{ padding: "2rem" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.125rem", fontWeight: 700, color: "white", margin: "0 0 1.5rem" }}>
              Profil administrateur
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 480 }}>
              {[
                { label: "Prénom", value: "Admin", type: "text" },
                { label: "Nom", value: "FrameItUp", type: "text" },
                { label: "Email", value: "admin@frameitup.com", type: "email" },
                { label: "Rôle", value: "super_admin", type: "text", disabled: true },
              ].map((field) => (
                <div key={field.label}>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    disabled={field.disabled}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                      background: field.disabled ? "var(--surface-900)" : "var(--surface-800)",
                      color: field.disabled ? "var(--text-muted)" : "white",
                      fontSize: "0.9375rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}

              <button
                style={{
                  marginTop: "0.5rem",
                  alignSelf: "flex-start",
                  padding: "0.625rem 1.5rem",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, var(--brand-500) 0%, var(--brand-700) 100%)",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.9375rem",
                }}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
