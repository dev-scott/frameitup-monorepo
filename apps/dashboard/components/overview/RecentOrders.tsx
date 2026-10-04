"use client";

import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useAuth } from "@/lib/AuthContext";

const STATUS_CONFIG = {
  pending:    { label: "En attente",     className: "badge badge-pending" },
  confirmed:  { label: "Confirmée",      className: "badge badge-confirmed" },
  processing: { label: "En fabrication", className: "badge badge-processing" },
  ready:      { label: "Prête",          className: "badge badge-delivered" },
  shipped:    { label: "Expédiée",       className: "badge badge-confirmed" },
  delivered:  { label: "Livrée",         className: "badge badge-delivered" },
  cancelled:  { label: "Annulée",        className: "badge badge-cancelled" },
  refunded:   { label: "Remboursée",     className: "badge badge-cancelled" },
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

export function RecentOrders() {
  const { token } = useAuth();
  const orders = useQuery(
    api.queries.orders.recentOrders,
    token ? { sessionToken: token, limit: 5 } : "skip"
  );

  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.0625rem", fontWeight: 700, color: "white", margin: 0 }}>
            Commandes récentes
          </h2>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
            Données synchronisées en temps réel avec Convex
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
      {orders === undefined ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Chargement des commandes depuis Convex...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Aucune commande enregistrée pour le moment.
        </div>
      ) : (
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
            {orders.map((order: any) => {
              const statusCfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] ?? {
                label: order.status,
                className: "badge badge-pending",
              };
              const customerName = order.shippingAddress?.fullName ?? "Client";
              const totalFormatted = `${order.totalAmount.toLocaleString("fr-FR")} FCFA`;
              const dateFormatted = formatRelativeTime(order._creationTime);

              return (
                <tr key={order._id}>
                  <td>
                    <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8125rem", color: "var(--brand-300)" }}>
                      {order.orderNumber}
                    </span>
                  </td>
                  <td>
                    <div style={{ color: "white", fontWeight: 500, fontSize: "0.875rem" }}>{customerName}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{order.customerEmail}</div>
                  </td>
                  <td>
                    <span className={statusCfg.className}>{statusCfg.label}</span>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: "white" }}>
                    {totalFormatted}
                  </td>
                  <td style={{ whiteSpace: "nowrap", fontSize: "0.8125rem" }}>{dateFormatted}</td>
                  <td>
                    <Link
                      href={`/orders?id=${order._id}`}
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
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
