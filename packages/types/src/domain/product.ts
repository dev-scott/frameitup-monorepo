import type { Id, Money, Timestamps } from "./common";

// ─── Product ─────────────────────────────────────────────────────────────────
export type ProductId = Id<"products">;

export type ProductStatus = "active" | "draft" | "archived";
export type ProductCategory = "cadre" | "tableau" | "accessoire" | "service";

export interface Product extends Timestamps {
  _id: ProductId;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  category: ProductCategory;
  status: ProductStatus;
  price: Money;
  compareAtPrice?: Money;
  images: ProductImage[];
  attributes: ProductAttribute[];
  tags: string[];
  weight?: number; // grams
  isFeatured: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary: boolean;
}

export interface ProductAttribute {
  key: string;   // e.g. "matière", "couleur", "dimensions"
  value: string; // e.g. "chêne massif", "noir", "60x80cm"
}

export interface ProductVariant extends Timestamps {
  _id: Id<"variants">;
  productId: ProductId;
  sku: string;
  name: string;
  price: Money;
  attributes: ProductAttribute[];
  stockQuantity: number;
}
