import { query } from "../_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { requirePermission } from "../lib/auth";

/**
 * Queries Convex — Produits
 * Supporte à la fois les appels publics (boutique vitrine)
 * et les appels authentifiés (dashboard avec sessionToken et RBAC).
 */

export const list = query({
  args: {
    sessionToken: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    if (args.sessionToken) {
      await requirePermission(ctx, args.sessionToken, "dashboard.read");
    }
    if (args.status) {
      return await ctx.db
        .query("products")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .paginate(args.paginationOpts);
    }
    if (args.category) {
      return await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category as any))
        .paginate(args.paginationOpts);
    }
    return await ctx.db.query("products").paginate(args.paginationOpts);
  },
});

export const listAll = query({
  args: {
    sessionToken: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.sessionToken) {
      await requirePermission(ctx, args.sessionToken, "dashboard.read");
    }
    if (args.status && args.status !== "all") {
      return await ctx.db
        .query("products")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .order("desc")
        .collect();
    }
    if (args.category && args.category !== "all") {
      return await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category as any))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("products").order("desc").collect();
  },
});

export const getBySlug = query({
  args: {
    sessionToken: v.optional(v.string()),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getBySku = query({
  args: {
    sessionToken: v.optional(v.string()),
    sku: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_sku", (q) => q.eq("sku", args.sku))
      .first();
  },
});

export const search = query({
  args: {
    sessionToken: v.optional(v.string()),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withSearchIndex("search_products", (q) => q.search("name", args.query))
      .take(10);
  },
});
