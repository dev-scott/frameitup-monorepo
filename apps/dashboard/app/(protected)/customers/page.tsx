import type { Metadata } from "next";
import { Topbar } from "@/components/layout/Topbar";
import { Star } from "lucide-react";

export const metadata: Metadata = { title: "Clients" };

const MOCK_CUSTOMERS = [
  { id: "1", name: "Kouassi Amani", email: "k.amani@mail.ci", city: "Abidjan", orders: 8, spent: "1 240 000 FCFA", vip: true, lastOrder: "Il y a 12 min" },
  { id: "2", name: "Fatou Diallo", email: "f.diallo@gmail.com", city: "Dakar", orders: 5, spent: "620 000 FCFA", vip: false, lastOrder: "Il y a 2j" },
  { id: "3", name: "Jean-Marc Bah", email: "jm.bah@outlook.com", city: "Conakry", orders: 12, spent: "2 890 000 FCFA", vip: true, lastOrder: "Il y a 3h" },
  { id: "4", name: "Aminata Koné", email: "a.kone@yahoo.fr", city: "Abidjan", orders: 3, spent: "320 000 FCFA", vip: false, lastOrder: "Il y a 5h" },
  { id: "5", name: "David Mensah", email: "d.mensah@mail.gh", city: "Accra", orders: 7, spent: "985 000 FCFA", vip: true, lastOrder: "Hier" },
  { id: "6", name: "Aïcha Traoré", email: "a.traore@mail.ml", city: "Bamako", orders: 2, spent: "145 000 FCFA", vip: false, lastOrder: "Il y a 4j" },
];

export default function CustomersPage() {
  return (
    <>
      <Topbar title="Clients" subtitle="CRM — Profils clients et historique d'achats" />

      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {[
            { label: "Total clients", value: "254" },
            { label: "Clients VIP", value: "38" },
            { label: "Nouveaux ce mois", value: "43" },
          ].map((s) => (
            <div key={s.label} className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "white", fontFamily: "var(--font-outfit)" }}>{s.value}</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.0625rem", fontWeight: 700, color: "white", margin: "0 0 1.25rem" }}>
            Clients récents
          </h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Ville</th>
                <th style={{ textAlign: "center" }}>Commandes</th>
                <th style={{ textAlign: "right" }}>Total dépensé</th>
                <th>Dernière commande</th>
                <th>VIP</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CUSTOMERS.map((c) => (
                <tr key={c.id} style={{ cursor: "pointer" }}>
                  <td>
                    <div style={{ color: "white", fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{c.email}</div>
                  </td>
                  <td>{c.city}</td>
                  <td style={{ textAlign: "center", fontWeight: 600, color: "white" }}>{c.orders}</td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: "var(--brand-300)" }}>{c.spent}</td>
                  <td style={{ fontSize: "0.8125rem" }}>{c.lastOrder}</td>
                  <td style={{ textAlign: "center" }}>
                    {c.vip && <Star size={15} style={{ color: "hsl(43,80%,56%)", fill: "hsl(43,80%,56%)" }} />}
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
