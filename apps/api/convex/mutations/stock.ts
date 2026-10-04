import { mutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { requirePermission, logAudit } from "../lib/auth";

/**
 * Mutations Convex — Stock & mouvements (permission `stock.write`)
 */

const REASON_LABELS: Record<string, string> = {
  purchase: "Réapprovisionnement",
  sale: "Vente",
  adjustment: "Ajustement d'inventaire",
  return: "Retour client",
  waste: "Perte / casse",
};

export const adjust = mutation({
  args: {
    sessionToken: v.string(),
    sku: v.string(),
    delta: v.number(), // positif = entrée, négatif = sortie
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
    const { user } = await requirePermission(ctx, args.sessionToken, "stock.write");
    if (!Number.isInteger(args.delta) || args.delta === 0) {
      throw new ConvexError({ code: "INVALID", message: "La quantité doit être un entier non nul." });
    }
    const stockItem = await ctx.db
      .query("stock")
      .withIndex("by_sku", (q) => q.eq("sku", args.sku))
      .first();
    if (!stockItem) throw new ConvexError({ code: "NOT_FOUND", message: `Article introuvable pour le SKU ${args.sku}` });

    const previousQty = stockItem.quantity;
    const newQty = Math.max(0, previousQty + args.delta);
    const now = Date.now();
    await ctx.db.patch(stockItem._id, { quantity: newQty, lastInventoryAt: now });

    await ctx.db.insert("stockMovements", {
      stockId: stockItem._id,
      productId: stockItem.productId,
      type: args.reason,
      quantity: newQty - previousQty,
      previousQty,
      newQty,
      notes: args.notes?.trim() || undefined,
      performedBy: user._id,
    });

    await logAudit(ctx, {
      user,
      action: "stock.adjust",
      entity: "stock",
      entityId: stockItem._id,
      summary: `${args.sku} : ${previousQty} → ${newQty} (${REASON_LABELS[args.reason]})`,
    });

    return { sku: args.sku, previousQuantity: previousQty, newQuantity: newQty };
  },
});

export const updateSettings = mutation({
  args: {
    sessionToken: v.string(),
    stockId: v.id("stock"),
    reorderPoint: v.number(),
    reorderQuantity: v.number(),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requirePermission(ctx, args.sessionToken, "stock.write");
    const item = await ctx.db.get(args.stockId);
    if (!item) throw new ConvexError({ code: "NOT_FOUND", message: "Article introuvable." });
    if (args.reorderPoint < 0 || args.reorderQuantity < 0) {
      throw new ConvexError({ code: "INVALID", message: "Les seuils doivent être positifs." });
    }
    await ctx.db.patch(item._id, {
      reorderPoint: Math.round(args.reorderPoint),
      reorderQuantity: Math.round(args.reorderQuantity),
      location: args.location?.trim() || undefined,
    });
    await logAudit(ctx, {
      user,
      action: "stock.settings",
      entity: "stock",
      entityId: item._id,
      summary: `${item.sku} : seuil d'alerte ${args.reorderPoint}, réassort ${args.reorderQuantity}`,
    });
    return { success: true };
  },
});
