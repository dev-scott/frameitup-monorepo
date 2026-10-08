import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Mutations Convex — Activité Marketplace (Website)
 */

export const logActivity = mutation({
  args: {
    type: v.union(v.literal("purchase"), v.literal("new_listing"), v.literal("drop")),
    artworkId: v.string(),
    artworkTitle: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const activityId = await ctx.db.insert("marketplaceActivity", {
      type: args.type,
      artworkId: args.artworkId,
      artworkTitle: args.artworkTitle,
      userId: args.userId,
      timestamp: Date.now(),
    });
    return { activityId };
  },
});
