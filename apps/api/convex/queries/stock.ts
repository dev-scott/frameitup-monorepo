import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Queries Convex — Stock
 */

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const stockItems = await ctx.db.query("stock").collect();
    const results = await Promise.all(
      stockItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          productName: product?.name ?? item.sku,
          productCategory: product?.category ?? "accessoire",
          unitPriceAmount: product?.priceAmount ?? 0,
        };
      })
    );
    return results;
  },
});

export const alerts = query({
  args: {},
  handler: async (ctx) => {
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
          severity,
        });
      }
    }
    return alertsList;
  },
});

export const recentMovements = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const movements = await ctx.db
      .query("stockMovements")
      .order("desc")
      .take(args.limit ?? 20);

    return await Promise.all(
      movements.map(async (m) => {
        const product = await ctx.db.get(m.productId);
        return {
          ...m,
          productName: product?.name ?? "Produit inconnu",
        };
      })
    );
  },
});
