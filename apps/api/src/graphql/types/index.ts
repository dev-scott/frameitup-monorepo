import { builder } from "../builder";

// ─── Money Type ───────────────────────────────────────────────────────────────
export const MoneyType = builder.objectType("Money", {
  description: "Montant monétaire",
  fields: (t) => ({
    amount: t.float({ description: "Montant en centimes" }),
    currency: t.string({ description: "Code devise ISO 4217 (XOF, EUR…)" }),
  }),
});

// ─── Address Type ─────────────────────────────────────────────────────────────
export const AddressType = builder.objectType("Address", {
  description: "Adresse de livraison",
  fields: (t) => ({
    fullName: t.string(),
    phone: t.string(),
    street: t.string({ nullable: true }),
    city: t.string(),
    country: t.string(),
    zipCode: t.string({ nullable: true }),
  }),
});

// ─── Product Type ─────────────────────────────────────────────────────────────
export const ProductStatusEnum = builder.enumType("ProductStatus", {
  values: { active: {}, draft: {}, archived: {} } as const,
});

export const ProductCategoryEnum = builder.enumType("ProductCategory", {
  values: { cadre: {}, tableau: {}, accessoire: {}, service: {} } as const,
});

export const ProductType = builder.objectType("Product", {
  description: "Produit du catalogue",
  fields: (t) => ({
    id: t.id({ resolve: (p: any) => p._id }),
    sku: t.string(),
    name: t.string(),
    slug: t.string(),
    description: t.string({ nullable: true }),
    category: t.field({ type: ProductCategoryEnum, resolve: (p: any) => p.category }),
    status: t.field({ type: ProductStatusEnum, resolve: (p: any) => p.status }),
    price: t.field({
      type: MoneyType,
      resolve: (p: any) => ({ amount: p.priceAmount, currency: p.priceCurrency }),
    }),
    isFeatured: t.boolean(),
    createdAt: t.field({ type: "DateTime", resolve: (p: any) => p._creationTime }),
  }),
});

// ─── Order Status Enum ────────────────────────────────────────────────────────
export const OrderStatusEnum = builder.enumType("OrderStatus", {
  values: {
    pending: {}, confirmed: {}, processing: {}, ready: {},
    shipped: {}, delivered: {}, cancelled: {}, refunded: {},
  } as const,
});

// ─── Order Type ───────────────────────────────────────────────────────────────
export const OrderType = builder.objectType("Order", {
  description: "Commande client",
  fields: (t) => ({
    id: t.id({ resolve: (o: any) => o._id }),
    orderNumber: t.string(),
    customerEmail: t.string(),
    customerPhone: t.string({ nullable: true }),
    status: t.field({ type: OrderStatusEnum, resolve: (o: any) => o.status }),
    total: t.field({
      type: MoneyType,
      resolve: (o: any) => ({ amount: o.totalAmount, currency: o.currency }),
    }),
    shippingAddress: t.field({ type: AddressType, resolve: (o: any) => o.shippingAddress }),
    trackingNumber: t.string({ nullable: true }),
    createdAt: t.field({ type: "DateTime", resolve: (o: any) => o._creationTime }),
    fulfilledAt: t.field({ type: "DateTime", nullable: true, resolve: (o: any) => o.fulfilledAt }),
  }),
});

// ─── KPI Snapshot ─────────────────────────────────────────────────────────────
export const KPISnapshotType = builder.objectType("KPISnapshot", {
  description: "Indicateurs clés de performance",
  fields: (t) => ({
    totalRevenue: t.field({ type: MoneyType }),
    revenueDelta: t.float({ description: "% vs période précédente" }),
    totalOrders: t.int(),
    ordersDelta: t.float(),
    newCustomers: t.int(),
    customersDelta: t.float(),
    averageOrderValue: t.field({ type: MoneyType }),
    aovDelta: t.float(),
    stockAlerts: t.int(),
  }),
});
