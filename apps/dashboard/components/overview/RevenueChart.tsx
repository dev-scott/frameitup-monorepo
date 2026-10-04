"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useAuth } from "@/lib/AuthContext";

const PERIOD_DAYS: Record<"7J" | "30J" | "3M", number> = {
  "7J": 7,
  "30J": 30,
  "3M": 90,
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--surface-800)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "0.875rem 1.125rem",
        boxShadow: "0 8px 32px hsl(0 0% 0% / 0.5)",
        minWidth: 180,
      }}
    >
      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8, margin: "0 0 8px" }}>{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 4 }}>
          <span style={{ fontSize: "0.8125rem", color: entry.color }}>{entry.dataKey === "revenus" ? "Revenus" : "Dépenses"}</span>
          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: entry.color }}>
            {Number(entry.value).toLocaleString("fr-FR")} FCFA
          </span>
        </div>
      ))}
    </div>
  );
};

export function RevenueChart() {
  const [period, setPeriod] = useState<"7J" | "30J" | "3M">("30J");
  const days = PERIOD_DAYS[period];
  const { token } = useAuth();

  const dbData = useQuery(
    api.queries.analytics.dailyRevenue,
    token ? { sessionToken: token, days } : "skip"
  );

  // Préparer un jeu de données complet pour chaque jour
  const chartData = useMemo(() => {
    const mapByDate = new Map<string, { revenue: number; expenses: number }>();
    if (dbData) {
      for (const item of dbData) {
        mapByDate.set(item.date, { revenue: item.revenue, expenses: item.expenses });
      }
    }

    const result = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const isoDate = d.toISOString().split("T")[0]!;
      const label = d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
      const record = mapByDate.get(isoDate) ?? { revenue: 0, expenses: 0 };
      result.push({
        date: label,
        revenus: record.revenue,
        depenses: record.expenses,
      });
    }
    return result;
  }, [dbData, days]);

  const totalRevenu = chartData.reduce((s, d) => s + d.revenus, 0);
  const totalDepense = chartData.reduce((s, d) => s + d.depenses, 0);

  return (
    <div className="glass-card animate-fade-in" style={{ padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.0625rem", fontWeight: 700, color: "white", margin: 0 }}>
            Revenus &amp; Dépenses
          </h2>
          <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.5rem" }}>
            <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              <span style={{ color: "hsl(43,80%,56%)", fontWeight: 600 }}>
                {totalRevenu.toLocaleString("fr-FR")} FCFA
              </span>
              {" "}revenus
            </span>
            <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              <span style={{ color: "hsl(350,89%,66%)", fontWeight: 600 }}>
                {totalDepense.toLocaleString("fr-FR")} FCFA
              </span>
              {" "}dépenses
            </span>
          </div>
        </div>

        {/* Period selector */}
        <div style={{ display: "flex", gap: "0.375rem", background: "var(--surface-900)", padding: "3px", borderRadius: 10, border: "1px solid var(--border)" }}>
          {(["7J", "30J", "3M"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: "0.3125rem 0.75rem",
                borderRadius: 8,
                border: "none",
                background: period === p ? "linear-gradient(135deg, var(--brand-500) 0%, var(--brand-700) 100%)" : "transparent",
                color: period === p ? "white" : "var(--text-muted)",
                fontSize: "0.75rem",
                fontWeight: period === p ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
                fontFamily: "inherit",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="gradRevenu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="hsl(43,80%,42%)"  stopOpacity={0.35} />
              <stop offset="95%" stopColor="hsl(43,80%,42%)"  stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradDepense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="hsl(350,89%,56%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(350,89%,56%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={period === "3M" ? 13 : period === "30J" ? 5 : 0}
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            width={42}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="revenus"
            stroke="hsl(43,80%,42%)"
            strokeWidth={2.5}
            fill="url(#gradRevenu)"
            dot={false}
            activeDot={{ r: 5, fill: "hsl(43,80%,42%)", strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="depenses"
            stroke="hsl(350,89%,56%)"
            strokeWidth={2}
            fill="url(#gradDepense)"
            dot={false}
            activeDot={{ r: 4, fill: "hsl(350,89%,56%)", strokeWidth: 0 }}
            strokeDasharray="5 4"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
