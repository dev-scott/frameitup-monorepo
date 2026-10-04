import { query } from "../_generated/server";
import { v } from "convex/values";
import { requirePermission } from "../lib/auth";

/**
 * Queries Convex — Clients (accès authentifié)
 */

export const listAll = query({
  args: {
    sessionToken: v.string(),
    isVip: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    const all = await ctx.db.query("customers").order("desc").collect();
    if (args.isVip !== undefined) return all.filter((c) => c.isVip === args.isVip);
    return all;
  },
});

export const getById = query({
  args: { sessionToken: v.string(), customerId: v.id("customers") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    const customer = await ctx.db.get(args.customerId);
    if (!customer) return null;
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", customer._id))
      .order("desc")
      .take(50);
    return { ...customer, orders };
  },
});
