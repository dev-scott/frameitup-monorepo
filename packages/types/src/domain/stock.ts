import type { Id, Timestamps } from "./common";
import type { ProductId } from "./product";

// ─── Stock ───────────────────────────────────────────────────────────────────
export type StockItemId = Id<"stock">;
export type StockMovementId = Id<"stockMovements">;

export type StockMovementType =
  | "purchase"      // entrée fournisseur
  | "sale"          // sortie vente
  | "adjustment"    // correction manuelle
  | "return"        // retour client
  | "waste"         // casse / perte
  | "transfer";     // transfert entrepôt

export interface StockItem extends Timestamps {
  _id: StockItemId;
  productId: ProductId;
  sku: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number; // quantity - reservedQuantity
  reorderPoint: number;      // seuil d'alerte rupture
  reorderQuantity: number;   // quantité à commander
  location?: string;         // emplacement entrepôt
  lastInventoryAt?: number;
}

export interface StockMovement extends Timestamps {
  _id: StockMovementId;
  stockItemId: StockItemId;
  productId: ProductId;
  type: StockMovementType;
  quantity: number;    // positif = entrée, négatif = sortie
  previousQty: number;
  newQty: number;
  reference?: string;  // n° commande, n° fournisseur...
  notes?: string;
  performedBy: string; // userId
}

export interface StockAlert {
  productId: ProductId;
  sku: string;
  productName: string;
  currentQuantity: number;
  reorderPoint: number;
  severity: "critical" | "warning";
}
