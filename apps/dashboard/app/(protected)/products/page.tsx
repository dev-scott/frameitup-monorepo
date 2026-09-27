import type { Metadata } from "next";
import { Topbar } from "@/components/layout/Topbar";
import { Plus, Edit, Eye } from "lucide-react";

export const metadata: Metadata = { title: "Produits" };

const MOCK_PRODUCTS = [
  { sku: "CAD-CHE-01", name: "Cadre Chêne Massif", category: "cadre", status: "active", price: "45 000", stock: 23, featured: true },
  { sku: "CAD-NOIR-02", name: "Cadre Laqué Noir", category: "cadre", status: "active", price: "38 500", stock: 15, featured: false },
  { sku: "TAB-ABS-01", name: "Tableau Abstrait Contemporain", category: "tableau", status: "active", price: "125 000", stock: 8, featured: true },
  { sku: "CAD-DORE-03", name: "Cadre Doré Baroque", category: "cadre", status: "draft", price: "78 000", stock: 5, featured: false },
  { sku: "ACC-PAS-01", name: "Passe-partout Sur-Mesure", category: "accessoire", status: "active", price: "12 000", stock: 40, featured: false },
  { sku: "SRV-INST-01", name: "Service d'installation", category: "service", status: "active", price: "25 000", stock: 999, featured: false },
];

const STATUS_COLORS = { active: "var(--success)", draft: "var(--warning)", archived: "var(--text-muted)" };
const STATUS_LABELS = { active: "Actif", draft: "Brouillon", archived: "Archivé" };

export default function ProductsPage() {
  return (
    <>
      <Topbar title="Produits" subtitle="Catalogue, prix et gestion des produits" />

      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.0625rem", fontWeight: 700, color: "white", margin: 0 }}>Catalogue produits</h2>
            <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: 10, border: "none", background: "linear-gradient(135deg, var(--brand-500) 0%, var(--brand-700) 100%)", color: "white", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>
              <Plus size={15} /> Nouveau produit
            </button>
          </div>

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
              {MOCK_PRODUCTS.map((p) => (
                <tr key={p.sku}>
                  <td><span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8125rem", color: "var(--brand-300)" }}>{p.sku}</span></td>
                  <td><span style={{ color: "white", fontWeight: 500 }}>{p.name}</span></td>
                  <td style={{ textTransform: "capitalize" }}>{p.category}</td>
                  <td><span style={{ color: STATUS_COLORS[p.status as keyof typeof STATUS_COLORS], fontSize: "0.8125rem" }}>● {STATUS_LABELS[p.status as keyof typeof STATUS_LABELS]}</span></td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: "white" }}>{p.price} FCFA</td>
                  <td style={{ textAlign: "center" }}>{p.stock}</td>
                  <td style={{ textAlign: "center" }}>{p.featured ? "⭐" : "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button title="Voir" style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-700)", color: "var(--text-secondary)", cursor: "pointer" }}><Eye size={13} /></button>
                      <button title="Modifier" style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid hsl(43 80% 42% / 0.25)", background: "hsl(43 80% 42% / 0.1)", color: "var(--brand-300)", cursor: "pointer" }}><Edit size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
