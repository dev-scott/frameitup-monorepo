# Installation du dashboard (sans les workspace packages)
# À exécuter depuis la racine du monorepo

Write-Host "📦 Installation des dépendances du dashboard..." -ForegroundColor Cyan

# 1. Installer les deps du dashboard directement avec npm (sans workspace refs)
$dashboardDeps = @(
    "next@15.3.0",
    "next-auth@^5.0.0-beta.25",
    "react@^19.0.0",
    "react-dom@^19.0.0",
    "recharts@^2.13.0",
    "lucide-react@^0.462.0",
    "date-fns@^4.1.0",
    "clsx@^2.1.1",
    "tailwind-merge@^2.5.4",
    "convex@^1.17.0"
)

$dashboardDevDeps = @(
    "@tailwindcss/postcss@^4",
    "@types/node@^22",
    "@types/react@^19",
    "@types/react-dom@^19",
    "eslint@^9",
    "eslint-config-next@15.3.0",
    "tailwindcss@^4",
    "typescript@^5.7.0"
)

Set-Location "apps/dashboard"

Write-Host "  → Installation des dépendances runtime..." -ForegroundColor Yellow
npm install --prefer-offline --legacy-peer-deps $dashboardDeps 2>&1

Write-Host "  → Installation des devDependencies..." -ForegroundColor Yellow
npm install --save-dev --prefer-offline --legacy-peer-deps $dashboardDevDeps 2>&1

Set-Location "../.."
Write-Host "✅ Installation du dashboard terminée!" -ForegroundColor Green
Write-Host "🚀 Lancer: pnpm dev:dashboard" -ForegroundColor Cyan
