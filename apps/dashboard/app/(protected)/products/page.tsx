"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Plus, Edit, Eye, Search } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useAuth } from "@/lib/AuthContext";

const STATUS_COLORS: Record<string, string> = {
  active: "var(--success)",
  draft: "var(--warning)",
  archived: "var(--text-muted)",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  draft: "Brouillon",
  archived: "Archivé",
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { token } = useAuth();

  const products = useQuery(
    api.queries.products.listAll,
    token ? { sessionToken: token, category: category === "all" ? undefined : category } : "skip"
  );

  const stockList = useQuery(
    api.queries.stock.listAll,
    token ? { sessionToken: token } : "skip"
  );

  // Carte de stock par ID de produit
  const stockByProductId = new Map<string, number>();
  if (stockList) {
    for (const item of stockList) {
      stockByProductId.set(String(item.productId), item.quantity);
    }
  }

  const filteredProducts = products?.filter((p: any) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      (p.description ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <>
      <Topbar title="Produits" subtitle="Catalogue, prix et gestion des produits en direct de Convex" />

      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          {/* Header Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.0625rem", fontWeight: 700, color: "white", margin: 0 }}>
                Catalogue produits ({filteredProducts?.length ?? 0})
              </h2>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
              {/* Search */}
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un produit…"
                  style={{ width: 220, paddingLeft: 32, paddingTop: "0.5rem", paddingBottom: "0.5rem", fontSize: "0.8125rem" }}
                  aria-label="Rechercher un produit"
                />
              </div>

              {/* Category Filter */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                <option value="all">Toutes les catégories</option>
                <option value="cadre">Cadres</option>
                <option value="tableau">Tableaux</option>
                <option value="accessoire">Accessoires</option>
                <option value="service">Services</option>
              </select>

              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, var(--brand-500) 0%, var(--brand-700) 100%)",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                <Plus size={15} /> Nouveau produit
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            {filteredProducts === undefined ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                Chargement des produits depuis Convex...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                Aucun produit trouvé dans cette catégorie.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Produit</th>
                    <th>Catégorie</th>
                    <th>Statut</th>
                    <th style={{ textAlign: "right" }}>Prix</th>
                    <th style={{ textAlign: "center" }}>Stock</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p: any) => {
                    const currentStock = stockByProductId.get(String(p._id)) ?? 0;
                    return (
                      <tr key={p._id}>
                        <td>
                          <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8125rem", color: "var(--brand-300)" }}>
                            {p.sku}
                          </span>
                        </td>
                        <td>
                          <div style={{ color: "white", fontWeight: 500 }}>{p.name}</div>
                          {p.description && (
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {p.description}
                            </div>
                          )}
                        </td>
                        <td style={{ textTransform: "capitalize" }}>{p.category}</td>
                        <td>
                          <span style={{ color: STATUS_COLORS[p.status] ?? "var(--text-muted)", fontSize: "0.8125rem" }}>
                            ● {STATUS_LABELS[p.status] ?? p.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 600, color: "white", fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8125rem" }}>
                          {p.priceAmount.toLocaleString("fr-FR")} {p.priceCurrency ?? "FCFA"}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: 600, color: currentStock <= 5 ? "var(--danger)" : "white" }}>
                          {currentStock}
                        </td>
                        <td style={{ textAlign: "center" }}>{p.isFeatured ? "⭐" : "—"}</td>
                        <td>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button
                              title="Voir"
                              style={{
                                padding: "4px 8px",
                                borderRadius: 6,
                                border: "1px solid var(--border)",
                                background: "var(--surface-700)",
                                color: "var(--text-secondary)",
                                cursor: "pointer",
                              }}
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              title="Modifier"
                              style={{
                                padding: "4px 8px",
                                borderRadius: 6,
                                border: "1px solid hsl(43 80% 42% / 0.25)",
                                background: "hsl(43 80% 42% / 0.1)",
                                color: "var(--brand-300)",
                                cursor: "pointer",
                              }}
                            >
                              <Edit size={13} />
                            </button>
                          </div>
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
