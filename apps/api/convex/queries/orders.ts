import { query } from "../_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { requirePermission } from "../lib/auth";

/**
 * Queries Convex — Commandes (accès authentifié)
 */

export const list = query({
  args: {
    sessionToken: v.string(),
    status: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
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
    sessionToken: v.string(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
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
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    const all = await ctx.db.query("orders").collect();
    const count = (...s: string[]) => all.filter((o) => s.includes(o.status)).length;
    return {
      total: all.length,
      pending: count("pending"),
      confirmed: count("confirmed"),
      processing: count("processing"),
      ready: count("ready"),
      shipped: count("shipped"),
      delivered: count("delivered"),
      cancelled: count("cancelled", "refunded"),
      unpaid: all.filter((o) => o.paymentStatus !== "paid" && o.status !== "cancelled").length,
    };
  },
});

/** Détail complet d'une commande + historique des statuts */
export const details = query({
  args: { sessionToken: v.string(), orderId: v.id("orders") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    const order = await ctx.db.get(args.orderId);
    if (!order) return null;
    const events = await ctx.db
      .query("orderEvents")
      .withIndex("by_order", (q) => q.eq("orderId", order._id))
      .collect();
    const withActors = await Promise.all(
      events.map(async (e) => {
        const actor = e.performedBy ? await ctx.db.get(e.performedBy) : null;
        return { ...e, actorName: actor ? `${actor.firstName} ${actor.lastName}` : null };
      })
    );
    const customer = order.customerId ? await ctx.db.get(order.customerId) : null;
    return {
      ...order,
      events: withActors.sort((a, b) => b._creationTime - a._creationTime),
      customer: customer
        ? { _id: customer._id, totalOrders: customer.totalOrders, totalSpentAmount: customer.totalSpentAmount, isVip: customer.isVip }
        : null,
    };
  },
});

export const getByNumber = query({
  args: { sessionToken: v.string(), orderNumber: v.string() },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    return await ctx.db
      .query("orders")
      .withIndex("by_number", (q) => q.eq("orderNumber", args.orderNumber))
      .first();
  },
});

export const getByCustomer = query({
  args: { sessionToken: v.string(), customerId: v.id("customers") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    return await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .order("desc")
      .take(50);
  },
});

export const recentOrders = query({
  args: { sessionToken: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    return await ctx.db
      .query("orders")
      .order("desc")
      .take(Math.min(args.limit ?? 10, 100));
  },
});
