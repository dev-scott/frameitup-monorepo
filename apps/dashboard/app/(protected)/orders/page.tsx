"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Filter, Download, Search, CheckCircle, Clock, Truck, PackageCheck } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex";

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

function formatRelativeTime(timestamp: number) {
  const diffMinutes = Math.floor((Date.now() - timestamp) / (60 * 1000));
  if (diffMinutes < 1) return "À l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays} j`;
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const orders = useQuery(api.queries.orders.listAll, { status: selectedStatus });
  const stats = useQuery(api.queries.orders.stats);

  const filteredOrders = orders?.filter((order: any) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const orderNum = (order.orderNumber ?? "").toLowerCase();
    const customer = (order.shippingAddress?.fullName ?? "").toLowerCase();
    const email = (order.customerEmail ?? "").toLowerCase();
    const city = (order.shippingAddress?.city ?? "").toLowerCase();
    return orderNum.includes(term) || customer.includes(term) || email.includes(term) || city.includes(term);
  });

  const STATS_ITEMS = [
    { label: "Total commandes", value: stats?.total ?? 0, color: "white" },
    { label: "En fabrication",  value: stats?.processing ?? 0, color: "var(--info)" },
    { label: "À expédier / Prêtes", value: (stats?.ready ?? 0) + (stats?.pending ?? 0), color: "var(--warning)" },
    { label: "Livrées", value: stats?.delivered ?? 0, color: "var(--success)" },
  ];

  return (
    <>
      <Topbar title="Commandes" subtitle="Gestion et suivi des commandes clients en direct de Convex" />
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          {STATS_ITEMS.map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: "2.25rem", fontWeight: 800, color: s.color, fontFamily: "var(--font-outfit)", letterSpacing: "-0.02em" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", gap: "1rem", flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.0625rem", fontWeight: 700, color: "white", margin: 0 }}>
              Toutes les commandes ({filteredOrders?.length ?? 0})
            </h2>
            <div style={{ display: "flex", gap: "0.625rem", alignItems: "center", flexWrap: "wrap" }}>
              {/* Search */}
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher (n°, client, ville)…"
                  style={{ width: 240, paddingLeft: 32, paddingTop: "0.5rem", paddingBottom: "0.5rem", fontSize: "0.8125rem" }}
                  aria-label="Rechercher une commande"
                />
              </div>

              {/* Status filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
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
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="processing">En fabrication</option>
                <option value="ready">Prête</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            {filteredOrders === undefined ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                Chargement des commandes depuis Convex...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                Aucune commande ne correspond aux critères.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>N° commande</th>
                    <th>Client</th>
                    <th>Ville</th>
                    <th>Articles</th>
                    <th>Statut</th>
                    <th>Paiement</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order: any) => {
                    const sc = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] ?? {
                      label: order.status,
                      cls: "badge badge-pending",
                    };
                    const itemsCount = (order.lines ?? []).reduce((sum: number, line: any) => sum + (line.quantity || 1), 0);
                    const customerName = order.shippingAddress?.fullName ?? order.customerEmail;
                    const city = order.shippingAddress?.city ?? "Non précisé";
                    const totalFormatted = `${order.totalAmount.toLocaleString("fr-FR")} FCFA`;
                    const dateFormatted = formatRelativeTime(order._creationTime);

                    return (
                      <tr key={order._id}>
                        <td>
                          <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8125rem", color: "var(--brand-300)", fontWeight: 600 }}>
                            {order.orderNumber}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: "white", fontWeight: 500 }}>{customerName}</span>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{order.customerEmail}</div>
                        </td>
                        <td>{city}</td>
                        <td>{itemsCount} article{itemsCount > 1 ? "s" : ""}</td>
                        <td><span className={sc.cls}>{sc.label}</span></td>
                        <td>
                          <span style={{ fontSize: "0.75rem", color: order.paymentStatus === "paid" ? "var(--success)" : "var(--warning)" }}>
                            {order.paymentStatus === "paid" ? "Payé" : "En attente"} {order.paymentMethod ? `(${order.paymentMethod})` : ""}
                          </span>
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 600, color: "white", fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8125rem" }}>
                          {totalFormatted}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>{dateFormatted}</td>
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
