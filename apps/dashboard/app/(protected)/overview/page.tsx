import type { Metadata } from "next";
import { Topbar } from "@/components/layout/Topbar";
import { KPIGrid } from "@/components/overview/KPIGrid";
import { RevenueChart } from "@/components/overview/RevenueChart";
import { RecentOrders } from "@/components/overview/RecentOrders";
import { StockAlerts } from "@/components/overview/StockAlerts";
import { QuickActions } from "@/components/overview/QuickActions";

export const metadata: Metadata = {
  title: "Vue d'ensemble — FrameItUp",
  description: "Tableau de bord FrameItUp : KPIs, revenus, commandes récentes et alertes stock.",
};

export default function OverviewPage() {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const capitalizedDate = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <>
      <Topbar title="Vue d'ensemble" subtitle={capitalizedDate} />

      <div className="page-content">
        {/* KPI Cards */}
        <KPIGrid />

        {/* Quick Actions */}
        <QuickActions />

        {/* Chart + Stock Alerts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "1.5rem",
          }}
        >
          <RevenueChart />
          <StockAlerts />
        </div>

        {/* Recent Orders */}
        <RecentOrders />
      </div>
    </>
  );
}
