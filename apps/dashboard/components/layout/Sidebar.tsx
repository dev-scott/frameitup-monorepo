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
  Layers,
  Shield,
  FileText,
  ChevronRight,
} from "lucide-react";
import { useAuth, type Permission } from "@/lib/AuthContext";

// ─── Nav config ────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: Permission;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Vue d'ensemble",
    href: "/overview",
    icon: LayoutDashboard,
    permission: "dashboard.read",
  },
  {
    label: "Commandes",
    href: "/orders",
    icon: ShoppingBag,
    permission: "dashboard.read",
  },
  {
    label: "Stock",
    href: "/stock",
    icon: Package,
    permission: "dashboard.read",
  },
  {
    label: "Finances",
    href: "/finances",
    icon: TrendingUp,
    permission: "finances.write",
  },
  {
    label: "Clients",
    href: "/customers",
    icon: Users,
    permission: "dashboard.read",
  },
  {
    label: "Produits",
    href: "/products",
    icon: Layers,
    permission: "dashboard.read",
  },
];

const ADMIN_ITEMS: NavItem[] = [
  {
    label: "Équipe",
    href: "/settings",
    icon: Shield,
    permission: "users.manage",
  },
];

// ─── Role display config ───────────────────────────────────────────────────────

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  super_admin: {
    label: "Propriétaire",
    color: "var(--brand-300)",
    bg: "hsl(43 80% 42% / 0.12)",
    border: "hsl(43 80% 42% / 0.25)",
  },
  admin: {
    label: "Admin",
    color: "var(--info)",
    bg: "hsl(212 100% 62% / 0.1)",
    border: "hsl(212 100% 62% / 0.22)",
  },
  manager: {
    label: "Gestionnaire",
    color: "var(--purple)",
    bg: "hsl(270 76% 65% / 0.1)",
    border: "hsl(270 76% 65% / 0.22)",
  },
  stock: {
    label: "Magasinier",
    color: "var(--success)",
    bg: "hsl(158 76% 44% / 0.1)",
    border: "hsl(158 76% 44% / 0.22)",
  },
  viewer: {
    label: "Lecture seule",
    color: "var(--text-secondary)",
    bg: "hsl(220 15% 50% / 0.1)",
    border: "hsl(220 15% 50% / 0.2)",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuth();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const roleConfig = user ? (ROLE_CONFIG[user.role] ?? ROLE_CONFIG.viewer) : ROLE_CONFIG.viewer;

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );
  const visibleAdminItems = ADMIN_ITEMS.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        minHeight: "100dvh",
        background: `linear-gradient(180deg, var(--surface-900) 0%, var(--surface-950) 100%)`,
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
      {/* ── Logo ── */}
      <div
        style={{
          height: "var(--topbar-height)",
          display: "flex",
          alignItems: "center",
          padding: "0 1.25rem",
          borderBottom: "1px solid var(--border)",
          gap: "0.75rem",
        }}
      >
        <Link href="/overview" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: "linear-gradient(135deg, var(--brand-400) 0%, var(--brand-700) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              boxShadow: "0 0 20px hsl(43 80% 42% / 0.35), 0 3px 8px hsl(0 0% 0% / 0.4)",
              flexShrink: 0,
            }}
          >
            🖼️
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 800,
                fontSize: "1rem",
                color: "white",
                lineHeight: 1,
              }}
            >
              FrameItUp
            </div>
            <div
              style={{
                fontSize: "0.625rem",
                color: "var(--brand-400)",
                letterSpacing: "0.12em",
                fontWeight: 700,
                marginTop: 2,
              }}
            >
              DASHBOARD
            </div>
          </div>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav
        style={{
          flex: 1,
          padding: "1.25rem 0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          overflowY: "auto",
        }}
      >
        {/* Section label */}
        <div
          style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            color: "var(--text-faint)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            padding: "0 0.75rem",
            marginBottom: "0.5rem",
          }}
        >
          Navigation
        </div>

        {visibleItems.map((item, index) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="sidebar-link animate-slide-left"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "0.6rem 0.875rem",
                borderRadius: 10,
                fontSize: "0.875rem",
                fontWeight: active ? 600 : 400,
                color: active ? "white" : "var(--text-secondary)",
                background: active
                  ? "linear-gradient(135deg, hsl(43 80% 42% / 0.18) 0%, hsl(43 80% 42% / 0.08) 100%)"
                  : "transparent",
                border: active
                  ? "1px solid hsl(43 80% 42% / 0.25)"
                  : "1px solid transparent",
                position: "relative",
                animationDelay: `${index * 40}ms`,
              }}
            >
              {active && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "20%",
                    bottom: "20%",
                    width: 3,
                    borderRadius: "0 3px 3px 0",
                    background: "var(--brand-400)",
                    boxShadow: "0 0 8px var(--brand-400)",
                  }}
                />
              )}
              <Icon
                size={17}
                style={{
                  color: active ? "var(--brand-400)" : "var(--text-muted)",
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1 }}>{item.label}</span>
              {active && (
                <ChevronRight
                  size={13}
                  style={{ color: "var(--brand-400)", opacity: 0.6 }}
                />
              )}
            </Link>
          );
        })}

        {/* Admin section */}
        {visibleAdminItems.length > 0 && (
          <>
            <div
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "var(--text-faint)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                padding: "0 0.75rem",
                marginTop: "1.25rem",
                marginBottom: "0.5rem",
              }}
            >
              Administration
            </div>
            {visibleAdminItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="sidebar-link"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    padding: "0.6rem 0.875rem",
                    borderRadius: 10,
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? "white" : "var(--text-secondary)",
                    background: active
                      ? "linear-gradient(135deg, hsl(43 80% 42% / 0.18) 0%, hsl(43 80% 42% / 0.08) 100%)"
                      : "transparent",
                    border: active ? "1px solid hsl(43 80% 42% / 0.25)" : "1px solid transparent",
                    position: "relative",
                  }}
                >
                  {active && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "20%",
                        bottom: "20%",
                        width: 3,
                        borderRadius: "0 3px 3px 0",
                        background: "var(--brand-400)",
                      }}
                    />
                  )}
                  <Icon
                    size={17}
                    style={{
                      color: active ? "var(--brand-400)" : "var(--text-muted)",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ flex: 1 }}>{item.label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* ── User card ── */}
      <div
        style={{
          padding: "0.75rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        {/* Settings link */}
        <Link
          href="/settings"
          className="sidebar-link"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
            padding: "0.55rem 0.875rem",
            borderRadius: 10,
            fontSize: "0.8125rem",
            color: "var(--text-secondary)",
            border: "1px solid transparent",
            marginBottom: "0.5rem",
          }}
        >
          <Settings size={15} style={{ color: "var(--text-muted)" }} />
          Paramètres
        </Link>

        {/* User info card */}
        <div
          style={{
            background: "var(--surface-800)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, var(--brand-500) 0%, var(--brand-700) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
              boxShadow: "0 0 12px hsl(43 80% 42% / 0.25)",
            }}
          >
            {(user?.firstName?.[0] ?? "?") + (user?.lastName?.[0] ?? "")}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "white",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user ? `${user.firstName} ${user.lastName}` : "—"}
            </div>
            <div
              style={{
                fontSize: "0.6875rem",
                color: roleConfig.color,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 1,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: roleConfig.color,
                  display: "inline-block",
                }}
              />
              {roleConfig.label}
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: 6,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--danger)";
              (e.currentTarget as HTMLButtonElement).style.background = "hsl(350 89% 60% / 0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
            title="Se déconnecter"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
