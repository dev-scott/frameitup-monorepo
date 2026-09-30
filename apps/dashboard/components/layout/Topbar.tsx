"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, X, LayoutDashboard, ShoppingBag, Package, TrendingUp, Users, Layers, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

const SEARCH_ITEMS = [
  { label: "Vue d'ensemble", href: "/overview", icon: LayoutDashboard },
  { label: "Commandes", href: "/orders", icon: ShoppingBag },
  { label: "Stock", href: "/stock", icon: Package },
  { label: "Finances", href: "/finances", icon: TrendingUp },
  { label: "Clients", href: "/customers", icon: Users },
  { label: "Produits", href: "/products", icon: Layers },
];

export function Topbar({ title, subtitle }: TopbarProps) {
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = SEARCH_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [searchOpen]);

  return (
    <>
      <header
        style={{
          height: "var(--topbar-height)",
          background: "linear-gradient(180deg, var(--surface-900) 0%, transparent 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
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
        <div>
          <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.25rem", fontWeight: 700, color: "white", margin: 0, lineHeight: 1.2 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "2px 0 0" }}>{subtitle}</p>
          )}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="btn-ghost"
            style={{ minWidth: 180, justifyContent: "flex-start" }}
            aria-label="Ouvrir la recherche"
          >
            <Search size={15} />
            <span style={{ flex: 1 }}>Rechercher…</span>
            <kbd style={{ padding: "2px 6px", borderRadius: 4, background: "var(--surface-700)", fontSize: "0.6875rem", color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <button
            className="btn-ghost"
            style={{ width: 40, height: 40, padding: 0, justifyContent: "center", position: "relative" }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: "50%", background: "var(--danger)", border: "2px solid var(--surface-900)" }} />
          </button>

          {/* Admin User Info & Logout */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 6 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "white" }}>
                {user ? `${user.firstName} ${user.lastName}` : "Directeur"}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "var(--brand-300)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {user?.role === "super_admin" ? "Super Admin" : "Administrateur"}
              </div>
            </div>

            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg, var(--brand-500) 0%, var(--brand-700) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8125rem",
                fontWeight: 700,
                border: "1px solid hsl(43 80% 42% / 0.3)",
                color: "white",
              }}
              title={user?.email || "admin@frameitup.com"}
            >
              {(user?.firstName?.[0] || "A") + (user?.lastName?.[0] || "D")}
            </div>

            <button
              type="button"
              onClick={logout}
              className="btn-ghost"
              style={{ width: 36, height: 36, padding: 0, justifyContent: "center", color: "var(--danger)" }}
              title="Se déconnecter"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          onClick={() => setSearchOpen(false)}
          style={{ position: "fixed", inset: 0, background: "hsl(222 47% 4% / 0.8)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "8vh" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 520, background: "var(--surface-800)", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "0 24px 80px hsl(0 0% 0% / 0.6)", overflow: "hidden" }}
            className="animate-slide-up"
          >
            {/* Input */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)" }}>
              <Search size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une page, commande, client…"
                style={{ border: "none", background: "transparent", color: "white", fontSize: "1rem", flex: 1, outline: "none", padding: 0 }}
              />
              <button onClick={() => setSearchOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
                <X size={16} />
              </button>
            </div>

            {/* Results */}
            <div style={{ padding: "0.5rem" }}>
              {filtered.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem", padding: "1.5rem" }}>
                  Aucun résultat pour « {query} »
                </p>
              ) : (
                filtered.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSearchOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.75rem 1rem", borderRadius: 10, textDecoration: "none", color: "var(--text-secondary)", transition: "all 0.1s ease" }}
                      className="sidebar-link"
                    >
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--surface-700)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={16} style={{ color: "var(--brand-400)" }} />
                      </div>
                      <span style={{ fontWeight: 500, color: "white" }}>{item.label}</span>
                    </Link>
                  );
                })
              )}
            </div>

            <div style={{ padding: "0.625rem 1.25rem", borderTop: "1px solid var(--border)", display: "flex", gap: "1rem" }}>
              <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>↵ Ouvrir</span>
              <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>Esc Fermer</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
