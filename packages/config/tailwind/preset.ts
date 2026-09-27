import type { Config } from "tailwindcss";

/**
 * FrameItUp — Tailwind CSS Preset partagé
 * Utilisé par apps/web, apps/dashboard
 */
const preset: Config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand primaire — doré artisanal
        brand: {
          50: "hsl(43, 100%, 96%)",
          100: "hsl(43, 96%, 89%)",
          200: "hsl(43, 92%, 77%)",
          300: "hsl(43, 88%, 64%)",
          400: "hsl(43, 84%, 52%)",
          500: "hsl(43, 80%, 42%)",   // Primary
          600: "hsl(38, 80%, 35%)",
          700: "hsl(34, 80%, 28%)",
          800: "hsl(30, 76%, 22%)",
          900: "hsl(26, 72%, 16%)",
          950: "hsl(22, 68%, 10%)",
        },
        // Surfaces sombres premium
        surface: {
          950: "hsl(222, 47%, 4%)",
          900: "hsl(222, 44%, 7%)",
          800: "hsl(222, 40%, 10%)",
          700: "hsl(222, 36%, 14%)",
          600: "hsl(222, 32%, 19%)",
          500: "hsl(222, 28%, 25%)",
        },
        // Accent émeraude (succès/finance)
        emerald: {
          400: "hsl(160, 84%, 55%)",
          500: "hsl(160, 84%, 44%)",
          600: "hsl(160, 84%, 36%)",
        },
        // Accent rouge (alertes/danger)
        rose: {
          400: "hsl(350, 89%, 66%)",
          500: "hsl(350, 89%, 56%)",
          600: "hsl(350, 89%, 46%)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "Outfit", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, hsl(43,80%,42%) 0%, hsl(38,80%,35%) 100%)",
        "gradient-dark": "linear-gradient(180deg, hsl(222,47%,4%) 0%, hsl(222,44%,7%) 100%)",
        "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        "brand-glow": "0 0 40px hsl(43,80%,42% / 0.3)",
        "card": "0 1px 3px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.3)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.6), 0 16px 48px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
        "slide-in-right": "slideInRight 0.3s cubic-bezier(0.16,1,0.3,1)",
        "pulse-brand": "pulseBrand 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideInRight: { from: { opacity: "0", transform: "translateX(24px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        pulseBrand: { "0%,100%": { boxShadow: "0 0 0 0 hsl(43,80%,42%/0.4)" }, "50%": { boxShadow: "0 0 0 12px hsl(43,80%,42%/0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};

export default preset;
