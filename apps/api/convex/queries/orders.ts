import { query } from "../_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

/**
 * Queries Convex — Commandes
 */

export const list = query({
  args: {
    status: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("orders");

    if (args.status) {
      q = q.withIndex("by_status", (q) => q.eq("status", args.status as any));
    }

    return await q.order("desc").paginate(args.paginationOpts);
  },
});

export const getByNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_number", (q) => q.eq("orderNumber", args.orderNumber))
      .first();
  },
});

export const getByCustomer = query({
  args: {
    customerId: v.id("customers"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const recentOrders = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .order("desc")
      .take(args.limit ?? 10);
  },
});
