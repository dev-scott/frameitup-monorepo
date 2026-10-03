import { query } from "../_generated/server";
import { v } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import { requirePermission } from "../lib/auth";

/**
 * Queries Convex — Analytics / KPIs (temps réel, accès authentifié)
 */

const DAY = 24 * 60 * 60 * 1000;

/** Une commande compte dans le CA dès qu'elle est payée ou engagée (hors annulation) */
function isRevenueOrder(o: Doc<"orders">) {
  if (o.status === "cancelled" || o.status === "refunded") return false;
  return (
    o.paymentStatus === "paid" ||
    ["confirmed", "processing", "ready", "shipped", "delivered"].includes(o.status)
  );
}

function delta(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function revenueBetween(
  orders: Doc<"orders">[],
  transactions: Doc<"transactions">[],
  from: number,
  to: number
) {
  const txs = transactions.filter((t) => t.type === "income" && t.transactionDate >= from && t.transactionDate < to);
  const txOrderIds = new Set(transactions.filter((t) => t.orderId).map((t) => String(t.orderId)));
  let total = txs.reduce((s, t) => s + t.amount, 0);
  for (const o of orders) {
    if (o._creationTime >= from && o._creationTime < to && isRevenueOrder(o) && !txOrderIds.has(String(o._id))) {
      total += o.totalAmount;
    }
  }
  return total;
}

export const kpiSnapshot = query({
  args: {
    sessionToken: v.string(),
    period: v.union(v.literal("today"), v.literal("week"), v.literal("month"), v.literal("quarter")),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    const now = Date.now();
    const periodMs = { today: DAY, week: 7 * DAY, month: 30 * DAY, quarter: 90 * DAY }[args.period];
    const since = now - periodMs;
    const sincePrev = now - periodMs * 2;

    const [orders, transactions, customers, stockItems] = await Promise.all([
      ctx.db.query("orders").filter((q) => q.gte(q.field("_creationTime"), sincePrev)).collect(),
      ctx.db.query("transactions").withIndex("by_date", (q) => q.gte("transactionDate", sincePrev)).collect(),
      ctx.db.query("customers").collect(),
      ctx.db.query("stock").collect(),
    ]);

    const currentOrders = orders.filter((o) => o._creationTime >= since);
    const prevOrders = orders.filter((o) => o._creationTime < since);
    const revenue = revenueBetween(orders, transactions, since, now + 1);
    const prevRevenue = revenueBetween(orders, transactions, sincePrev, since);

    const expenses = transactions
      .filter((t) => t.type === "expense" && t.transactionDate >= since)
      .reduce((s, t) => s + t.amount, 0);

    const paidCurrent = currentOrders.filter(isRevenueOrder);
    const paidPrev = prevOrders.filter(isRevenueOrder);
    const aov = paidCurrent.length ? Math.round(paidCurrent.reduce((s, o) => s + o.totalAmount, 0) / paidCurrent.length) : 0;
    const prevAov = paidPrev.length ? Math.round(paidPrev.reduce((s, o) => s + o.totalAmount, 0) / paidPrev.length) : 0;

    const newCustomers = customers.filter((c) => c._creationTime >= since).length;
    const prevNewCustomers = customers.filter((c) => c._creationTime >= sincePrev && c._creationTime < since).length;

    const toProcess = (await ctx.db.query("orders").collect()).filter((o) =>
      ["pending", "confirmed", "processing", "ready"].includes(o.status)
    ).length;

    return {
      currency: "FCFA",
      revenue,
      revenueDelta: delta(revenue, prevRevenue),
      expenses,
      net: revenue - expenses,
      orders: currentOrders.length,
      ordersDelta: delta(currentOrders.length, prevOrders.length),
      averageOrderValue: aov,
      aovDelta: delta(aov, prevAov),
      newCustomers,
      customersDelta: delta(newCustomers, prevNewCustomers),
      totalCustomers: customers.length,
      stockAlerts: stockItems.filter((s) => s.quantity <= s.reorderPoint).length,
      ordersToProcess: toProcess,
    };
  },
});

export const dailyRevenue = query({
  args: { sessionToken: v.string(), days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    const daysBack = Math.min(args.days ?? 30, 365);
    const since = Date.now() - daysBack * DAY;

    const orders = await ctx.db.query("orders").filter((q) => q.gte(q.field("_creationTime"), since)).collect();
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_date", (q) => q.gte("transactionDate", since))
      .collect();

    const txOrderIds = new Set(transactions.map((t) => t.orderId).filter(Boolean).map(String));
    const byDay: Record<string, { revenue: number; expenses: number; ordersCount: number }> = {};
    const bucket = (ts: number) => {
      const date = new Date(ts).toISOString().split("T")[0]!;
      return (byDay[date] ??= { revenue: 0, expenses: 0, ordersCount: 0 });
    };

    for (const t of transactions) {
      const b = bucket(t.transactionDate);
      if (t.type === "income") b.revenue += t.amount;
      else b.expenses += t.amount;
    }
    for (const o of orders) {
      const b = bucket(o._creationTime);
      b.ordersCount += 1;
      if (isRevenueOrder(o) && !txOrderIds.has(String(o._id))) b.revenue += o.totalAmount;
    }

    return Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data }));
  },
});

/** Analyses détaillées : meilleurs produits, villes, répartition des statuts */
export const insights = query({
  args: { sessionToken: v.string(), days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    const since = Date.now() - Math.min(args.days ?? 90, 365) * DAY;
    const orders = await ctx.db.query("orders").filter((q) => q.gte(q.field("_creationTime"), since)).collect();

    const products = new Map<string, { name: string; sku: string; quantity: number; revenue: number }>();
    const cities = new Map<string, { orders: number; revenue: number }>();
    const statuses: Record<string, number> = {};
    const payment: Record<string, number> = {};

    for (const o of orders) {
      statuses[o.status] = (statuses[o.status] ?? 0) + 1;
      if (!isRevenueOrder(o)) continue;
      const method = o.paymentMethod || "non précisé";
      payment[method] = (payment[method] ?? 0) + o.totalAmount;
      const city = o.shippingAddress?.city?.trim() || "Non précisée";
      const c = cities.get(city) ?? { orders: 0, revenue: 0 };
      c.orders += 1;
      c.revenue += o.totalAmount;
      cities.set(city, c);
      for (const line of o.lines) {
        const key = line.sku || line.name;
        const p = products.get(key) ?? { name: line.name, sku: line.sku, quantity: 0, revenue: 0 };
        p.quantity += line.quantity;
        p.revenue += line.subtotalAmount ?? line.unitPriceAmount * line.quantity;
        products.set(key, p);
      }
    }

    return {
      topProducts: [...products.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 6),
      topCities: [...cities.entries()]
        .map(([city, d]) => ({ city, ...d }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 6),
      statuses,
      paymentMethods: Object.entries(payment)
        .map(([method, amount]) => ({ method, amount }))
        .sort((a, b) => b.amount - a.amount),
    };
  },
});
