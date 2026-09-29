"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Star, Search } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [vipFilter, setVipFilter] = useState<string>("all");

  const customers = useQuery(api.queries.customers.listAll, {
    isVip: vipFilter === "vip" ? true : undefined,
  });

  const filteredCustomers = customers?.filter((c: any) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const email = (c.email ?? "").toLowerCase();
    const city = (c.addresses?.[0]?.city ?? "").toLowerCase();
    return fullName.includes(term) || email.includes(term) || city.includes(term);
  });

  const totalClients = customers?.length ?? 0;
  const vipCount = (customers ?? []).filter((c: any) => c.isVip).length;

  return (
    <>
      <Topbar title="Clients" subtitle="CRM — Profils clients et historique d'achats en direct de Convex" />

      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {[
            { label: "Total clients enregistrés", value: String(totalClients) },
            { label: "Clients VIP", value: String(vipCount) },
            { label: "Taux VIP", value: totalClients > 0 ? `${Math.round((vipCount / totalClients) * 100)}%` : "0%" },
          ].map((s) => (
            <div key={s.label} className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "white", fontFamily: "var(--font-outfit)" }}>{s.value}</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", gap: "1rem", flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.0625rem", fontWeight: 700, color: "white", margin: 0 }}>
              Liste des clients ({filteredCustomers?.length ?? 0})
            </h2>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
              {/* Search */}
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher (nom, email, ville)…"
                  style={{ width: 220, paddingLeft: 32, paddingTop: "0.5rem", paddingBottom: "0.5rem", fontSize: "0.8125rem" }}
                  aria-label="Rechercher un client"
                />
              </div>

              {/* VIP selector */}
              <select
                value={vipFilter}
                onChange={(e) => setVipFilter(e.target.value)}
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
                <option value="all">Tous les clients</option>
                <option value="vip">Uniquement les VIP</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            {filteredCustomers === undefined ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                Chargement des clients depuis Convex...
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                Aucun client ne correspond à votre recherche.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Téléphone</th>
                    <th>Ville</th>
                    <th style={{ textAlign: "center" }}>Commandes</th>
                    <th style={{ textAlign: "right" }}>Total dépensé</th>
                    <th style={{ textAlign: "center" }}>VIP</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c: any) => {
                    const city = c.addresses?.[0]?.city ?? "—";
                    const totalSpent = `${(c.totalSpentAmount ?? 0).toLocaleString("fr-FR")} ${c.totalSpentCurrency ?? "FCFA"}`;
                    return (
                      <tr key={c._id} style={{ cursor: "pointer" }}>
                        <td>
                          <div style={{ color: "white", fontWeight: 500 }}>
                            {c.firstName} {c.lastName}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{c.email}</div>
                        </td>
                        <td style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                          {c.phone ?? "—"}
                        </td>
                        <td>{city}</td>
                        <td style={{ textAlign: "center", fontWeight: 600, color: "white" }}>
                          {c.totalOrders ?? 0}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 600, color: "var(--brand-300)" }}>
                          {totalSpent}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {c.isVip ? (
                            <Star size={15} style={{ color: "hsl(43,80%,56%)", fill: "hsl(43,80%,56%)", display: "inline-block" }} />
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
