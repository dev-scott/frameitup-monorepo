import { query } from "../_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

/**
 * Queries Convex — Produits
 */

export const list = query({
  args: {
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("products");

    if (args.status) {
      q = q.withIndex("by_status", (q) => q.eq("status", args.status as any));
    } else if (args.category) {
      q = q.withIndex("by_category", (q) => q.eq("category", args.category as any));
    }

    return await q.paginate(args.paginationOpts);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getBySku = query({
  args: { sku: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_sku", (q) => q.eq("sku", args.sku))
      .first();
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withSearchIndex("search_products", (q) => q.search("name", args.query))
      .take(10);
  },
});
