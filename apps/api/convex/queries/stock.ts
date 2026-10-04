import { query } from "../_generated/server";
import { v } from "convex/values";
import { requirePermission } from "../lib/auth";

/**
 * Queries Convex — Stock (accès authentifié)
 */

export const listAll = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    const stockItems = await ctx.db.query("stock").collect();
    return await Promise.all(
      stockItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          productName: product?.name ?? item.sku,
          productCategory: product?.category ?? "accessoire",
          productStatus: product?.status ?? "active",
          unitPriceAmount: product?.priceAmount ?? 0,
        };
      })
    );
  },
});

export const alerts = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    const stockItems = await ctx.db.query("stock").collect();
    const alertsList = [];
    for (const item of stockItems) {
      if (item.quantity <= item.reorderPoint) {
        const product = await ctx.db.get(item.productId);
        const severity = item.quantity <= Math.floor(item.reorderPoint / 2) ? ("critical" as const) : ("warning" as const);
        alertsList.push({
          sku: item.sku,
          name: product?.name ?? item.sku,
          qty: item.quantity,
          threshold: item.reorderPoint,
          reorderQuantity: item.reorderQuantity,
          severity,
        });
      }
    }
    return alertsList.sort((a, b) => a.qty / Math.max(a.threshold, 1) - b.qty / Math.max(b.threshold, 1));
  },
});

export const recentMovements = query({
  args: { sessionToken: v.string(), limit: v.optional(v.number()), productId: v.optional(v.id("products")) },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "dashboard.read");
    const limit = Math.min(args.limit ?? 20, 200);
    const movements = args.productId
      ? await ctx.db
          .query("stockMovements")
          .withIndex("by_product", (q) => q.eq("productId", args.productId!))
          .order("desc")
          .take(limit)
      : await ctx.db.query("stockMovements").order("desc").take(limit);

    return await Promise.all(
      movements.map(async (m) => {
        const product = await ctx.db.get(m.productId);
        const actor = m.performedBy ? await ctx.db.get(m.performedBy) : null;
        return {
          ...m,
          productName: product?.name ?? "Produit supprimé",
          actorName: actor ? `${actor.firstName} ${actor.lastName}` : null,
        };
      })
    );
  },
});
