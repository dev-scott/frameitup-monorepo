import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Mutations Convex — Commandes
 */

export const updateStatus = mutation({
  args: {
    orderNumber: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_number", (q) => q.eq("orderNumber", args.orderNumber))
      .first();

    if (!order) {
      throw new Error(`Commande introuvable: ${args.orderNumber}`);
    }

    await ctx.db.patch(order._id, {
      status: args.status,
      // updatedAt: not in schema — Convex tracks _creationTime automatically
    });

    return { success: true, orderNumber: args.orderNumber, status: args.status };
  },
});

export const create = mutation({
  args: {
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    // Schema uses "lines" (not "items") with the full line shape
    lines: v.array(
      v.object({
        productId: v.id("products"),
        sku: v.string(),
        name: v.string(),
        quantity: v.number(),
        unitPriceAmount: v.number(),
        unitPriceCurrency: v.string(),
        subtotalAmount: v.number(),
        customization: v.optional(
          v.object({
            width: v.optional(v.number()),
            height: v.optional(v.number()),
            frameStyle: v.optional(v.string()),
            passepartout: v.optional(v.boolean()),
            imageUrl: v.optional(v.string()),
          })
        ),
      })
    ),
    subtotalAmount: v.number(),
    shippingFeeAmount: v.number(), // matches schema field name
    discountAmount: v.number(),
    totalAmount: v.number(),
    currency: v.string(),
    shippingAddress: v.object({
      fullName: v.string(),
      phone: v.string(),
      street: v.optional(v.string()),
      city: v.string(),
      country: v.string(),
      zipCode: v.optional(v.string()),
    }),
    paymentMethod: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CMD-${new Date().getFullYear()}-${randomSuffix}`;

    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: args.paymentMethod,
      lines: args.lines,
      subtotalAmount: args.subtotalAmount,
      shippingFeeAmount: args.shippingFeeAmount,
      discountAmount: args.discountAmount,
      totalAmount: args.totalAmount,
      currency: args.currency,
      shippingAddress: args.shippingAddress,
      notes: args.notes,
      // _creationTime is auto-managed by Convex — no createdAt/updatedAt needed
    });

    return { orderId, orderNumber };
  },
});
