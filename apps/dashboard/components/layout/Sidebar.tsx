"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Layers,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Vue d'ensemble",
    href: "/overview",
    icon: LayoutDashboard,
  },
  {
    label: "Commandes",
    href: "/orders",
    icon: ShoppingBag,
    badge: null, // dynamique via Convex
  },
  {
    label: "Stock",
    href: "/stock",
    icon: Package,
  },
  {
    label: "Finances",
    href: "/finances",
    icon: TrendingUp,
  },
  {
    label: "Clients",
    href: "/customers",
    icon: Users,
  },
  {
    label: "Produits",
    href: "/products",
    icon: Layers,
  },
] as const;

const BOTTOM_ITEMS = [
  { label: "Paramètres", href: "/settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        minHeight: "100dvh",
        background: "linear-gradient(180deg, var(--surface-900) 0%, var(--surface-950) 100%)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: "var(--topbar-height)",
          display: "flex",
          alignItems: "center",
          padding: "0 1.5rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link href="/overview" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, var(--brand-500) 0%, var(--brand-700) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              boxShadow: "0 0 20px hsl(43 80% 42% / 0.3)",
            }}
          >
            🖼️
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: "0.9375rem", color: "white" }}>
              FrameItUp
            </div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
              DASHBOARD
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 0.875rem",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: active ? 600 : 400,
                color: active ? "white" : "var(--text-secondary)",
                background: active
                  ? "linear-gradient(135deg, hsl(43 80% 42% / 0.2) 0%, hsl(43 80% 42% / 0.1) 100%)"
                  : "transparent",
                border: active ? "1px solid hsl(43 80% 42% / 0.25)" : "1px solid transparent",
                transition: "all 0.15s ease",
                position: "relative",
              }}
              className="sidebar-link"
            >
              <Icon
                size={18}
                style={{ color: active ? "var(--brand-400)" : "var(--text-muted)" }}
              />
              <span style={{ flex: 1 }}>{item.label}</span>
              {active && (
                <ChevronRight size={14} style={{ color: "var(--brand-400)", opacity: 0.7 }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid var(--border)" }}>
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 0.875rem",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: "0.875rem",
                color: active ? "white" : "var(--text-secondary)",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={18} style={{ color: "var(--text-muted)" }} />
              {item.label}
            </Link>
          );
        })}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.625rem 0.875rem",
            borderRadius: 10,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            width: "100%",
            transition: "all 0.15s ease",
          }}
        >
          <LogOut size={18} style={{ color: "var(--text-muted)" }} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
