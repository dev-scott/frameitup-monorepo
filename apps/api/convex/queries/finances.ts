import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Queries Convex — Finances & Transactions unifiées avec les commandes
 */

export const listAll = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const summary = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    const transactions = await ctx.db.query("transactions").collect();

    const txOrderIds = new Set(transactions.map((t) => t.orderId).filter(Boolean));

    let totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    for (const o of orders) {
      const isValid = o.status !== "cancelled" && (o.paymentStatus === "paid" || o.status === "delivered" || o.status === "confirmed" || o.status === "ready" || o.status === "processing");
      if (isValid && !txOrderIds.has(o._id)) {
        totalIncome += o.totalAmount;
      }
    }

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const net = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      net,
      count: orders.length + transactions.length,
      currency: "FCFA",
    };
  },
});
