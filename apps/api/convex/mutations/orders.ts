import { mutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { requirePermission, logAudit } from "../lib/auth";

/**
 * Mutations Convex — Commandes
 *
 * `create` reste publique (tunnel de commande du site vitrine).
 * Toutes les autres actions exigent la permission `orders.write`.
 */

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  processing: "En fabrication",
  ready: "Prête",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  refunded: "Remboursée",
};

async function recordIncome(ctx: MutationCtx, order: Doc<"orders">) {
  const existingTx = await ctx.db
    .query("transactions")
    .withIndex("by_order", (q) => q.eq("orderId", order._id))
    .first();
  if (existingTx) return;
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
    tags: ["Vente"],
  });
}

export const updateStatus = mutation({
  args: {
    sessionToken: v.string(),
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
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requirePermission(ctx, args.sessionToken, "orders.write");
    const order = await ctx.db
      .query("orders")
      .withIndex("by_number", (q) => q.eq("orderNumber", args.orderNumber))
      .first();
    if (!order) throw new ConvexError({ code: "NOT_FOUND", message: `Commande introuvable : ${args.orderNumber}` });
    if (order.status === args.status) return { success: true, orderNumber: order.orderNumber, status: order.status };

    const updates: Partial<Doc<"orders">> = { status: args.status };
    const now = Date.now();
    if (args.status === "delivered") {
      updates.fulfilledAt = now;
      if (order.paymentStatus !== "paid") updates.paymentStatus = "paid";
    }
    if (args.status === "cancelled") {
      updates.cancelledAt = now;
      if (args.note) updates.cancelReason = args.note;
    }
    await ctx.db.patch(order._id, updates);

    await ctx.db.insert("orderEvents", {
      orderId: order._id,
      fromStatus: order.status,
      toStatus: args.status,
      notes: args.note,
      performedBy: user._id,
    });

    const paid = updates.paymentStatus === "paid" || order.paymentStatus === "paid";
    if (paid && args.status !== "cancelled") await recordIncome(ctx, { ...order, ...updates } as Doc<"orders">);

    await logAudit(ctx, {
      user,
      action: "order.status",
      entity: "order",
      entityId: order._id,
      summary: `${order.orderNumber} : ${STATUS_LABELS[order.status]} → ${STATUS_LABELS[args.status]}`,
    });
    return { success: true, orderNumber: args.orderNumber, status: args.status };
  },
});

export const markPaid = mutation({
  args: { sessionToken: v.string(), orderId: v.id("orders"), paymentMethod: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { user } = await requirePermission(ctx, args.sessionToken, "orders.write");
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new ConvexError({ code: "NOT_FOUND", message: "Commande introuvable." });
    if (order.paymentStatus === "paid") return { success: true };
    const paymentMethod = args.paymentMethod || order.paymentMethod;
    await ctx.db.patch(order._id, { paymentStatus: "paid", paymentMethod });
    await recordIncome(ctx, { ...order, paymentStatus: "paid", paymentMethod });
    await ctx.db.insert("orderEvents", {
      orderId: order._id,
      fromStatus: order.status,
      toStatus: order.status,
      notes: `Paiement encaissé${paymentMethod ? ` (${paymentMethod})` : ""}`,
      performedBy: user._id,
    });
    await logAudit(ctx, {
      user,
      action: "order.paid",
      entity: "order",
      entityId: order._id,
      summary: `${order.orderNumber} marquée comme payée — ${order.totalAmount.toLocaleString("fr-FR")} FCFA`,
    });
    return { success: true };
  },
});

export const updateFulfillment = mutation({
  args: {
    sessionToken: v.string(),
    orderId: v.id("orders"),
    trackingNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requirePermission(ctx, args.sessionToken, "orders.write");
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new ConvexError({ code: "NOT_FOUND", message: "Commande introuvable." });
    await ctx.db.patch(order._id, {
      trackingNumber: args.trackingNumber?.trim() || undefined,
      notes: args.notes?.trim() || undefined,
    });
    await logAudit(ctx, {
      user,
      action: "order.update",
      entity: "order",
      entityId: order._id,
      summary: `${order.orderNumber} : suivi / notes mis à jour`,
    });
    return { success: true };
  },
});

export const addNote = mutation({
  args: { sessionToken: v.string(), orderId: v.id("orders"), note: v.string() },
  handler: async (ctx, args) => {
    const { user } = await requirePermission(ctx, args.sessionToken, "orders.write");
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new ConvexError({ code: "NOT_FOUND", message: "Commande introuvable." });
    const note = args.note.trim();
    if (!note) throw new ConvexError({ code: "INVALID", message: "La note est vide." });
    await ctx.db.insert("orderEvents", {
      orderId: order._id,
      fromStatus: order.status,
      toStatus: order.status,
      notes: note.slice(0, 1000),
      performedBy: user._id,
    });
    return { success: true };
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

    await ctx.db.insert("orderEvents", {
      orderId,
      toStatus: "pending",
      notes: "Commande passée sur le site",
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
