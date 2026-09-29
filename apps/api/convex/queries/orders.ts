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
    if (args.status) {
      return await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .order("desc")
        .paginate(args.paginationOpts);
    }
    return await ctx.db.query("orders").order("desc").paginate(args.paginationOpts);
  },
});

export const listAll = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.status && args.status !== "all") {
      return await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("orders").collect();
    const pending = all.filter((o) => o.status === "pending").length;
    const processing = all.filter((o) => o.status === "processing").length;
    const ready = all.filter((o) => o.status === "ready" || o.status === "confirmed").length;
    const shipped = all.filter((o) => o.status === "shipped").length;
    const delivered = all.filter((o) => o.status === "delivered").length;
    const cancelled = all.filter((o) => o.status === "cancelled" || o.status === "refunded").length;

    return {
      total: all.length,
      pending,
      processing,
      ready,
      shipped,
      delivered,
      cancelled,
    };
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
