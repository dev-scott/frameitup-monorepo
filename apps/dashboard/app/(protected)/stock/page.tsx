"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { AlertTriangle, AlertCircle, CheckCircle2, Plus, Search, RefreshCw } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useAuth } from "@/lib/AuthContext";

export default function StockPage() {
  const [search, setSearch] = useState("");
  const { token } = useAuth();
  const stockItems = useQuery(
    api.queries.stock.listAll,
    token ? { sessionToken: token } : "skip"
  );

  const filteredStock = stockItems?.filter((item: any) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      item.sku.toLowerCase().includes(term) ||
      (item.productName ?? "").toLowerCase().includes(term) ||
      (item.location ?? "").toLowerCase().includes(term)
    );
  });

  const critical = (stockItems ?? []).filter((s: any) => s.quantity <= Math.floor(s.reorderPoint / 2)).length;
  const warnings = (stockItems ?? []).filter((s: any) => s.quantity > Math.floor(s.reorderPoint / 2) && s.quantity <= s.reorderPoint).length;
  const ok = (stockItems ?? []).filter((s: any) => s.quantity > s.reorderPoint).length;

  return (
    <>
      <Topbar title="Gestion du stock" subtitle="Inventaire, mouvements et alertes de rupture en direct de Convex" />
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          {[
            { label: "Références en stock", value: stockItems?.length ?? 0, color: "white" },
            { label: "Critiques (≤ 50% seuil)", value: critical, color: "var(--danger)" },
            { label: "Sous le seuil", value: warnings, color: "var(--warning)" },
            { label: "Niveaux OK", value: ok, color: "var(--success)" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: "2.25rem", fontWeight: 800, color: s.color, fontFamily: "var(--font-outfit)", letterSpacing: "-0.02em" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", gap: "1rem", flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.0625rem", fontWeight: 700, color: "white", margin: 0 }}>
              Inventaire ({filteredStock?.length ?? 0})
            </h2>
            <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Chercher un produit, SKU…"
                  style={{ width: 220, paddingLeft: 32, paddingTop: "0.5rem", paddingBottom: "0.5rem", fontSize: "0.8125rem" }}
                  aria-label="Rechercher dans le stock"
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            {filteredStock === undefined ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                Chargement des niveaux de stock depuis Convex...
              </div>
            ) : filteredStock.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                Aucun article de stock enregistré pour le moment.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Produit</th>
                    <th style={{ textAlign: "center" }}>Stock</th>
                    <th style={{ textAlign: "center" }}>Réservé</th>
                    <th style={{ textAlign: "center" }}>Seuil</th>
                    <th style={{ textAlign: "center" }}>Niveau</th>
                    <th>Emplacement</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStock.map((item: any) => {
                    const isCritical = item.quantity <= Math.floor(item.reorderPoint / 2);
                    const isWarning = !isCritical && item.quantity <= item.reorderPoint;
                    const pct = Math.round((item.quantity / Math.max(item.reorderPoint, 1)) * 100);
                    const barColor = isCritical ? "var(--danger)" : isWarning ? "var(--warning)" : "var(--success)";

                    return (
                      <tr key={item._id}>
                        <td>
                          <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8125rem", color: "var(--brand-300)", fontWeight: 600 }}>
                            {item.sku}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: "white", fontWeight: 500 }}>{item.productName}</span>
                        </td>
                        <td style={{ textAlign: "center", fontWeight: 700, color: barColor, fontFamily: "var(--font-jetbrains-mono)" }}>
                          {item.quantity}
                        </td>
                        <td style={{ textAlign: "center", color: "var(--text-muted)" }}>
                          {item.reservedQuantity ?? 0}
                        </td>
                        <td style={{ textAlign: "center", color: "var(--text-muted)" }}>
                          {item.reorderPoint}
                        </td>
                        <td style={{ textAlign: "center", minWidth: 80 }}>
                          <div style={{ height: 6, borderRadius: 3, background: "var(--surface-700)", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: barColor, borderRadius: 3, transition: "width 0.5s ease" }} />
                          </div>
                          <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: 2, display: "block" }}>{pct}%</span>
                        </td>
                        <td style={{ fontSize: "0.8125rem" }}>{item.location ?? "Non assigné"}</td>
                        <td>
                          {isCritical ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--danger)", fontSize: "0.8125rem" }}>
                              <AlertCircle size={13} /> Critique
                            </span>
                          ) : isWarning ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--warning)", fontSize: "0.8125rem" }}>
                              <AlertTriangle size={13} /> Alerte
                            </span>
                          ) : (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--success)", fontSize: "0.8125rem" }}>
                              <CheckCircle2 size={13} /> Optimal
                            </span>
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
