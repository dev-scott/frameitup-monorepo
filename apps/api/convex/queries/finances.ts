import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Queries Convex — Finances & Transactions
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
    const transactions = await ctx.db.query("transactions").collect();
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const net = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      net,
      count: transactions.length,
      currency: "XOF",
    };
  },
});
