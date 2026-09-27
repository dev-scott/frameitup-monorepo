import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Queries Convex — Analytics / KPIs
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

    // Revenus période actuelle
    const currentTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_type", (q) => q.eq("type", "income"))
      .filter((q) => q.gte(q.field("transactionDate"), since))
      .collect();

    // Revenus période précédente
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

    const totalRevenue = currentTransactions.reduce((s, t) => s + t.amount, 0);
    const prevRevenue = prevTransactions.reduce((s, t) => s + t.amount, 0);
    const revenueDelta =
      prevRevenue === 0
        ? 100
        : Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 1000) / 10;

    // Commandes
    const currentOrders = await ctx.db
      .query("orders")
      .filter((q) => q.gte(q.field("_creationTime"), since))
      .collect();

    const prevOrders = await ctx.db
      .query("orders")
      .filter((q) =>
        q.and(
          q.gte(q.field("_creationTime"), sincePrev),
          q.lt(q.field("_creationTime"), since)
        )
      )
      .collect();

    // Alertes stock
    const stockItems = await ctx.db.query("stock").collect();
    const stockAlerts = stockItems.filter(
      (s) => s.quantity <= s.reorderPoint
    ).length;

    const currency = "XOF";

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
      newCustomers: 0, // TODO: compter par _creationTime
      customersDelta: 0,
      averageOrderValue: {
        amount:
          currentOrders.length > 0 ? totalRevenue / currentOrders.length : 0,
        currency,
      },
      aovDelta: 0,
      stockAlerts,
    };
  },
});

export const dailyRevenue = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const daysBack = args.days ?? 30;
    const since = Date.now() - daysBack * 24 * 60 * 60 * 1000;

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_date", (q) => q.gte("transactionDate", since))
      .collect();

    // Grouper par jour
    const byDay: Record<string, { revenue: number; expenses: number; ordersCount: number }> = {};

    for (const t of transactions) {
      const date = new Date(t.transactionDate).toISOString().split("T")[0]!;
      if (!byDay[date]) byDay[date] = { revenue: 0, expenses: 0, ordersCount: 0 };
      if (t.type === "income") byDay[date].revenue += t.amount;
      else byDay[date].expenses += t.amount;
    }

    return Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data }));
  },
});
