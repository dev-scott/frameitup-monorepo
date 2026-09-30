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

    const updates: any = {
      status: args.status,
    };

    // Si livrée ou confirmée avec paiement, marquer payée
    if (args.status === "delivered" && order.paymentStatus !== "paid") {
      updates.paymentStatus = "paid";
    }

    await ctx.db.patch(order._id, updates);

    // Si la commande est livrée ou payée, enregistrer une transaction financière
    const isNowPaidOrDelivered = args.status === "delivered" || updates.paymentStatus === "paid" || order.paymentStatus === "paid";
    if (isNowPaidOrDelivered && args.status !== "cancelled") {
      const existingTx = await ctx.db
        .query("transactions")
        .withIndex("by_order", (q) => q.eq("orderId", order._id))
        .first();

      if (!existingTx) {
        await ctx.db.insert("transactions", {
          type: "income",
          category: "ventes",
          amount: order.totalAmount,
          currency: order.currency || "XOF",
          description: `Vente commande ${order.orderNumber}`,
          orderId: order._id,
          reference: order.orderNumber,
          transactionDate: Date.now(),
          paymentMethod: order.paymentMethod || "especes",
          isRecurring: false,
          tags: ["Vente", "Commande Web"],
        });
      }
    }

    return { success: true, orderNumber: args.orderNumber, status: args.status };
  },
});

export const create = mutation({
  args: {
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    lines: v.array(
      v.object({
        productId: v.optional(v.id("products")),
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
            storageId: v.optional(v.id("_storage")),
          })
        ),
      })
    ),
    subtotalAmount: v.number(),
    shippingFeeAmount: v.number(),
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
    paymentStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("paid"),
        v.literal("partially_refunded"),
        v.literal("refunded"),
        v.literal("failed")
      )
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CMD-${new Date().getFullYear()}-${randomSuffix}`;

    // Sync / Upsert client dans la table customers
    let customer = await ctx.db
      .query("customers")
      .withIndex("by_email", (q) => q.eq("email", args.customerEmail))
      .first();

    const fullName = args.shippingAddress.fullName;
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "Client";
    const lastName = nameParts.slice(1).join(" ") || "Client";

    let customerId = customer?._id;
    if (!customer) {
      customerId = await ctx.db.insert("customers", {
        email: args.customerEmail,
        phone: args.customerPhone ?? args.shippingAddress.phone,
        firstName,
        lastName,
        addresses: [args.shippingAddress],
        defaultAddressIndex: 0,
        totalOrders: 1,
        totalSpentAmount: args.totalAmount,
        totalSpentCurrency: args.currency,
        isVip: false,
        tags: ["Web"],
      });
    } else {
      await ctx.db.patch(customer._id, {
        totalOrders: (customer.totalOrders || 0) + 1,
        totalSpentAmount: (customer.totalSpentAmount || 0) + args.totalAmount,
      });
    }

    // Résolution automatique des URLs d'images téléversées dans Convex Storage
    const resolvedLines = await Promise.all(
      args.lines.map(async (line) => {
        let imageUrl = line.customization?.imageUrl;
        if (line.customization?.storageId) {
          const storageUrl = await ctx.storage.getUrl(line.customization.storageId);
          if (storageUrl) {
            imageUrl = storageUrl;
          }
        }
        return {
          ...line,
          customization: line.customization
            ? {
                ...line.customization,
                imageUrl,
              }
            : undefined,
        };
      })
    );

    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      customerId,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      status: "pending",
      paymentStatus: args.paymentStatus ?? "pending",
      paymentMethod: args.paymentMethod,
      lines: resolvedLines,
      subtotalAmount: args.subtotalAmount,
      shippingFeeAmount: args.shippingFeeAmount,
      discountAmount: args.discountAmount,
      totalAmount: args.totalAmount,
      currency: args.currency,
      shippingAddress: args.shippingAddress,
      notes: args.notes,
    });

    if (args.paymentStatus === "paid") {
      await ctx.db.insert("transactions", {
        type: "income",
        category: "ventes",
        amount: args.totalAmount,
        currency: args.currency || "XOF",
        description: `Paiement en ligne commande ${orderNumber}`,
        orderId,
        reference: orderNumber,
        transactionDate: Date.now(),
        paymentMethod: args.paymentMethod || "mobile_money",
        isRecurring: false,
        tags: ["Vente", "Mobile Money"],
      });
    }

    return { orderId, orderNumber, success: true };
  },
});
