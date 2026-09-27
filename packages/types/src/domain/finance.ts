import type { Id, Money, DateRange, Timestamps } from "./common";
import type { OrderId } from "./order";

// ─── Finance ─────────────────────────────────────────────────────────────────
export type TransactionId = Id<"transactions">;

export type TransactionType = "income" | "expense";

export type TransactionCategory =
  // Revenus
  | "vente_cadre"
  | "vente_tableau"
  | "livraison"
  | "autre_revenu"
  // Dépenses
  | "matiere_premiere"
  | "fournitures"
  | "salaires"
  | "loyer"
  | "marketing"
  | "transport"
  | "autre_depense";

export interface Transaction extends Timestamps {
  _id: TransactionId;
  type: TransactionType;
  category: TransactionCategory;
  amount: Money;
  description: string;
  orderId?: OrderId;       // si lié à une commande
  reference?: string;      // n° reçu, facture...
  transactionDate: number; // date effective (pas créatedAt)
  paymentMethod?: string;
  isRecurring: boolean;
  tags: string[];
}

// ─── Reports ─────────────────────────────────────────────────────────────────
export interface RevenueReport {
  period: DateRange;
  totalRevenue: Money;
  totalExpenses: Money;
  grossProfit: Money;
  grossMargin: number; // percentage
  ordersCount: number;
  averageOrderValue: Money;
  revenueByCategory: CategoryBreakdown[];
  expensesByCategory: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  category: string;
  amount: Money;
  percentage: number;
  count: number;
}

export interface DailyRevenueStat {
  date: string; // ISO YYYY-MM-DD
  revenue: Money;
  expenses: Money;
  ordersCount: number;
}

export interface KPISnapshot {
  period: "today" | "week" | "month" | "year";
  totalRevenue: Money;
  revenueDelta: number;     // % vs previous period
  totalOrders: number;
  ordersDelta: number;
  newCustomers: number;
  customersDelta: number;
  averageOrderValue: Money;
  aovDelta: number;
  stockAlerts: number;
}
