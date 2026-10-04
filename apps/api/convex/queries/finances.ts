import { query } from "../_generated/server";
import { v } from "convex/values";
import { requirePermission } from "../lib/auth";

/**
 * Queries Convex — Finances (accès authentifié)
 */

export const listAll = query({
  args: {
    sessionToken: v.string(),
    limit: v.optional(v.number()),
    type: v.optional(v.union(v.literal("income"), v.literal("expense"))),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    const limit = Math.min(args.limit ?? 100, 500);
    if (args.type) {
      return await ctx.db
        .query("transactions")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .order("desc")
        .take(limit);
    }
    return await ctx.db.query("transactions").order("desc").take(limit);
  },
});

export const summary = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    const orders = await ctx.db.query("orders").collect();
    const transactions = await ctx.db.query("transactions").collect();
    const txOrderIds = new Set(transactions.map((t) => t.orderId).filter(Boolean).map(String));

    let totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    let receivable = 0;
    for (const o of orders) {
      if (o.status === "cancelled" || o.status === "refunded") continue;
      const committed = o.paymentStatus === "paid" || ["confirmed", "processing", "ready", "shipped", "delivered"].includes(o.status);
      if (committed && !txOrderIds.has(String(o._id))) totalIncome += o.totalAmount;
      if (o.paymentStatus !== "paid") receivable += o.totalAmount;
    }
    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    const byCategory: Record<string, number> = {};
    for (const t of transactions.filter((t) => t.type === "expense")) {
      byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
    }

    return {
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense,
      margin: totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 1000) / 10 : 0,
      receivable,
      count: transactions.length,
      expensesByCategory: Object.entries(byCategory)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount),
      currency: "FCFA",
    };
  },
});

/** Synthèse mensuelle sur 12 mois */
export const monthly = query({
  args: { sessionToken: v.string(), months: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    const months = Math.min(args.months ?? 6, 24);
    const start = new Date();
    start.setUTCDate(1);
    start.setUTCHours(0, 0, 0, 0);
    start.setUTCMonth(start.getUTCMonth() - (months - 1));
    const since = start.getTime();

    const orders = await ctx.db.query("orders").filter((q) => q.gte(q.field("_creationTime"), since)).collect();
    const transactions = await ctx.db.query("transactions").withIndex("by_date", (q) => q.gte("transactionDate", since)).collect();
    const txOrderIds = new Set(transactions.map((t) => t.orderId).filter(Boolean).map(String));

    const buckets: { key: string; income: number; expense: number }[] = [];
    for (let i = 0; i < months; i++) {
      const d = new Date(since);
      d.setUTCMonth(d.getUTCMonth() + i);
      buckets.push({ key: d.toISOString().slice(0, 7), income: 0, expense: 0 });
    }
    const find = (ts: number) => buckets.find((b) => b.key === new Date(ts).toISOString().slice(0, 7));

    for (const t of transactions) {
      const b = find(t.transactionDate);
      if (!b) continue;
      if (t.type === "income") b.income += t.amount;
      else b.expense += t.amount;
    }
    for (const o of orders) {
      if (o.status === "cancelled" || o.status === "refunded" || txOrderIds.has(String(o._id))) continue;
      const committed = o.paymentStatus === "paid" || ["confirmed", "processing", "ready", "shipped", "delivered"].includes(o.status);
      const b = find(o._creationTime);
      if (b && committed) b.income += o.totalAmount;
    }
    return buckets;
  },
});
