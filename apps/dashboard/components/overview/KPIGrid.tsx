"use client";

import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { TrendingUp, TrendingDown, ShoppingBag, Users, Package, DollarSign } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  delta: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  delay?: number;
}

function KPICard({ label, value, delta, icon: Icon, iconColor, iconBg, delay = 0 }: KPICardProps) {
  const isPositive = delta >= 0;

  return (
    <div
      className="kpi-card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={22} color={iconColor} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: "0.25rem 0.625rem",
            borderRadius: 20,
            fontSize: "0.75rem",
            fontWeight: 600,
            background: isPositive ? "hsl(160 84% 44% / 0.1)" : "hsl(350 89% 56% / 0.1)",
            color: isPositive ? "var(--success)" : "var(--danger)",
            border: `1px solid ${isPositive ? "hsl(160 84% 44% / 0.2)" : "hsl(350 89% 56% / 0.2)"}`,
          }}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(delta)}%
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "1.875rem",
            fontWeight: 700,
            color: "white",
            lineHeight: 1,
            marginBottom: "0.375rem",
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500 }}>
          {label}
        </div>
      </div>
    </div>
  );
}

export function KPIGrid() {
  const snapshot = useQuery(api.queries.analytics.kpiSnapshot, { period: "month" });

  const revenueAmount = snapshot?.totalRevenue?.amount ?? 0;
  const totalOrders = snapshot?.totalOrders ?? 0;
  const stockAlerts = snapshot?.stockAlerts ?? 0;
  const newCustomers = snapshot?.newCustomers ?? 0;

  const kpis: KPICardProps[] = [
    {
      label: "Revenus ce mois",
      value: `${revenueAmount.toLocaleString("fr-FR")} FCFA`,
      delta: snapshot?.revenueDelta ?? 0,
      icon: DollarSign,
      iconColor: "hsl(43, 80%, 42%)",
      iconBg: "hsl(43 80% 42% / 0.15)",
    },
    {
      label: "Commandes",
      value: String(totalOrders),
      delta: snapshot?.ordersDelta ?? 0,
      icon: ShoppingBag,
      iconColor: "hsl(210, 100%, 60%)",
      iconBg: "hsl(210 100% 60% / 0.15)",
    },
    {
      label: "Nouveaux clients",
      value: String(newCustomers),
      delta: snapshot?.customersDelta ?? 0,
      icon: Users,
      iconColor: "hsl(270, 80%, 65%)",
      iconBg: "hsl(270 80% 65% / 0.15)",
    },
    {
      label: "Alertes stock",
      value: String(stockAlerts),
      delta: 0,
      icon: Package,
      iconColor: "hsl(350, 89%, 60%)",
      iconBg: "hsl(350 89% 60% / 0.15)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1.25rem",
      }}
    >
      {kpis.map((kpi, i) => (
        <KPICard key={kpi.label} {...kpi} delay={i * 60} />
      ))}
    </div>
  );
}
