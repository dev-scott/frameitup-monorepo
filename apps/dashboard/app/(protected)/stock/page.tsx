import type { Metadata } from "next";
import { Topbar } from "@/components/layout/Topbar";
import { AlertTriangle, AlertCircle, ArrowUp, ArrowDown, Plus, Search, RefreshCw } from "lucide-react";

export const metadata: Metadata = { title: "Stock" };

const MOCK_STOCK = [
  { sku: "MOU-NOIR-01", name: "Moulure Chêne Noir 42mm",       qty: 2,   threshold: 10, unit: "m",   location: "Étagère A1", lastMove: "Il y a 2h",   status: "critical" as const },
  { sku: "VER-UV-30",   name: "Verre antireflet UV 30×40",     qty: 5,   threshold: 10, unit: "pcs", location: "Étagère B2", lastMove: "Il y a 5h",   status: "critical" as const },
  { sku: "PAS-BLA-A4",  name: "Passe-partout blanc A4",        qty: 8,   threshold: 15, unit: "pcs", location: "Tiroir C1",  lastMove: "Hier",        status: "warning"  as const },
  { sku: "CHR-METAL-S", name: "Crochet métal small",           qty: 12,  threshold: 20, unit: "pcs", location: "Tiroir D3",  lastMove: "Il y a 3j",   status: "warning"  as const },
  { sku: "COR-NAT-60",  name: "Cornière naturelle 60cm",       qty: 7,   threshold: 20, unit: "pcs", location: "Étagère A3", lastMove: "Hier",        status: "warning"  as const },
  { sku: "MOU-DORE-01", name: "Moulure dorée classique 28mm",  qty: 45,  threshold: 10, unit: "m",   location: "Étagère B1", lastMove: "Il y a 1h",   status: "ok"       as const },
  { sku: "VIS-INOX-4",  name: "Vis inox 4mm",                  qty: 320, threshold: 50, unit: "pcs", location: "Tiroir E1",  lastMove: "Il y a 2j",   status: "ok"       as const },
  { sku: "FOND-MDF-A3", name: "Fond MDF A3",                   qty: 28,  threshold: 10, unit: "pcs", location: "Étagère C2", lastMove: "Il y a 4h",   status: "ok"       as const },
  { sku: "FIL-SUSPEN",  name: "Fil de suspension acier",       qty: 38,  threshold: 15, unit: "m",   location: "Tiroir A2",  lastMove: "Il y a 6h",   status: "ok"       as const },
  { sku: "TAP-MOUSSE",  name: "Tape mousse double face 25mm",  qty: 4,   threshold: 8,  unit: "rls", location: "Tiroir B1",  lastMove: "Il y a 1j",   status: "warning"  as const },
];

export default function StockPage() {
  const critical = MOCK_STOCK.filter((s) => s.status === "critical").length;
  const warnings = MOCK_STOCK.filter((s) => s.status === "warning").length;
  const ok       = MOCK_STOCK.filter((s) => s.status === "ok").length;

  return (
    <>
      <Topbar title="Gestion du stock" subtitle="Inventaire, mouvements et alertes de rupture" />
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          {[
            { label: "Références", value: MOCK_STOCK.length, color: "white" },
            { label: "Critiques",  value: critical, color: "var(--danger)" },
            { label: "Alertes",    value: warnings, color: "var(--warning)" },
            { label: "OK",         value: ok,       color: "var(--success)" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: "2.25rem", fontWeight: 800, color: s.color, fontFamily: "var(--font-outfit)", letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", gap: "1rem", flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.0625rem", fontWeight: 700, color: "white", margin: 0 }}>
              Inventaire
            </h2>
            <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input placeholder="Chercher un produit, SKU…" style={{ width: 200, paddingLeft: 32, paddingTop: "0.5rem", paddingBottom: "0.5rem", fontSize: "0.8125rem" }} aria-label="Rechercher dans le stock" />
              </div>
              <button className="btn-ghost"><RefreshCw size={14} /> Actualiser</button>
              <button className="btn-primary"><Plus size={14} /> Mouvement</button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Produit</th>
                  <th>Unité</th>
                  <th style={{ textAlign: "center" }}>Stock</th>
                  <th style={{ textAlign: "center" }}>Seuil</th>
                  <th style={{ textAlign: "center" }}>Niveau</th>
                  <th>Emplacement</th>
                  <th>Statut</th>
                  <th>Dernier mvt</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_STOCK.map((item) => {
                  const pct = Math.round((item.qty / item.threshold) * 100);
                  const barColor = item.status === "critical" ? "var(--danger)" : item.status === "warning" ? "var(--warning)" : "var(--success)";
                  return (
                    <tr key={item.sku}>
                      <td>
                        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8125rem", color: "var(--brand-300)", fontWeight: 600 }}>
                          {item.sku}
                        </span>
                      </td>
                      <td><span style={{ color: "white", fontWeight: 500 }}>{item.name}</span></td>
                      <td style={{ fontSize: "0.75rem" }}>{item.unit}</td>
                      <td style={{ textAlign: "center", fontWeight: 700, color: barColor, fontFamily: "var(--font-jetbrains-mono)" }}>{item.qty}</td>
                      <td style={{ textAlign: "center", color: "var(--text-muted)" }}>{item.threshold}</td>
                      <td style={{ textAlign: "center", minWidth: 80 }}>
                        <div style={{ height: 6, borderRadius: 3, background: "var(--surface-700)", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: barColor, borderRadius: 3, transition: "width 0.5s ease" }} />
                        </div>
                        <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: 2, display: "block" }}>{pct}%</span>
                      </td>
                      <td style={{ fontSize: "0.8125rem" }}>{item.location}</td>
                      <td>
                        {item.status === "critical" && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--danger)", fontSize: "0.8125rem" }}><AlertCircle size={13} />Critique</span>}
                        {item.status === "warning"  && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--warning)", fontSize: "0.8125rem" }}><AlertTriangle size={13} />Alerte</span>}
                        {item.status === "ok"       && <span style={{ color: "var(--success)", fontSize: "0.8125rem" }}>✓ OK</span>}
                      </td>
                      <td style={{ fontSize: "0.8125rem", whiteSpace: "nowrap" }}>{item.lastMove}</td>
                      <td>
                        <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                          <button title="Entrée stock" style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid hsl(160 84% 44% / 0.25)", background: "hsl(160 84% 44% / 0.08)", color: "var(--success)", cursor: "pointer" }}>
                            <ArrowUp size={13} />
                          </button>
                          <button title="Sortie stock" style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid hsl(350 89% 56% / 0.25)", background: "hsl(350 89% 56% / 0.08)", color: "var(--danger)", cursor: "pointer" }}>
                            <ArrowDown size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
