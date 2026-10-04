"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  X,
  LayoutDashboard,
  ShoppingBag,
  Package,
  TrendingUp,
  Users,
  Layers,
  LogOut,
  Settings,
  Shield,
  Moon,
  CheckCheck,
  AlertTriangle,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const SEARCH_ITEMS = [
  { label: "Vue d'ensemble", href: "/overview", icon: LayoutDashboard, category: "Pages" },
  { label: "Commandes", href: "/orders", icon: ShoppingBag, category: "Pages" },
  { label: "Stock", href: "/stock", icon: Package, category: "Pages" },
  { label: "Finances", href: "/finances", icon: TrendingUp, category: "Pages" },
  { label: "Clients", href: "/customers", icon: Users, category: "Pages" },
  { label: "Produits", href: "/products", icon: Layers, category: "Pages" },
  { label: "Paramètres", href: "/settings", icon: Settings, category: "Système" },
];

// Mock notifications (in real app, these come from Convex)
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "warning" as const,
    title: "Stock critique",
    message: "Cadre Chêne 40×60 — 2 unités restantes",
    time: "Il y a 5 min",
    read: false,
  },
  {
    id: 2,
    type: "info" as const,
    title: "Nouvelle commande",
    message: "CMD-2024-089 reçue — 45 000 FCFA",
    time: "Il y a 18 min",
    read: false,
  },
  {
    id: 3,
    type: "success" as const,
    title: "Commande livrée",
    message: "CMD-2024-087 — livraison confirmée",
    time: "Il y a 1h",
    read: true,
  },
];

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  super_admin: { label: "Propriétaire", color: "var(--brand-300)", icon: "👑" },
  admin:       { label: "Admin",        color: "var(--info)",      icon: "🛡️" },
  manager:     { label: "Gestionnaire", color: "var(--purple)",    icon: "📋" },
  stock:       { label: "Magasinier",   color: "var(--success)",   icon: "📦" },
  viewer:      { label: "Lecture",      color: "var(--text-secondary)", icon: "👁️" },
};

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const inputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = SEARCH_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const roleConfig = user ? (ROLE_CONFIG[user.role] ?? ROLE_CONFIG.viewer) : ROLE_CONFIG.viewer;

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setNotifOpen(false);
        setUserMenuOpen(false);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Auto-focus search
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [searchOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const notifIcon = {
    warning: <AlertTriangle size={14} style={{ color: "var(--warning)" }} />,
    info:    <Info size={14} style={{ color: "var(--info)" }} />,
    success: <CheckCheck size={14} style={{ color: "var(--success)" }} />,
  };

  return (
    <>
      <header
        style={{
          height: "var(--topbar-height)",
          background: "linear-gradient(180deg, hsl(224 47% 6% / 0.98) 0%, hsl(224 47% 6% / 0.85) 100%)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        {/* Page title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h1
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "1.1875rem",
              fontWeight: 700,
              color: "white",
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: "0.775rem", color: "var(--text-muted)", margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          {/* Custom actions */}
          {actions}

          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.45rem 0.875rem",
              borderRadius: 9,
              border: "1px solid var(--border)",
              background: "var(--surface-800)",
              color: "var(--text-muted)",
              fontSize: "0.8125rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
              minWidth: 160,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-hover)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
            }}
            aria-label="Ouvrir la recherche"
          >
            <Search size={14} />
            <span style={{ flex: 1 }}>Rechercher…</span>
            <kbd
              style={{
                padding: "1px 5px",
                borderRadius: 4,
                background: "var(--surface-700)",
                fontSize: "0.625rem",
                color: "var(--text-faint)",
                fontFamily: "var(--font-jetbrains-mono)",
                border: "1px solid var(--border)",
              }}
            >
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <div style={{ position: "relative" }} ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setUserMenuOpen(false);
              }}
              style={{
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: notifOpen ? "var(--surface-700)" : "var(--surface-800)",
                cursor: "pointer",
                color: "var(--text-secondary)",
                position: "relative",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-700)";
                (e.currentTarget as HTMLButtonElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                if (!notifOpen) {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-800)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                }
              }}
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <>
                  <span
                    style={{
                      position: "absolute",
                      top: 7,
                      right: 7,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--danger)",
                      border: "2px solid var(--surface-800)",
                    }}
                  />
                  <span
                    className="animate-ping"
                    style={{
                      position: "absolute",
                      top: 7,
                      right: 7,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--danger)",
                      opacity: 0.6,
                    }}
                  />
                </>
              )}
            </button>

            {/* Notification dropdown */}
            {notifOpen && (
              <div
                className="animate-slide-down"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 340,
                  background: "var(--surface-800)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  boxShadow: "var(--shadow-xl)",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem 1.25rem",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "white" }}>
                    Notifications
                    {unreadCount > 0 && (
                      <span
                        style={{
                          marginLeft: 8,
                          background: "var(--danger)",
                          color: "white",
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: 99,
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        color: "var(--brand-300)",
                        fontWeight: 500,
                      }}
                    >
                      Tout marquer lu
                    </button>
                  )}
                </div>
                <div>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        padding: "0.875rem 1.25rem",
                        borderBottom: "1px solid var(--border-subtle)",
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "flex-start",
                        background: notif.read ? "transparent" : "hsl(43 80% 42% / 0.04)",
                        cursor: "pointer",
                        transition: "background 0.1s ease",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.background = "var(--surface-700)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.background = notif.read
                          ? "transparent"
                          : "hsl(43 80% 42% / 0.04)")
                      }
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: "var(--surface-700)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {notifIcon[notif.type]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "0.8125rem",
                            fontWeight: notif.read ? 400 : 600,
                            color: notif.read ? "var(--text-secondary)" : "white",
                            marginBottom: 2,
                          }}
                        >
                          {notif.title}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {notif.message}
                        </div>
                        <div
                          style={{
                            fontSize: "0.6875rem",
                            color: "var(--text-faint)",
                            marginTop: 3,
                          }}
                        >
                          {notif.time}
                        </div>
                      </div>
                      {!notif.read && (
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--brand-400)",
                            flexShrink: 0,
                            marginTop: 5,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div style={{ position: "relative" }} ref={userMenuRef}>
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotifOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.35rem 0.75rem 0.35rem 0.45rem",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: userMenuOpen ? "var(--surface-700)" : "var(--surface-800)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "var(--surface-700)")
              }
              onMouseLeave={(e) => {
                if (!userMenuOpen)
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-800)";
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, var(--brand-400) 0%, var(--brand-700) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {(user?.firstName?.[0] ?? "?") + (user?.lastName?.[0] ?? "")}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "white", lineHeight: 1.2 }}>
                  {user?.firstName ?? "Utilisateur"}
                </div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    color: roleConfig.color,
                    fontWeight: 600,
                    lineHeight: 1,
                    marginTop: 1,
                  }}
                >
                  {roleConfig.icon} {roleConfig.label}
                </div>
              </div>
            </button>

            {/* User dropdown */}
            {userMenuOpen && (
              <div
                className="animate-slide-down"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 240,
                  background: "var(--surface-800)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  boxShadow: "var(--shadow-xl)",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                {/* User info */}
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    borderBottom: "1px solid var(--border)",
                    background: "hsl(43 80% 42% / 0.04)",
                  }}
                >
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "white" }}>
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                    {user?.email}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "2px 8px",
                      borderRadius: 99,
                      background: "hsl(43 80% 42% / 0.12)",
                      border: "1px solid hsl(43 80% 42% / 0.25)",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      color: roleConfig.color,
                    }}
                  >
                    {roleConfig.icon} {roleConfig.label}
                  </div>
                </div>

                {/* Menu items */}
                <div style={{ padding: "0.5rem" }}>
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.625rem 0.875rem",
                      borderRadius: 9,
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      transition: "all 0.1s ease",
                    }}
                    className="sidebar-link"
                  >
                    <Settings size={15} style={{ color: "var(--text-muted)" }} />
                    Paramètres du compte
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.625rem 0.875rem",
                      borderRadius: 9,
                      fontSize: "0.875rem",
                      color: "var(--danger)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.1s ease",
                      fontFamily: "inherit",
                      marginTop: 2,
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background =
                        "hsl(350 89% 60% / 0.08)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
                    }
                  >
                    <LogOut size={15} />
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Search Modal ── */}
      {searchOpen && (
        <div
          onClick={() => setSearchOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "hsl(224 50% 3.5% / 0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 200,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "10vh",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-scale-in"
            style={{
              width: "100%",
              maxWidth: 560,
              background: "var(--surface-800)",
              border: "1px solid var(--border)",
              borderRadius: 18,
              boxShadow: "0 32px 96px hsl(0 0% 0% / 0.7)",
              overflow: "hidden",
            }}
          >
            {/* Search input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.875rem",
                padding: "1rem 1.25rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <Search size={18} style={{ color: "var(--brand-400)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une page, commande, client…"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "white",
                  fontSize: "1.0625rem",
                  flex: 1,
                  outline: "none",
                  padding: 0,
                  width: "100%",
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                style={{
                  background: "var(--surface-700)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "3px 7px",
                  borderRadius: 5,
                  fontSize: "0.625rem",
                  fontFamily: "var(--font-jetbrains-mono)",
                  flexShrink: 0,
                }}
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div style={{ padding: "0.625rem", maxHeight: 360, overflowY: "auto" }}>
              {filtered.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    padding: "2rem 1rem",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>🔍</div>
                  Aucun résultat pour «&nbsp;{query}&nbsp;»
                </div>
              ) : (
                filtered.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSearchOpen(false)}
                      className="sidebar-link"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.875rem",
                        padding: "0.75rem 1rem",
                        borderRadius: 10,
                        color: "var(--text-secondary)",
                        transition: "all 0.1s ease",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          background: "var(--surface-700)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={16} style={{ color: "var(--brand-400)" }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: "white", fontSize: "0.9375rem" }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: "0.6875rem", color: "var(--text-faint)" }}>
                          {item.category}
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            <div
              style={{
                padding: "0.625rem 1.25rem",
                borderTop: "1px solid var(--border)",
                display: "flex",
                gap: "1.25rem",
                background: "hsl(224 43% 7% / 0.5)",
              }}
            >
              <span style={{ fontSize: "0.6875rem", color: "var(--text-faint)" }}>↵ Ouvrir</span>
              <span style={{ fontSize: "0.6875rem", color: "var(--text-faint)" }}>Esc Fermer</span>
              <span style={{ fontSize: "0.6875rem", color: "var(--text-faint)" }}>⌘K Recherche</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
