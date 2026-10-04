import { mutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { requirePermission, logAudit } from "../lib/auth";

/**
 * Mutations Convex — Produits (permission `products.write`)
 */

const categoryValidator = v.union(
  v.literal("cadre"),
  v.literal("tableau"),
  v.literal("accessoire"),
  v.literal("service")
);
const statusValidator = v.union(v.literal("active"), v.literal("draft"), v.literal("archived"));
const imageValidator = v.object({
  url: v.string(),
  alt: v.string(),
  width: v.number(),
  height: v.number(),
  isPrimary: v.boolean(),
});

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const create = mutation({
  args: {
    sessionToken: v.string(),
    sku: v.string(),
    name: v.string(),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    category: categoryValidator,
    status: statusValidator,
    priceAmount: v.number(),
    priceCurrency: v.optional(v.string()),
    compareAtPriceAmount: v.optional(v.number()),
    images: v.optional(v.array(imageValidator)),
    tags: v.optional(v.array(v.string())),
    isFeatured: v.optional(v.boolean()),
    initialStock: v.optional(v.number()),
    reorderPoint: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { user } = await requirePermission(ctx, args.sessionToken, "products.write");
    const sku = args.sku.trim().toUpperCase();
    const name = args.name.trim();
    if (!sku || !name) throw new ConvexError({ code: "INVALID", message: "Le SKU et le nom sont requis." });
    if (args.priceAmount < 0) throw new ConvexError({ code: "INVALID", message: "Le prix doit être positif." });

    const existing = await ctx.db.query("products").withIndex("by_sku", (q) => q.eq("sku", sku)).first();
    if (existing) throw new ConvexError({ code: "CONFLICT", message: `Un produit avec le SKU ${sku} existe déjà.` });

    const productId = await ctx.db.insert("products", {
      sku,
      name,
      slug: args.slug?.trim() || slugify(name),
      description: args.description?.trim() || undefined,
      category: args.category,
      status: args.status,
      priceAmount: Math.round(args.priceAmount),
      priceCurrency: args.priceCurrency ?? "XOF",
      compareAtPriceAmount: args.compareAtPriceAmount,
      images: args.images ?? [],
      attributes: [],
      tags: args.tags ?? [],
      isFeatured: args.isFeatured ?? false,
    });

    if (args.category !== "service") {
      const quantity = Math.max(0, Math.round(args.initialStock ?? 0));
      const stockId = await ctx.db.insert("stock", {
        productId,
        sku,
        quantity,
        reservedQuantity: 0,
        reorderPoint: Math.round(args.reorderPoint ?? 5),
        reorderQuantity: 20,
        lastInventoryAt: Date.now(),
      });
      if (quantity > 0) {
        await ctx.db.insert("stockMovements", {
          stockId,
          productId,
          type: "purchase",
          quantity,
          previousQty: 0,
          newQty: quantity,
          notes: "Stock initial",
          performedBy: user._id,
        });
      }
    }

    await logAudit(ctx, {
      user,
      action: "product.create",
      entity: "product",
      entityId: productId,
      summary: `Produit créé : ${name} (${sku})`,
    });
    return { productId, sku };
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    productId: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(categoryValidator),
    priceAmount: v.optional(v.number()),
    compareAtPriceAmount: v.optional(v.union(v.number(), v.null())),
    isFeatured: v.optional(v.boolean()),
    status: v.optional(statusValidator),
    images: v.optional(v.array(imageValidator)),
  },
  handler: async (ctx, args) => {
    const { user } = await requirePermission(ctx, args.sessionToken, "products.write");
    const product = await ctx.db.get(args.productId);
    if (!product) throw new ConvexError({ code: "NOT_FOUND", message: "Produit introuvable." });

    const patch: Record<string, unknown> = {};
    const changes: string[] = [];
    if (args.name !== undefined && args.name.trim() !== product.name) {
      patch.name = args.name.trim();
      changes.push("nom");
    }
    if (args.description !== undefined) patch.description = args.description.trim() || undefined;
    if (args.category && args.category !== product.category) {
      patch.category = args.category;
      changes.push("catégorie");
    }
    if (args.priceAmount !== undefined && args.priceAmount !== product.priceAmount) {
      if (args.priceAmount < 0) throw new ConvexError({ code: "INVALID", message: "Le prix doit être positif." });
      patch.priceAmount = Math.round(args.priceAmount);
      changes.push(`prix ${product.priceAmount.toLocaleString("fr-FR")} → ${Math.round(args.priceAmount).toLocaleString("fr-FR")} FCFA`);
    }
    if (args.compareAtPriceAmount !== undefined) patch.compareAtPriceAmount = args.compareAtPriceAmount ?? undefined;
    if (args.isFeatured !== undefined && args.isFeatured !== product.isFeatured) {
      patch.isFeatured = args.isFeatured;
      changes.push(args.isFeatured ? "mis en avant" : "retiré de la une");
    }
    if (args.status && args.status !== product.status) {
      patch.status = args.status;
      changes.push(`statut ${args.status}`);
    }
    if (args.images) {
      patch.images = args.images;
      changes.push("images");
    }
    await ctx.db.patch(product._id, patch);

    await logAudit(ctx, {
      user,
      action: "product.update",
      entity: "product",
      entityId: product._id,
      summary: `${product.name} : ${changes.length ? changes.join(", ") : "description mise à jour"}`,
    });
    return { success: true };
  },
});

export const updateStatus = mutation({
  args: {
    sessionToken: v.string(),
    productId: v.id("products"),
    status: statusValidator,
  },
  handler: async (ctx, args) => {
    const { user } = await requirePermission(ctx, args.sessionToken, "products.write");
    const product = await ctx.db.get(args.productId);
    if (!product) throw new ConvexError({ code: "NOT_FOUND", message: "Produit introuvable." });
    await ctx.db.patch(args.productId, { status: args.status });
    await logAudit(ctx, {
      user,
      action: "product.status",
      entity: "product",
      entityId: product._id,
      summary: `${product.name} : ${product.status} → ${args.status}`,
    });
    return { success: true };
  },
});
