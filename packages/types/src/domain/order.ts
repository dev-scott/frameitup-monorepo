import type { Id, Money, Address, Timestamps } from "./common";
import type { ProductId } from "./product";

// ─── Customer ─────────────────────────────────────────────────────────────────
export type CustomerId = Id<"customers">;

export interface Customer extends Timestamps {
  _id: CustomerId;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  addresses: Address[];
  defaultAddressIndex?: number;
  totalOrders: number;
  totalSpent: Money;
  notes?: string;
  tags: string[];
  isVip: boolean;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderId = Id<"orders">;

export type OrderStatus =
  | "pending"       // en attente de paiement
  | "confirmed"     // paiement confirmé
  | "processing"    // en fabrication
  | "ready"         // prêt à expédier
  | "shipped"       // expédié
  | "delivered"     // livré
  | "cancelled"     // annulé
  | "refunded";     // remboursé

export type PaymentStatus = "pending" | "paid" | "partially_refunded" | "refunded" | "failed";
export type PaymentMethod = "mobile_money" | "card" | "bank_transfer" | "cash" | "other";

export interface Order extends Timestamps {
  _id: OrderId;
  orderNumber: string;      // #FIU-2024-0001
  customerId?: CustomerId;
  customerEmail: string;
  customerPhone?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  lines: OrderLine[];
  shippingAddress: Address;
  subtotal: Money;
  shippingFee: Money;
  discount: Money;
  total: Money;
  notes?: string;
  trackingNumber?: string;
  cancelledAt?: number;
  cancelReason?: string;
  fulfilledAt?: number;
}

export interface OrderLine {
  productId: ProductId;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: Money;
  subtotal: Money;
  customization?: OrderCustomization; // cadre sur-mesure
}

export interface OrderCustomization {
  width?: number;
  height?: number;
  frameStyle?: string;
  passepartout?: boolean;
  imageUrl?: string;
}

export interface OrderStatusEvent extends Timestamps {
  _id: Id<"orderEvents">;
  orderId: OrderId;
  fromStatus?: OrderStatus;
  toStatus: OrderStatus;
  notes?: string;
  performedBy: string;
}
