import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Mutations Convex — Produits
 */

export const create = mutation({
  args: {
    sku: v.string(),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    category: v.union(
      v.literal("cadre"),
      v.literal("tableau"),
      v.literal("accessoire"),
      v.literal("service")
    ),
    status: v.union(v.literal("active"), v.literal("draft"), v.literal("archived")),
    priceAmount: v.number(),
    priceCurrency: v.string(),
    compareAtPriceAmount: v.optional(v.number()),
    images: v.array(
      v.object({
        url: v.string(),
        alt: v.string(),
        width: v.number(),
        height: v.number(),
        isPrimary: v.boolean(),
      })
    ),
    attributes: v.array(v.object({ key: v.string(), value: v.string() })),
    tags: v.array(v.string()),
    isFeatured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("products")
      .withIndex("by_sku", (q) => q.eq("sku", args.sku))
      .first();

    if (existing) {
      throw new Error(`Un produit avec le SKU ${args.sku} existe déjà.`);
    }

    const productId = await ctx.db.insert("products", args);
    return { productId, sku: args.sku };
  },
});

export const updateStatus = mutation({
  args: {
    productId: v.id("products"),
    status: v.union(v.literal("active"), v.literal("draft"), v.literal("archived")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.productId, { status: args.status });
    return { success: true };
  },
});
