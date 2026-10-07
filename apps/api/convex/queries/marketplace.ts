import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Queries Convex — Activité Marketplace (Website)
 */

export const getRecentActivity = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 20, 50);
    return await ctx.db
      .query("marketplaceActivity")
      .order("desc")
      .take(limit);
  },
});
