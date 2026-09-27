# FrameItUp — Monorepo

> Encadrement artisanal sur-mesure · Afrique de l'Ouest

Monorepo orchestré par **Nx** et géré avec **pnpm workspaces**.

---

## 🏗️ Architecture

```
frameitup/
├── apps/
│   ├── web/          → Site e-commerce (Next.js 15) — port 3000
│   ├── dashboard/    → Backoffice admin (Next.js 15)  — port 3001
│   └── api/          → API GraphQL (Convex + Yoga + Pothos)
└── packages/
    ├── ui/           → Design System (composants React partagés)
    ├── types/        → Types TypeScript domaine (Order, Product, Stock…)
    ├── convex/       → Schéma Convex + helpers (money, pagination)
    └── config/       → Configs partagées (TS, ESLint, Tailwind)
```

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js ≥ 20
- pnpm ≥ 9

### Installation

```bash
# Installer toutes les dépendances
pnpm install

# Lancer toutes les apps en parallèle
pnpm dev

# Ou individuellement
pnpm dev:web        # e-commerce → http://localhost:3000
pnpm dev:dashboard  # admin      → http://localhost:3001
pnpm dev:api        # GraphQL    → Convex dev server
```

### Variables d'environnement

```bash
cp .env.example apps/web/.env.local
cp .env.example apps/dashboard/.env.local
# Remplir les variables Convex dans chaque .env.local
```

---

## 📦 Packages

| Package | Description |
|---------|-------------|
| `@frameitup/ui` | Design System — Button, Badge, Card, Spinner |
| `@frameitup/types` | Types TypeScript — Order, Product, Stock, Finance, User |
| `@frameitup/convex` | Schéma Convex + helpers (money, pagination) |
| `@frameitup/config` | Configs TSConfig / ESLint / Tailwind preset |

---

## 🎯 Apps

### `apps/web` (port 3000)
Site e-commerce client :
- Vitrine produits
- Configurateur cadre 3D
- Boutique + panier
- Checkout multi-étapes

### `apps/dashboard` (port 3001)
Backoffice d'administration :
- **Vue d'ensemble** — KPIs temps réel, graphiques revenus
- **Commandes** — liste, statuts, tracking
- **Stock** — inventaire, alertes rupture, mouvements
- **Finances** — revenus, dépenses, rapports
- **Clients** — CRM léger, historique achats
- **Produits** — catalogue, prix, images
- **Paramètres** — utilisateurs, rôles, config

### `apps/api`
API GraphQL via Convex HTTP Actions :
- Schema code-first avec **Pothos**
- Serveur **GraphQL Yoga**
- Hosted sur Convex (serverless, edge)

---

## 🛠️ Commandes Nx

```bash
# Build toutes les apps
pnpm build

# Lint tous les projets
pnpm lint

# Typecheck
pnpm typecheck

# Voir le graph de dépendances
npx nx graph

# Build un projet spécifique
npx nx build @frameitup/dashboard

# Réinitialiser le cache Nx
npx nx reset
```

---

## 🗄️ Base de données (Convex)

Tables principales :
- `users` — comptes admin + rôles RBAC
- `products` — catalogue, SKU, prix
- `stock` — quantités, seuils, mouvements
- `orders` — commandes, statuts, lignes
- `customers` — profils clients
- `transactions` — revenus/dépenses
- `settings` — config shop

---

## 🧪 Stack

| Couche | Tech |
|--------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict) |
| DB / Backend | Convex |
| API | GraphQL (Yoga + Pothos) |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Fonts | Inter · Outfit · JetBrains Mono |
| Monorepo | Nx + pnpm workspaces |
