"use client";

import Link from "next/link";
import {
  Plus,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { usePermission } from "@/lib/AuthContext";

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  requireWrite?: boolean;
}

const ACTIONS: QuickAction[] = [
  {
    label: "Nouvelle commande",
    description: "Enregistrer une commande",
    href: "/orders",
    icon: ShoppingBag,
    color: "hsl(212, 100%, 65%)",
    bg: "hsl(212 100% 62% / 0.1)",
    border: "hsl(212 100% 62% / 0.2)",
    requireWrite: true,
  },
  {
    label: "Gérer le stock",
    description: "Mettre à jour les quantités",
    href: "/stock",
    icon: Package,
    color: "hsl(43, 80%, 56%)",
    bg: "hsl(43 80% 42% / 0.1)",
    border: "hsl(43 80% 42% / 0.2)",
    requireWrite: true,
  },
  {
    label: "Nouveau client",
    description: "Ajouter un client",
    href: "/customers",
    icon: Users,
    color: "hsl(270, 76%, 70%)",
    bg: "hsl(270 76% 65% / 0.1)",
    border: "hsl(270 76% 65% / 0.2)",
    requireWrite: true,
  },
  {
    label: "Finances",
    description: "Voir les rapports",
    href: "/finances",
    icon: TrendingUp,
    color: "hsl(158, 76%, 50%)",
    bg: "hsl(158 76% 44% / 0.1)",
    border: "hsl(158 76% 44% / 0.2)",
  },
];

export function QuickActions() {
  const canWrite = usePermission("orders.write");

  const visibleActions = ACTIONS.filter((a) => !a.requireWrite || canWrite);

  if (visibleActions.length === 0) return null;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.875rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "0.9375rem",
            fontWeight: 700,
            color: "white",
            margin: 0,
          }}
        >
          Actions rapides
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${visibleActions.length}, 1fr)`,
          gap: "1rem",
        }}
      >
        {visibleActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="animate-slide-up"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.875rem",
                padding: "1rem 1.25rem",
                borderRadius: 12,
                background: `linear-gradient(135deg, var(--surface-900) 0%, var(--surface-800) 100%)`,
                border: "1px solid var(--border)",
                textDecoration: "none",
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden",
                animationDelay: `${index * 50}ms`,
                group: "true",
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = action.border;
                el.style.background = `linear-gradient(135deg, ${action.bg} 0%, var(--surface-800) 100%)`;
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = `0 8px 24px hsl(0 0% 0% / 0.25)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "var(--border)";
                el.style.background =
                  "linear-gradient(135deg, var(--surface-900) 0%, var(--surface-800) 100%)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: action.bg,
                  border: `1px solid ${action.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} style={{ color: action.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "white",
                    lineHeight: 1.2,
                  }}
                >
                  {action.label}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {action.description}
                </div>
              </div>
              <ArrowRight
                size={15}
                style={{ color: "var(--text-faint)", flexShrink: 0 }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
