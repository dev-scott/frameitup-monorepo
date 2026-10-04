"use client";

import { AlertTriangle, AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useAuth } from "@/lib/AuthContext";

export function StockAlerts() {
  const { token } = useAuth();
  const alerts = useQuery(
    api.queries.stock.alerts,
    token ? { sessionToken: token } : "skip"
  );

  const critical = alerts?.filter((a: any) => a.severity === "critical") ?? [];
  const warnings = alerts?.filter((a: any) => a.severity === "warning") ?? [];

  return (
    <div className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.0625rem", fontWeight: 700, color: "white", margin: 0 }}>
          Alertes stock
        </h2>
        <Link
          href="/stock"
          style={{
            fontSize: "0.75rem",
            color: "var(--brand-300)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          Voir tout <ChevronRight size={13} />
        </Link>
      </div>

      {/* Counters */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div
          style={{
            padding: "0.75rem",
            borderRadius: 10,
            background: "hsl(350 89% 56% / 0.08)",
            border: "1px solid hsl(350 89% 56% / 0.2)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--danger)" }}>{critical.length}</div>
          <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: 2 }}>Critiques</div>
        </div>
        <div
          style={{
            padding: "0.75rem",
            borderRadius: 10,
            background: "hsl(43 80% 42% / 0.08)",
            border: "1px solid hsl(43 80% 42% / 0.2)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--warning)" }}>{warnings.length}</div>
          <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: 2 }}>Avertissements</div>
        </div>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {alerts === undefined ? (
          <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>
            Vérification des stocks...
          </div>
        ) : alerts.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", color: "var(--success)", fontSize: "0.8125rem", justifyContent: "center" }}>
            <CheckCircle2 size={16} /> Tous les niveaux de stock sont optimaux
          </div>
        ) : (
          alerts.map((alert: any) => (
            <div
              key={alert.sku}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 0.75rem",
                borderRadius: 10,
                background: "var(--surface-800)",
                border: `1px solid ${alert.severity === "critical" ? "hsl(350 89% 56% / 0.15)" : "hsl(43 80% 42% / 0.1)"}`,
              }}
            >
              {alert.severity === "critical" ? (
                <AlertCircle size={16} style={{ color: "var(--danger)", flexShrink: 0 }} />
              ) : (
                <AlertTriangle size={16} style={{ color: "var(--warning)", flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 500, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {alert.name}
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>{alert.sku}</div>
              </div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: alert.severity === "critical" ? "var(--danger)" : "var(--warning)",
                  flexShrink: 0,
                }}
              >
                {alert.qty}/{alert.threshold}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
