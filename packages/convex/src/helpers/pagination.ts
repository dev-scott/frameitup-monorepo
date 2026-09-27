/**
 * Helpers pour la pagination Convex
 */

export interface ConvexPaginationOptions {
  cursor?: string | null;
  numItems?: number;
}

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export function getPaginationOptions(
  cursor?: string,
  limit: number = DEFAULT_PAGE_SIZE
): ConvexPaginationOptions {
  return {
    cursor: cursor ?? null,
    numItems: Math.min(limit, MAX_PAGE_SIZE),
  };
}
