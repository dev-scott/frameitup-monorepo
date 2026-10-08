export enum OrderStatus {
  PENDING = 'PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  QUALITY_CHECK = 'QUALITY_CHECK',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export type GlasingType = 'STANDARD' | 'UV_PROTECTIVE' | 'ANTI_REFLECTIVE' | 'MUSEUM_GLASS';
export type FrameMaterial = 'WOOD' | 'METAL' | 'bois' | 'plexiglas' | 'vitre';

export interface CreateOrderParams {
  shipping: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    firstName: string;
    lastName: string;
    email: string;
    whatsapp: string;
  };
  items: Array<{
    frameId: string;
    imageUrl: string;
    matColor?: string;
    glasingType: string;
    widthPx: number;
    heightPx: number;
    quantity: number;
    unitPriceUsd: number;
  }>;
  totalUsd: number;
  paymentMethod: 'CASH_ON_DELIVERY' | 'MTN_MOMO' | 'ORANGE_MONEY';
  transactionId?: string;
}
