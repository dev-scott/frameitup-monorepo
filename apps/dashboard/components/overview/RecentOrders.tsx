"use client";

import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";

const STATUS_CONFIG = {
  pending:    { label: "En attente",   className: "badge badge-pending" },
  confirmed:  { label: "Confirmée",    className: "badge badge-confirmed" },
  processing: { label: "En fabrication", className: "badge badge-processing" },
  ready:      { label: "Prête",        className: "badge badge-delivered" },
  shipped:    { label: "Expédiée",     className: "badge badge-confirmed" },
  delivered:  { label: "Livrée",       className: "badge badge-delivered" },
  cancelled:  { label: "Annulée",      className: "badge badge-cancelled" },
  refunded:   { label: "Remboursée",   className: "badge badge-cancelled" },
} as const;

const MOCK_ORDERS = [
  { id: "1", orderNumber: "#FIU-2026-0127", customer: "Kouassi Amani", email: "k.amani@mail.ci", status: "processing" as const, total: "185 000 FCFA", date: "Il y a 12 min" },
  { id: "2", orderNumber: "#FIU-2026-0126", customer: "Fatou Diallo",  email: "f.diallo@gmail.com", status: "pending" as const, total: "72 000 FCFA", date: "Il y a 1h" },
  { id: "3", orderNumber: "#FIU-2026-0125", customer: "Jean-Marc Bah", email: "jm.bah@outlook.com", status: "delivered" as const, total: "340 000 FCFA", date: "Il y a 3h" },
  { id: "4", orderNumber: "#FIU-2026-0124", customer: "Aminata Koné",  email: "a.kone@yahoo.fr",  status: "confirmed" as const, total: "98 500 FCFA", date: "Il y a 5h" },
  { id: "5", orderNumber: "#FIU-2026-0123", customer: "David Mensah",  email: "d.mensah@mail.gh",  status: "shipped" as const, total: "215 000 FCFA", date: "Hier" },
];

export function RecentOrders() {
  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.0625rem", fontWeight: 700, color: "white", margin: 0 }}>
            Commandes récentes
          </h2>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
            5 dernières commandes
          </p>
        </div>
        <Link
          href="/orders"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.5rem 1rem",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--surface-800)",
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontSize: "0.8125rem",
            fontWeight: 500,
            transition: "all 0.15s ease",
          }}
        >
          Voir tout <ChevronRight size={14} />
        </Link>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Commande</th>
            <th>Client</th>
            <th>Statut</th>
            <th style={{ textAlign: "right" }}>Montant</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {MOCK_ORDERS.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status];
            return (
              <tr key={order.id}>
                <td>
                  <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8125rem", color: "var(--brand-300)" }}>
                    {order.orderNumber}
                  </span>
                </td>
                <td>
                  <div style={{ color: "white", fontWeight: 500, fontSize: "0.875rem" }}>{order.customer}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{order.email}</div>
                </td>
                <td>
                  <span className={statusCfg.className}>{statusCfg.label}</span>
                </td>
                <td style={{ textAlign: "right", fontWeight: 600, color: "white" }}>
                  {order.total}
                </td>
                <td style={{ whiteSpace: "nowrap", fontSize: "0.8125rem" }}>{order.date}</td>
                <td>
                  <button
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      padding: "4px",
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                    }}
                    aria-label={`Voir la commande ${order.orderNumber}`}
                  >
                    <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
