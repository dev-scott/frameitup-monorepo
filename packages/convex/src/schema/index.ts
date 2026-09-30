import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * FrameItUp — Schéma Convex
 * Toutes les tables de la base de données
 */
export default defineSchema({
  // ─── Utilisateurs / Auth ───────────────────────────────────────────────────
  users: defineTable({
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: v.union(
      v.literal("super_admin"),
      v.literal("admin"),
      v.literal("manager"),
      v.literal("stock"),
      v.literal("viewer")
    ),
    avatarUrl: v.optional(v.string()),
    isActive: v.boolean(),
    lastLoginAt: v.optional(v.number()),
    tokenIdentifier: v.optional(v.string()),
    password: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_token", ["tokenIdentifier"]),

  // ─── Produits ──────────────────────────────────────────────────────────────
  products: defineTable({
    sku: v.string(),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    category: v.union(
      v.literal("cadre"),
      v.literal("tableau"),
      v.literal("accessoire"),
      v.literal("service")
    ),
    status: v.union(v.literal("active"), v.literal("draft"), v.literal("archived")),
    priceAmount: v.number(), // in cents
    priceCurrency: v.string(),
    compareAtPriceAmount: v.optional(v.number()),
    images: v.array(
      v.object({
        url: v.string(),
        alt: v.string(),
        width: v.number(),
        height: v.number(),
        isPrimary: v.boolean(),
      })
    ),
    attributes: v.array(v.object({ key: v.string(), value: v.string() })),
    tags: v.array(v.string()),
    weight: v.optional(v.number()),
    isFeatured: v.boolean(),
  })
    .index("by_sku", ["sku"])
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .searchIndex("search_products", { searchField: "name", filterFields: ["category", "status"] }),

  // ─── Stock ────────────────────────────────────────────────────────────────
  stock: defineTable({
    productId: v.id("products"),
    sku: v.string(),
    quantity: v.number(),
    reservedQuantity: v.number(),
    reorderPoint: v.number(),
    reorderQuantity: v.number(),
    location: v.optional(v.string()),
    lastInventoryAt: v.optional(v.number()),
  })
    .index("by_product", ["productId"])
    .index("by_sku", ["sku"]),

  stockMovements: defineTable({
    stockId: v.id("stock"),
    productId: v.id("products"),
    type: v.union(
      v.literal("purchase"),
      v.literal("sale"),
      v.literal("adjustment"),
      v.literal("return"),
      v.literal("waste"),
      v.literal("transfer")
    ),
    quantity: v.number(),
    previousQty: v.number(),
    newQty: v.number(),
    reference: v.optional(v.string()),
    notes: v.optional(v.string()),
    performedBy: v.id("users"),
  })
    .index("by_product", ["productId"])
    .index("by_stock", ["stockId"]),

  // ─── Clients ───────────────────────────────────────────────────────────────
  customers: defineTable({
    email: v.string(),
    phone: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.string(),
    addresses: v.array(
      v.object({
        fullName: v.string(),
        phone: v.string(),
        street: v.optional(v.string()),
        city: v.string(),
        country: v.string(),
        zipCode: v.optional(v.string()),
      })
    ),
    defaultAddressIndex: v.optional(v.number()),
    totalOrders: v.number(),
    totalSpentAmount: v.number(),
    totalSpentCurrency: v.string(),
    notes: v.optional(v.string()),
    tags: v.array(v.string()),
    isVip: v.boolean(),
  })
    .index("by_email", ["email"])
    .searchIndex("search_customers", { searchField: "email", filterFields: ["isVip"] }),

  // ─── Commandes ─────────────────────────────────────────────────────────────
  orders: defineTable({
    orderNumber: v.string(),
    customerId: v.optional(v.id("customers")),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("partially_refunded"),
      v.literal("refunded"),
      v.literal("failed")
    ),
    paymentMethod: v.optional(v.string()),
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
    shippingAddress: v.object({
      fullName: v.string(),
      phone: v.string(),
      street: v.optional(v.string()),
      city: v.string(),
      country: v.string(),
      zipCode: v.optional(v.string()),
    }),
    subtotalAmount: v.number(),
    shippingFeeAmount: v.number(),
    discountAmount: v.number(),
    totalAmount: v.number(),
    currency: v.string(),
    notes: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
    cancelledAt: v.optional(v.number()),
    cancelReason: v.optional(v.string()),
    fulfilledAt: v.optional(v.number()),
  })
    .index("by_number", ["orderNumber"])
    .index("by_customer", ["customerId"])
    .index("by_status", ["status"])
    .index("by_payment_status", ["paymentStatus"])
    .searchIndex("search_orders", { searchField: "customerEmail", filterFields: ["status"] }),

  orderEvents: defineTable({
    orderId: v.id("orders"),
    fromStatus: v.optional(v.string()),
    toStatus: v.string(),
    notes: v.optional(v.string()),
    performedBy: v.id("users"),
  }).index("by_order", ["orderId"]),

  // ─── Finances ──────────────────────────────────────────────────────────────
  transactions: defineTable({
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    amount: v.number(), // in cents
    currency: v.string(),
    description: v.string(),
    orderId: v.optional(v.id("orders")),
    reference: v.optional(v.string()),
    transactionDate: v.number(),
    paymentMethod: v.optional(v.string()),
    isRecurring: v.boolean(),
    tags: v.array(v.string()),
  })
    .index("by_type", ["type"])
    .index("by_date", ["transactionDate"])
    .index("by_order", ["orderId"]),

  // ─── Settings ──────────────────────────────────────────────────────────────
  settings: defineTable({
    key: v.string(),
    value: v.any(),
    description: v.optional(v.string()),
  }).index("by_key", ["key"]),
});
