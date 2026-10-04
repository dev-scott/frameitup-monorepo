"use client";

import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useAuth } from "@/lib/AuthContext";
import { TrendingUp, TrendingDown, ShoppingBag, Users, Package, DollarSign, Activity } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  delta: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  sublabel?: string;
  delay?: number;
}

function KPICard({ label, value, delta, icon: Icon, iconColor, iconBg, iconBorder, sublabel, delay = 0 }: KPICardProps) {
  const isPositive = delta >= 0;
  const isNeutral = delta === 0;

  return (
    <div className="kpi-card animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: iconBg,
            border: `1px solid ${iconBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={21} color={iconColor} />
        </div>

        {!isNeutral && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.2rem 0.6rem",
              borderRadius: 99,
              fontSize: "0.72rem",
              fontWeight: 700,
              background: isPositive ? "hsl(158 76% 44% / 0.1)" : "hsl(350 89% 60% / 0.1)",
              color: isPositive ? "var(--success)" : "var(--danger)",
              border: `1px solid ${isPositive ? "hsl(158 76% 44% / 0.2)" : "hsl(350 89% 60% / 0.2)"}`,
            }}
          >
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(delta)}%
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        <div
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "white",
            lineHeight: 1,
            marginBottom: "0.375rem",
            letterSpacing: "-0.025em",
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500 }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: "0.7rem", color: "var(--text-faint)", marginTop: 4 }}>
            {sublabel}
          </div>
        )}
      </div>

      {/* Bottom accent bar */}
      <div
        style={{
          marginTop: "1rem",
          height: 3,
          borderRadius: 99,
          background: "var(--surface-700)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, Math.abs(delta) * 3 + 20)}%`,
            borderRadius: 99,
            background: isPositive
              ? "linear-gradient(90deg, var(--success) 0%, hsl(158 76% 60%) 100%)"
              : isNeutral
              ? "var(--surface-500)"
              : "linear-gradient(90deg, var(--danger) 0%, hsl(350 89% 75%) 100%)",
            transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  );
}

function KPICardSkeleton() {
  return (
    <div className="kpi-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="skeleton" style={{ width: 46, height: 46, borderRadius: 13 }} />
        <div className="skeleton" style={{ width: 60, height: 24, borderRadius: 99 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="skeleton" style={{ height: 32, width: "60%", borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 14, width: "40%", borderRadius: 6 }} />
      </div>
    </div>
  );
}

export function KPIGrid() {
  const { token } = useAuth();

  const snapshot = useQuery(
    api.queries.analytics.kpiSnapshot,
    token ? { sessionToken: token, period: "month" } : "skip"
  );

  if (!token || snapshot === undefined) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
        {[...Array(4)].map((_, i) => <KPICardSkeleton key={i} />)}
      </div>
    );
  }

  const revenueAmount = snapshot?.totalRevenue?.amount ?? 0;
  const totalOrders = snapshot?.totalOrders ?? 0;
  const stockAlerts = snapshot?.stockAlerts ?? 0;
  const newCustomers = snapshot?.newCustomers ?? 0;
  const aov = snapshot?.aov ?? 0;

  const kpis: KPICardProps[] = [
    {
      label: "Revenus ce mois",
      value: `${revenueAmount.toLocaleString("fr-FR")} FCFA`,
      delta: snapshot?.revenueDelta ?? 0,
      icon: DollarSign,
      iconColor: "hsl(43, 80%, 52%)",
      iconBg: "hsl(43 80% 42% / 0.14)",
      iconBorder: "hsl(43 80% 42% / 0.2)",
      sublabel: `Panier moy. : ${aov.toLocaleString("fr-FR")} FCFA`,
    },
    {
      label: "Commandes",
      value: String(totalOrders),
      delta: snapshot?.ordersDelta ?? 0,
      icon: ShoppingBag,
      iconColor: "hsl(212, 100%, 65%)",
      iconBg: "hsl(212 100% 62% / 0.12)",
      iconBorder: "hsl(212 100% 62% / 0.2)",
      sublabel: `${snapshot?.toProcess ?? 0} à traiter`,
    },
    {
      label: "Nouveaux clients",
      value: String(newCustomers),
      delta: snapshot?.customersDelta ?? 0,
      icon: Users,
      iconColor: "hsl(270, 76%, 70%)",
      iconBg: "hsl(270 76% 65% / 0.12)",
      iconBorder: "hsl(270 76% 65% / 0.2)",
      sublabel: `${snapshot?.totalCustomers ?? 0} clients au total`,
    },
    {
      label: "Alertes stock",
      value: String(stockAlerts),
      delta: 0,
      icon: Package,
      iconColor: stockAlerts > 0 ? "hsl(350, 89%, 65%)" : "hsl(158, 76%, 50%)",
      iconBg: stockAlerts > 0 ? "hsl(350 89% 60% / 0.12)" : "hsl(158 76% 44% / 0.12)",
      iconBorder: stockAlerts > 0 ? "hsl(350 89% 60% / 0.2)" : "hsl(158 76% 44% / 0.2)",
      sublabel: stockAlerts === 0 ? "Stock optimal" : "Nécessite attention",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
      {kpis.map((kpi, i) => (
        <KPICard key={kpi.label} {...kpi} delay={i * 70} />
      ))}
    </div>
  );
}
