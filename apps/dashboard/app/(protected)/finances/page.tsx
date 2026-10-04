"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { TrendingUp, TrendingDown, ArrowUpRight, Search } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useAuth } from "@/lib/AuthContext";

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FinancesPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const { token } = useAuth();

  const transactions = useQuery(
    api.queries.finances.listAll,
    token ? { sessionToken: token, limit: 50 } : "skip"
  );
  const summary = useQuery(
    api.queries.finances.summary,
    token ? { sessionToken: token } : "skip"
  );

  const totalIncome = summary?.totalIncome ?? 0;
  const totalExpense = summary?.totalExpense ?? 0;
  const net = summary?.net ?? 0;

  const filteredTransactions = transactions?.filter((t: any) => {
    if (filterType !== "all" && t.type !== filterType) return false;
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      t.description.toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term) ||
      (t.paymentMethod ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <>
      <Topbar title="Finances" subtitle="Revenus, dépenses et flux de trésorerie en direct de Convex" />
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Quick summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
          <div className="kpi-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Total Revenus</span>
              <TrendingUp size={18} style={{ color: "var(--success)" }} />
            </div>
            <div style={{ fontFamily: "var(--font-outfit)", fontSize: "1.75rem", fontWeight: 800, color: "var(--success)", letterSpacing: "-0.02em" }}>
              +{totalIncome.toLocaleString("fr-FR")} <span style={{ fontSize: "1rem", fontWeight: 500 }}>FCFA</span>
            </div>
          </div>

          <div className="kpi-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Total Dépenses</span>
              <TrendingDown size={18} style={{ color: "var(--danger)" }} />
            </div>
            <div style={{ fontFamily: "var(--font-outfit)", fontSize: "1.75rem", fontWeight: 800, color: "var(--danger)", letterSpacing: "-0.02em" }}>
              -{totalExpense.toLocaleString("fr-FR")} <span style={{ fontSize: "1rem", fontWeight: 500 }}>FCFA</span>
            </div>
          </div>

          <div className="kpi-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Bénéfice Net</span>
              <ArrowUpRight size={18} style={{ color: net >= 0 ? "var(--brand-400)" : "var(--danger)" }} />
            </div>
            <div style={{ fontFamily: "var(--font-outfit)", fontSize: "1.75rem", fontWeight: 800, color: net >= 0 ? "var(--brand-300)" : "var(--danger)", letterSpacing: "-0.02em" }}>
              {net >= 0 ? "+" : ""}{net.toLocaleString("fr-FR")} <span style={{ fontSize: "1rem", fontWeight: 500 }}>FCFA</span>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.0625rem", fontWeight: 700, color: "white", margin: 0 }}>
              Transactions ({filteredTransactions?.length ?? 0})
            </h2>
            <div style={{ display: "flex", gap: "0.625rem", alignItems: "center", flexWrap: "wrap" }}>
              {/* Search */}
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filtrer une transaction…"
                  style={{ width: 200, paddingLeft: 32, paddingTop: "0.5rem", paddingBottom: "0.5rem", fontSize: "0.8125rem" }}
                  aria-label="Rechercher une transaction"
                />
              </div>

              {/* Type filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  background: "var(--surface-800)",
                  color: "white",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                }}
              >
                <option value="all">Toutes les opérations</option>
                <option value="income">Revenus uniquement</option>
                <option value="expense">Dépenses uniquement</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            {filteredTransactions === undefined ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                Chargement des transactions depuis Convex...
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                Aucune transaction enregistrée.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Catégorie</th>
                    <th>Méthode</th>
                    <th>Date</th>
                    <th style={{ textAlign: "right" }}>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t: any) => (
                    <tr key={t._id}>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: t.type === "income" ? "var(--success)" : "var(--danger)" }}>
                          {t.type === "income" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                          {t.type === "income" ? "Revenu" : "Dépense"}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: "white", fontWeight: 500 }}>{t.description}</span>
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontSize: "0.75rem" }}>{t.category}</span>
                      </td>
                      <td style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                        {t.paymentMethod ?? "—"}
                      </td>
                      <td style={{ fontSize: "0.8125rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                        {formatDate(t.transactionDate)}
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-jetbrains-mono)", fontWeight: 700, color: t.type === "income" ? "var(--success)" : "var(--danger)", fontSize: "0.875rem" }}>
                        {t.type === "income" ? "+" : "-"}{t.amount.toLocaleString("fr-FR")} FCFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
