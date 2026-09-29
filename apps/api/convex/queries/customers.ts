import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Queries Convex — Clients
 */

export const listAll = query({
  args: {
    isVip: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("customers").order("desc").collect();
    if (args.isVip !== undefined) {
      return all.filter((c) => c.isVip === args.isVip);
    }
    return all;
  },
});

export const getById = query({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.customerId);
  },
});
