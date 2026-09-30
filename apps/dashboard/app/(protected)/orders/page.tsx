"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Search, ExternalLink, Download, X, Eye, Package, User, MapPin, Phone, Mail, Image as ImageIcon } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
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
  const [activeOrder, setActiveOrder] = useState<any | null>(null);

  const orders = useQuery(api.queries.orders.listAll, { status: selectedStatus });
  const stats = useQuery(api.queries.orders.stats);
  const updateStatus = useMutation(api.mutations.orders.updateStatus);

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

  const handleStatusChange = async (orderNumber: string, newStatus: any) => {
    try {
      await updateStatus({ orderNumber, status: newStatus });
      if (activeOrder && activeOrder.orderNumber === orderNumber) {
        setActiveOrder({ ...activeOrder, status: newStatus });
      }
    } catch (err) {
      console.error("Erreur mise à jour statut:", err);
    }
  };

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
                    <th>Visuel</th>
                    <th>Client</th>
                    <th>Ville</th>
                    <th>Articles</th>
                    <th>Statut</th>
                    <th>Paiement</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                    <th>Date</th>
                    <th style={{ textAlign: "center" }}>Action</th>
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
                    const customImage = order.lines?.find((l: any) => l.customization?.imageUrl)?.customization?.imageUrl;

                    return (
                      <tr key={order._id}>
                        <td>
                          <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8125rem", color: "var(--brand-300)", fontWeight: 600 }}>
                            {order.orderNumber}
                          </span>
                        </td>
                        <td>
                          {customImage ? (
                            <a
                              href={customImage}
                              target="_blank"
                              rel="noreferrer"
                              title="Ouvrir la photo dans Convex Storage"
                              style={{ display: "inline-block" }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={customImage}
                                alt="Aperçu cadre"
                                style={{
                                  width: 38,
                                  height: 38,
                                  objectFit: "cover",
                                  borderRadius: 6,
                                  border: "1px solid var(--border)",
                                }}
                              />
                            </a>
                          ) : (
                            <div
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: 6,
                                background: "var(--surface-800)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--text-muted)",
                              }}
                            >
                              <ImageIcon size={16} />
                            </div>
                          )}
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
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => setActiveOrder(order)}
                            className="btn btn-secondary"
                            style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", gap: "0.35rem" }}
                          >
                            <Eye size={12} />
                            Détails
                          </button>
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

      {/* Modal Détails de Commande & Visualisation Image HD Convex */}
      {activeOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem",
          }}
          onClick={() => setActiveOrder(null)}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: 720,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "1.75rem",
              background: "var(--surface-900)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "white", margin: 0, fontFamily: "var(--font-outfit)" }}>
                    Commande {activeOrder.orderNumber}
                  </h3>
                  <span className={STATUS_CONFIG[activeOrder.status as keyof typeof STATUS_CONFIG]?.cls ?? "badge badge-pending"}>
                    {STATUS_CONFIG[activeOrder.status as keyof typeof STATUS_CONFIG]?.label ?? activeOrder.status}
                  </span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
                  Passée {formatRelativeTime(activeOrder._creationTime)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Change Status */}
            <div style={{ background: "var(--surface-800)", padding: "1rem", borderRadius: 10, marginBottom: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Statut :</span>
                <select
                  value={activeOrder.status}
                  onChange={(e) => handleStatusChange(activeOrder.orderNumber, e.target.value)}
                  style={{
                    background: "var(--surface-700)",
                    color: "white",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "0.4rem 0.75rem",
                    fontSize: "0.8125rem",
                  }}
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="processing">En fabrication</option>
                  <option value="ready">Prête pour livraison</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée (encaissée)</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>

              {activeOrder.status !== "delivered" && (
                <button
                  type="button"
                  onClick={() => handleStatusChange(activeOrder.orderNumber, "delivered")}
                  className="btn btn-primary"
                  style={{ padding: "0.4rem 0.85rem", fontSize: "0.8125rem", gap: 6, background: "var(--success)", borderColor: "var(--success)" }}
                >
                  ✓ Marquer comme Livrée &amp; Encaissée
                </button>
              )}
            </div>

            {/* Articles & Image */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.875rem", color: "var(--brand-300)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.75rem" }}>
                Articles & Image d&apos;encadrement
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {activeOrder.lines?.map((line: any, idx: number) => {
                  const imgUrl = line.customization?.imageUrl;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: "var(--surface-800)",
                        borderRadius: 10,
                        padding: "1rem",
                        display: "flex",
                        gap: "1.25rem",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      {imgUrl ? (
                        <div style={{ position: "relative", width: 120, height: 120, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)", flexShrink: 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgUrl} alt={line.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div style={{ width: 120, height: 120, borderRadius: 8, background: "var(--surface-700)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", flexShrink: 0 }}>
                          <ImageIcon size={32} />
                        </div>
                      )}

                      <div style={{ flex: 1, minWidth: 220 }}>
                        <div style={{ fontWeight: 600, color: "white", fontSize: "0.9375rem" }}>{line.name}</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: 4 }}>
                          Quantité : <strong>{line.quantity}</strong> | Prix : <strong>{line.unitPriceAmount?.toLocaleString("fr-FR")} FCFA</strong>
                        </div>

                        {line.customization && (
                          <div style={{ marginTop: 8, fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 2 }}>
                            {line.customization.width && line.customization.height && (
                              <div>Dimensions : {line.customization.width} x {line.customization.height} cm</div>
                            )}
                            {line.customization.frameStyle && (
                              <div>Style : {line.customization.frameStyle}</div>
                            )}
                            <div>Passe-partout : {line.customization.passepartout ? "Oui" : "Sans"}</div>
                          </div>
                        )}

                        {imgUrl && (
                          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                            <a
                              href={imgUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-secondary"
                              style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", gap: 5 }}
                            >
                              <ExternalLink size={12} /> Voir photo HD Convex
                            </a>
                            <a
                              href={imgUrl}
                              download={`cadre-${activeOrder.orderNumber}.jpg`}
                              className="btn btn-secondary"
                              style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", gap: 5 }}
                            >
                              <Download size={12} /> Télécharger
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Client & Livraison */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "var(--surface-800)", padding: "1rem", borderRadius: 10 }}>
                <h5 style={{ fontSize: "0.8125rem", color: "var(--brand-300)", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 6 }}>
                  <User size={14} /> Client
                </h5>
                <div style={{ fontSize: "0.875rem", color: "white", fontWeight: 500 }}>
                  {activeOrder.shippingAddress?.fullName ?? activeOrder.customerEmail}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <Mail size={12} /> {activeOrder.customerEmail}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <Phone size={12} /> {activeOrder.customerPhone ?? activeOrder.shippingAddress?.phone ?? "—"}
                </div>
              </div>

              <div style={{ background: "var(--surface-800)", padding: "1rem", borderRadius: 10 }}>
                <h5 style={{ fontSize: "0.8125rem", color: "var(--brand-300)", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 6 }}>
                  <MapPin size={14} /> Adresse de livraison
                </h5>
                <div style={{ fontSize: "0.875rem", color: "white" }}>
                  {activeOrder.shippingAddress?.street ?? "Non précisé"}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: 4 }}>
                  {activeOrder.shippingAddress?.city}, {activeOrder.shippingAddress?.country}
                </div>
                {activeOrder.notes && (
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 6, fontStyle: "italic" }}>
                    Note: {activeOrder.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Total */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9375rem", color: "var(--text-secondary)" }}>Montant total de la commande :</span>
              <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--brand-300)", fontFamily: "var(--font-jetbrains-mono)" }}>
                {activeOrder.totalAmount?.toLocaleString("fr-FR")} FCFA
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
