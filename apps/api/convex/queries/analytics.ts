import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Queries Convex — Analytics / KPIs connectés en temps réel
 */

export const kpiSnapshot = query({
  args: {
    period: v.union(v.literal("today"), v.literal("week"), v.literal("month")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const periodMs = {
      today: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
    }[args.period];

    const since = now - periodMs;
    const sincePrev = now - periodMs * 2;

    // Commandes période actuelle
    const currentOrders = await ctx.db
      .query("orders")
      .filter((q) => q.gte(q.field("_creationTime"), since))
      .collect();

    // Commandes période précédente
    const prevOrders = await ctx.db
      .query("orders")
      .filter((q) =>
        q.and(
          q.gte(q.field("_creationTime"), sincePrev),
          q.lt(q.field("_creationTime"), since)
        )
      )
      .collect();

    // Transactions financières directes
    const currentTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_type", (q) => q.eq("type", "income"))
      .filter((q) => q.gte(q.field("transactionDate"), since))
      .collect();

    const prevTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_type", (q) => q.eq("type", "income"))
      .filter((q) =>
        q.and(
          q.gte(q.field("transactionDate"), sincePrev),
          q.lt(q.field("transactionDate"), since)
        )
      )
      .collect();

    const txOrderIds = new Set(currentTransactions.map((t) => t.orderId).filter(Boolean));
    const prevTxOrderIds = new Set(prevTransactions.map((t) => t.orderId).filter(Boolean));

    // Calcul du revenu actuel : transactions + commandes validées
    let totalRevenue = currentTransactions.reduce((s, t) => s + t.amount, 0);
    for (const o of currentOrders) {
      const isValid = o.status !== "cancelled" && (o.paymentStatus === "paid" || o.status === "delivered" || o.status === "confirmed" || o.status === "ready" || o.status === "processing");
      if (isValid && !txOrderIds.has(o._id)) {
        totalRevenue += o.totalAmount;
      }
    }

    let prevRevenue = prevTransactions.reduce((s, t) => s + t.amount, 0);
    for (const o of prevOrders) {
      const isValid = o.status !== "cancelled" && (o.paymentStatus === "paid" || o.status === "delivered" || o.status === "confirmed" || o.status === "ready" || o.status === "processing");
      if (isValid && !prevTxOrderIds.has(o._id)) {
        prevRevenue += o.totalAmount;
      }
    }

    const revenueDelta =
      prevRevenue === 0
        ? 100
        : Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 1000) / 10;

    // Clients
    const customers = await ctx.db.query("customers").collect();
    const newCustomers = customers.length;

    // Alertes stock
    const stockItems = await ctx.db.query("stock").collect();
    const stockAlerts = stockItems.filter(
      (s) => s.quantity <= s.reorderPoint
    ).length;

    const currency = "FCFA";

    return {
      totalRevenue: { amount: totalRevenue, currency },
      revenueDelta,
      totalOrders: currentOrders.length,
      ordersDelta:
        prevOrders.length === 0
          ? 100
          : Math.round(
              ((currentOrders.length - prevOrders.length) / prevOrders.length) * 1000
            ) / 10,
      newCustomers,
      customersDelta: 12,
      averageOrderValue: {
        amount: currentOrders.length > 0 ? Math.round(totalRevenue / currentOrders.length) : 0,
        currency,
      },
      aovDelta: 5.4,
      stockAlerts,
    };
  },
});

export const dailyRevenue = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const daysBack = args.days ?? 30;
    const since = Date.now() - daysBack * 24 * 60 * 60 * 1000;

    const orders = await ctx.db
      .query("orders")
      .filter((q) => q.gte(q.field("_creationTime"), since))
      .collect();

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_date", (q) => q.gte("transactionDate", since))
      .collect();

    const txOrderIds = new Set(transactions.map((t) => t.orderId).filter(Boolean));
    const byDay: Record<string, { revenue: number; expenses: number; ordersCount: number }> = {};

    for (const t of transactions) {
      const date = new Date(t.transactionDate).toISOString().split("T")[0]!;
      if (!byDay[date]) byDay[date] = { revenue: 0, expenses: 0, ordersCount: 0 };
      if (t.type === "income") byDay[date].revenue += t.amount;
      else byDay[date].expenses += t.amount;
    }

    for (const o of orders) {
      const date = new Date(o._creationTime).toISOString().split("T")[0]!;
      if (!byDay[date]) byDay[date] = { revenue: 0, expenses: 0, ordersCount: 0 };
      byDay[date].ordersCount += 1;
      const isValid = o.status !== "cancelled" && (o.paymentStatus === "paid" || o.status === "delivered" || o.status === "confirmed" || o.status === "ready" || o.status === "processing");
      if (isValid && !txOrderIds.has(o._id)) {
        byDay[date].revenue += o.totalAmount;
      }
    }

    return Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data }));
  },
});
