import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Mutations Convex — Stock & Mouvements
 */

export const adjust = mutation({
  args: {
    sku: v.string(),
    delta: v.number(), // positif = réapprovisionnement, négatif = vente/perte
    reason: v.union(
      v.literal("purchase"),
      v.literal("sale"),
      v.literal("adjustment"),
      v.literal("return"),
      v.literal("waste")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const stockItem = await ctx.db
      .query("stock")
      .withIndex("by_sku", (q) => q.eq("sku", args.sku))
      .first();

    if (!stockItem) {
      throw new Error(`Article en stock introuvable pour SKU ${args.sku}`);
    }

    const previousQty = stockItem.quantity;
    const newQty = Math.max(0, previousQty + args.delta);

    await ctx.db.patch(stockItem._id, {
      quantity: newQty,
      lastInventoryAt: Date.now(),
    });

    return {
      sku: args.sku,
      previousQuantity: previousQty,
      newQuantity: newQty,
    };
  },
});
