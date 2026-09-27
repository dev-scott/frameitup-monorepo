import type { Metadata } from "next";
import { Topbar } from "@/components/layout/Topbar";
import { Filter, Plus, Download, Search } from "lucide-react";

export const metadata: Metadata = { title: "Commandes" };

const STATUS_CONFIG = {
  pending:    { label: "En attente",     cls: "badge badge-pending" },
  confirmed:  { label: "Confirmée",      cls: "badge badge-confirmed" },
  processing: { label: "En fabrication", cls: "badge badge-processing" },
  ready:      { label: "Prête",          cls: "badge badge-delivered" },
  shipped:    { label: "Expédiée",       cls: "badge badge-confirmed" },
  delivered:  { label: "Livrée",         cls: "badge badge-delivered" },
  cancelled:  { label: "Annulée",        cls: "badge badge-cancelled" },
  refunded:   { label: "Remboursée",     cls: "badge badge-cancelled" },
} as const;

const STATUSES = Object.keys(STATUS_CONFIG) as Array<keyof typeof STATUS_CONFIG>;

const MOCK_ORDERS = Array.from({ length: 18 }, (_, i) => ({
  id: String(i + 1),
  orderNumber: `#FIU-2026-${String(127 - i).padStart(4, "0")}`,
  customer: ["Kouassi Amani", "Fatou Diallo", "Jean-Marc Bah", "Aminata Koné", "David Mensah", "Aïcha Traoré", "Mamadou Sow", "Grace Osei"][i % 8]!,
  city: ["Abidjan", "Dakar", "Conakry", "Bamako", "Accra", "Lomé", "Cotonou", "Ouagadougou"][i % 8]!,
  status: STATUSES[i % STATUSES.length]!,
  total: (Math.floor(Math.random() * 400 + 50) * 1000),
  items: Math.floor(Math.random() * 4) + 1,
  date: i === 0 ? "Il y a 12 min" : i === 1 ? "Il y a 1h" : i < 5 ? `Il y a ${i + 1}h` : `Il y a ${i} h`,
}));

const STATS = [
  { label: "Total",     value: "127", color: "white" },
  { label: "En cours",  value: "34",  color: "var(--info)" },
  { label: "À expédier",value: "12",  color: "var(--warning)" },
  { label: "Livrées",   value: "81",  color: "var(--success)" },
];

export default function OrdersPage() {
  return (
    <>
      <Topbar title="Commandes" subtitle="Gestion et suivi des commandes clients" />
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          {STATS.map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: "2.25rem", fontWeight: 800, color: s.color, fontFamily: "var(--font-outfit)", letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", gap: "1rem", flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.0625rem", fontWeight: 700, color: "white", margin: 0 }}>
              Toutes les commandes
            </h2>
            <div style={{ display: "flex", gap: "0.625rem", alignItems: "center", flexWrap: "wrap" }}>
              {/* Search */}
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  placeholder="Rechercher une commande…"
                  style={{ width: 220, paddingLeft: 32, paddingTop: "0.5rem", paddingBottom: "0.5rem", fontSize: "0.8125rem" }}
                  aria-label="Rechercher une commande"
                />
              </div>
              <button className="btn-ghost"><Filter size={14} /> Filtrer</button>
              <button className="btn-ghost"><Download size={14} /> Exporter</button>
              <button className="btn-primary"><Plus size={14} /> Nouvelle commande</button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>N° commande</th>
                  <th>Client</th>
                  <th>Ville</th>
                  <th>Articles</th>
                  <th>Statut</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ORDERS.map((order) => {
                  const sc = STATUS_CONFIG[order.status];
                  return (
                    <tr key={order.id}>
                      <td>
                        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8125rem", color: "var(--brand-300)", fontWeight: 600 }}>
                          {order.orderNumber}
                        </span>
                      </td>
                      <td><span style={{ color: "white", fontWeight: 500 }}>{order.customer}</span></td>
                      <td>{order.city}</td>
                      <td>{order.items} article{order.items > 1 ? "s" : ""}</td>
                      <td><span className={sc.cls}>{sc.label}</span></td>
                      <td style={{ textAlign: "right", fontWeight: 600, color: "white", fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8125rem" }}>
                        {order.total.toLocaleString("fr-FR")} FCFA
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>{order.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>18 résultats sur 127</span>
            <div style={{ display: "flex", gap: "0.375rem" }}>
              {[1, 2, 3, "…", 8].map((p, i) => (
                <button
                  key={i}
                  className={p === 1 ? "btn-primary" : "btn-ghost"}
                  style={{ width: 34, height: 34, padding: 0, justifyContent: "center", fontSize: "0.8125rem" }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
