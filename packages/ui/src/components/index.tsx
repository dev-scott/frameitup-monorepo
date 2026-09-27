import * as React from "react";

// ─── cn utility ──────────────────────────────────────────────────────────────
type ClassValue = string | undefined | null | false | Record<string, boolean>;

function cn(...classes: ClassValue[]): string {
  return classes
    .flatMap((c) => {
      if (!c) return [];
      if (typeof c === "string") return [c];
      return Object.entries(c)
        .filter(([, v]) => v)
        .map(([k]) => k);
    })
    .join(" ");
}

// ─── Button ───────────────────────────────────────────────────────────────────
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const BUTTON_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, hsl(43,80%,42%) 0%, hsl(38,80%,35%) 100%)",
    color: "white",
    border: "none",
    boxShadow: "0 4px 20px hsl(43 80% 42% / 0.3)",
  },
  secondary: {
    background: "transparent",
    color: "hsl(43,80%,42%)",
    border: "1px solid hsl(43 80% 42% / 0.4)",
  },
  ghost: {
    background: "transparent",
    color: "hsl(222,15%,65%)",
    border: "1px solid hsl(222 28% 18%)",
  },
  danger: {
    background: "hsl(350 89% 56% / 0.1)",
    color: "hsl(350,89%,60%)",
    border: "1px solid hsl(350 89% 56% / 0.25)",
  },
};

const BUTTON_SIZES: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "0.375rem 0.75rem", fontSize: "0.8125rem", borderRadius: 8 },
  md: { padding: "0.625rem 1.25rem", fontSize: "0.9375rem", borderRadius: 10 },
  lg: { padding: "0.875rem 1.75rem", fontSize: "1rem", borderRadius: 12 },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", loading, leftIcon, rightIcon, children, style, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled ?? loading}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          fontWeight: 600,
          cursor: (disabled ?? loading) ? "not-allowed" : "pointer",
          opacity: (disabled ?? loading) ? 0.6 : 1,
          transition: "all 0.2s ease",
          fontFamily: "inherit",
          ...BUTTON_STYLES[variant],
          ...BUTTON_SIZES[size],
          ...style,
        }}
        {...props}
      >
        {loading ? <span style={{ width: 16, height: 16, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const BADGE_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  default: { background: "hsl(222 28% 18%)", color: "hsl(222,15%,65%)" },
  success: { background: "hsl(160 84% 44% / 0.1)", color: "hsl(160,84%,55%)", border: "1px solid hsl(160 84% 44% / 0.2)" },
  warning: { background: "hsl(43 80% 42% / 0.1)", color: "hsl(43,80%,56%)", border: "1px solid hsl(43 80% 42% / 0.2)" },
  danger:  { background: "hsl(350 89% 56% / 0.1)", color: "hsl(350,89%,66%)", border: "1px solid hsl(350 89% 56% / 0.2)" },
  info:    { background: "hsl(210 100% 60% / 0.1)", color: "hsl(210,100%,70%)", border: "1px solid hsl(210 100% 60% / 0.2)" },
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.25rem 0.625rem",
        borderRadius: 9999,
        fontSize: "0.75rem",
        fontWeight: 600,
        ...BADGE_STYLES[variant],
      }}
    >
      {children}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function Card({ children, style, className }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: "linear-gradient(135deg, hsl(222 40% 10% / 0.9) 0%, hsl(222 40% 8% / 0.7) 100%)",
        border: "1px solid hsl(222 28% 18%)",
        borderRadius: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div
      role="status"
      aria-label="Chargement…"
      style={{
        width: size,
        height: size,
        border: "2px solid hsl(43 80% 42% / 0.2)",
        borderTopColor: "hsl(43,80%,42%)",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}

// ─── Exports ─────────────────────────────────────────────────────────────────
export { cn };
