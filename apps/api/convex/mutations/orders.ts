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
      updatedAt: Date.now(),
    });

    return { success: true, orderNumber: args.orderNumber, status: args.status };
  },
});

export const create = mutation({
  args: {
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        unitPriceAmount: v.number(),
        totalAmount: v.number(),
        name: v.string(),
      })
    ),
    subtotalAmount: v.number(),
    shippingAmount: v.number(),
    discountAmount: v.number(),
    taxAmount: v.number(),
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
    paymentMethod: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CMD-${new Date().getFullYear()}-${randomSuffix}`;

    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: args.paymentMethod,
      items: args.items,
      subtotalAmount: args.subtotalAmount,
      shippingAmount: args.shippingAmount,
      discountAmount: args.discountAmount,
      taxAmount: args.taxAmount,
      totalAmount: args.totalAmount,
      currency: args.currency,
      shippingAddress: args.shippingAddress,
      notes: args.notes,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return { orderId, orderNumber };
  },
});
