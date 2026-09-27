// ─── ID Types ────────────────────────────────────────────────────────────────
export type Id<T extends string = string> = string & { __tableName: T };

// ─── Timestamps ──────────────────────────────────────────────────────────────
export interface Timestamps {
  readonly createdAt: number; // Unix ms
  readonly updatedAt: number;
}

// ─── Money ───────────────────────────────────────────────────────────────────
export type Currency = "XOF" | "XAF" | "EUR" | "USD";

export interface Money {
  amount: number; // in cents
  currency: Currency;
}

// ─── Address ─────────────────────────────────────────────────────────────────
export interface Address {
  fullName: string;
  phone: string;
  street?: string;
  city: string;
  country: string;
  zipCode?: string;
}

// ─── Pagination ──────────────────────────────────────────────────────────────
export interface PaginationArgs {
  cursor?: string;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  cursor?: string;
  isDone: boolean;
  totalCount?: number;
}

// ─── Sort / Filter ───────────────────────────────────────────────────────────
export type SortDirection = "asc" | "desc";

export interface DateRange {
  from: number;
  to: number;
}
