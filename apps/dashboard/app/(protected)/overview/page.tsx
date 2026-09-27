import type { Metadata } from "next";
import { Topbar } from "@/components/layout/Topbar";
import { KPIGrid } from "@/components/overview/KPIGrid";
import { RevenueChart } from "@/components/overview/RevenueChart";
import { RecentOrders } from "@/components/overview/RecentOrders";
import { StockAlerts } from "@/components/overview/StockAlerts";

export const metadata: Metadata = {
  title: "Vue d'ensemble",
};

export default function OverviewPage() {
  return (
    <>
      <Topbar
        title="Vue d'ensemble"
        subtitle={`Tableau de bord — ${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
      />

      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* KPI Cards */}
        <section>
          <KPIGrid />
        </section>

        {/* Charts + Alerts — 2 colonnes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>
          <RevenueChart />
          <StockAlerts />
        </div>

        {/* Recent Orders */}
        <section>
          <RecentOrders />
        </section>
      </div>
    </>
  );
}
