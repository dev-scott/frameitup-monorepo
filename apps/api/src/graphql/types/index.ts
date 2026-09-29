import { builder } from "../builder";

// ─── Shared shape types ───────────────────────────────────────────────────────
interface MoneyShape {
  amount: number;
  currency: string;
}

interface AddressShape {
  fullName: string;
  phone: string;
  street?: string | null;
  city: string;
  country: string;
  zipCode?: string | null;
}

interface ProductShape {
  _id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string | null;
  category: "cadre" | "tableau" | "accessoire" | "service";
  status: "active" | "draft" | "archived";
  priceAmount: number;
  priceCurrency: string;
  isFeatured: boolean;
  _creationTime: number;
}

interface OrderShape {
  _id: string;
  orderNumber: string;
  customerEmail: string;
  customerPhone?: string | null;
  status: "pending" | "confirmed" | "processing" | "ready" | "shipped" | "delivered" | "cancelled" | "refunded";
  totalAmount: number;
  currency: string;
  shippingAddress: AddressShape;
  trackingNumber?: string | null;
  _creationTime: number;
  fulfilledAt?: number | null;
}

interface KPISnapshotShape {
  totalRevenue: MoneyShape;
  revenueDelta: number;
  totalOrders: number;
  ordersDelta: number;
  newCustomers: number;
  customersDelta: number;
  averageOrderValue: MoneyShape;
  aovDelta: number;
  stockAlerts: number;
}

// ─── Object Refs (required by Pothos v4 for non-class types) ──────────────────
export const MoneyRef = builder.objectRef<MoneyShape>("Money");
export const AddressRef = builder.objectRef<AddressShape>("Address");
export const ProductRef = builder.objectRef<ProductShape>("Product");
export const OrderRef = builder.objectRef<OrderShape>("Order");
export const KPISnapshotRef = builder.objectRef<KPISnapshotShape>("KPISnapshot");

// ─── Money Type ───────────────────────────────────────────────────────────────
export const MoneyType = builder.objectType(MoneyRef, {
  description: "Montant monétaire",
  fields: (t) => ({
    amount: t.exposeFloat("amount", { description: "Montant en centimes" }),
    currency: t.exposeString("currency", { description: "Code devise ISO 4217 (XOF, EUR…)" }),
  }),
});

// ─── Address Type ─────────────────────────────────────────────────────────────
export const AddressType = builder.objectType(AddressRef, {
  description: "Adresse de livraison",
  fields: (t) => ({
    fullName: t.exposeString("fullName"),
    phone: t.exposeString("phone"),
    street: t.exposeString("street", { nullable: true }),
    city: t.exposeString("city"),
    country: t.exposeString("country"),
    zipCode: t.exposeString("zipCode", { nullable: true }),
  }),
});

// ─── Product Enums ────────────────────────────────────────────────────────────
export const ProductStatusEnum = builder.enumType("ProductStatus", {
  values: { active: {}, draft: {}, archived: {} } as const,
});

export const ProductCategoryEnum = builder.enumType("ProductCategory", {
  values: { cadre: {}, tableau: {}, accessoire: {}, service: {} } as const,
});

// ─── Product Type ─────────────────────────────────────────────────────────────
export const ProductType = builder.objectType(ProductRef, {
  description: "Produit du catalogue",
  fields: (t) => ({
    id: t.exposeID("_id"),
    sku: t.exposeString("sku"),
    name: t.exposeString("name"),
    slug: t.exposeString("slug"),
    description: t.exposeString("description", { nullable: true }),
    category: t.field({ type: ProductCategoryEnum, resolve: (p) => p.category }),
    status: t.field({ type: ProductStatusEnum, resolve: (p) => p.status }),
    price: t.field({
      type: MoneyRef,
      resolve: (p) => ({ amount: p.priceAmount, currency: p.priceCurrency }),
    }),
    isFeatured: t.exposeBoolean("isFeatured"),
    createdAt: t.field({ type: "DateTime", resolve: (p) => p._creationTime }),
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
export const OrderType = builder.objectType(OrderRef, {
  description: "Commande client",
  fields: (t) => ({
    id: t.exposeID("_id"),
    orderNumber: t.exposeString("orderNumber"),
    customerEmail: t.exposeString("customerEmail"),
    customerPhone: t.exposeString("customerPhone", { nullable: true }),
    status: t.field({ type: OrderStatusEnum, resolve: (o) => o.status }),
    total: t.field({
      type: MoneyRef,
      resolve: (o) => ({ amount: o.totalAmount, currency: o.currency }),
    }),
    shippingAddress: t.field({
      type: AddressRef,
      resolve: (o) => o.shippingAddress,
    }),
    trackingNumber: t.exposeString("trackingNumber", { nullable: true }),
    createdAt: t.field({ type: "DateTime", resolve: (o) => o._creationTime }),
    fulfilledAt: t.field({
      type: "DateTime",
      nullable: true,
      resolve: (o) => o.fulfilledAt ?? null,
    }),
  }),
});

// ─── KPI Snapshot ─────────────────────────────────────────────────────────────
export const KPISnapshotType = builder.objectType(KPISnapshotRef, {
  description: "Indicateurs clés de performance",
  fields: (t) => ({
    totalRevenue: t.field({ type: MoneyRef, resolve: (k) => k.totalRevenue }),
    revenueDelta: t.exposeFloat("revenueDelta", { description: "% vs période précédente" }),
    totalOrders: t.exposeInt("totalOrders"),
    ordersDelta: t.exposeFloat("ordersDelta"),
    newCustomers: t.exposeInt("newCustomers"),
    customersDelta: t.exposeFloat("customersDelta"),
    averageOrderValue: t.field({ type: MoneyRef, resolve: (k) => k.averageOrderValue }),
    aovDelta: t.exposeFloat("aovDelta"),
    stockAlerts: t.exposeInt("stockAlerts"),
  }),
});
