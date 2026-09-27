import type { Metadata } from "next";
import { Topbar } from "@/components/layout/Topbar";
import { TrendingUp, TrendingDown, ArrowUpRight, Plus, Download, Filter } from "lucide-react";

export const metadata: Metadata = { title: "Finances" };

const MOCK_TRANSACTIONS = [
  { id: "1",  type: "income"  as const, category: "Vente cadre",      desc: "Commande #FIU-2026-0127",         amount: 185000,  date: "Aujourd'hui 14h32" },
  { id: "2",  type: "expense" as const, category: "Matières premières",desc: "Achat moulures chêne ×50m",       amount: 92000,   date: "Aujourd'hui 10h15" },
  { id: "3",  type: "income"  as const, category: "Vente tableau",     desc: "Commande #FIU-2026-0126",         amount: 72000,   date: "Hier 16h00" },
  { id: "4",  type: "expense" as const, category: "Transport",         desc: "Livraison Dakar — DHL Express",   amount: 18500,   date: "Hier 09h30" },
  { id: "5",  type: "income"  as const, category: "Vente cadre",       desc: "Commande #FIU-2026-0125",         amount: 340000,  date: "Avant-hier 11h00" },
  { id: "6",  type: "expense" as const, category: "Marketing",         desc: "Publicité Instagram Septembre",   amount: 45000,   date: "25 Sep" },
  { id: "7",  type: "income"  as const, category: "Vente service",     desc: "Installation encadrement ×3",    amount: 75000,   date: "24 Sep" },
  { id: "8",  type: "expense" as const, category: "Loyer atelier",     desc: "Loyer atelier — Octobre 2026",   amount: 120000,  date: "01 Oct" },
];

const totalRevenu  = MOCK_TRANSACTIONS.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
const totalDepense = MOCK_TRANSACTIONS.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
const benefice     = totalRevenu - totalDepense;

const KPIS = [
  { label: "Revenus (ce mois)",  value: 4820000, delta: +12.5, color: "var(--success)", Icon: TrendingUp },
  { label: "Dépenses (ce mois)", value: 1340000, delta: -5.2,  color: "var(--danger)",  Icon: TrendingDown },
  { label: "Bénéfice net",       value: 3480000, delta: +18.7, color: "var(--brand-400)", Icon: ArrowUpRight },
];

export default function FinancesPage() {
  return (
    <>
      <Topbar title="Finances" subtitle="Revenus, dépenses et rapports financiers" />
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* KPI cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
          {KPIS.map(({ label, value, delta, color, Icon }) => (
            <div key={label} className="kpi-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{label}</span>
                <Icon size={18} style={{ color }} />
              </div>
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: "1.75rem", fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>
                {(value / 1000000).toFixed(2)}M <span style={{ fontSize: "1rem", fontWeight: 500 }}>FCFA</span>
              </div>
              <div style={{ marginTop: "0.5rem", fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: 4, color: delta > 0 ? "var(--success)" : "var(--danger)" }}>
                {delta > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {Math.abs(delta)}% vs mois dernier
              </div>
            </div>
          ))}
        </div>

        {/* Quick summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {[
            { label: "Revenus (transactions)", value: totalRevenu, color: "var(--success)" },
            { label: "Dépenses (transactions)", value: totalDepense, color: "var(--danger)" },
            { label: "Solde net",               value: benefice,    color: benefice >= 0 ? "var(--success)" : "var(--danger)" },
          ].map((s) => (
            <div key={s.label} className="stat-card" style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "1.125rem", fontWeight: 700, color: s.color }}>
                {s.value >= 0 ? "+" : "-"}{Math.abs(s.value).toLocaleString("fr-FR")} FCFA
              </div>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.0625rem", fontWeight: 700, color: "white", margin: 0 }}>
              Transactions récentes
            </h2>
            <div style={{ display: "flex", gap: "0.625rem" }}>
              <button className="btn-ghost"><Filter size={14} /> Filtrer</button>
              <button className="btn-ghost"><Download size={14} /> Exporter</button>
              <button className="btn-primary"><Plus size={14} /> Ajouter</button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Catégorie</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Montant</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TRANSACTIONS.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: t.type === "income" ? "var(--success)" : "var(--danger)" }}>
                        {t.type === "income" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {t.type === "income" ? "Revenu" : "Dépense"}
                      </span>
                    </td>
                    <td><span style={{ color: "white", fontWeight: 500 }}>{t.desc}</span></td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 20, fontSize: "0.75rem", background: "var(--surface-700)", color: "var(--text-secondary)" }}>
                        {t.category}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap", fontSize: "0.8125rem" }}>{t.date}</td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: t.type === "income" ? "var(--success)" : "var(--danger)", fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.875rem" }}>
                      {t.type === "income" ? "+" : "−"}{t.amount.toLocaleString("fr-FR")} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
