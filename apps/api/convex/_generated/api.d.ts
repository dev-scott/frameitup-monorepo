/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as http from "../http.js";
import type * as mutations_orders from "../mutations/orders.js";
import type * as mutations_products from "../mutations/products.js";
import type * as mutations_stock from "../mutations/stock.js";
import type * as queries_analytics from "../queries/analytics.js";
import type * as queries_orders from "../queries/orders.js";
import type * as queries_products from "../queries/products.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  http: typeof http;
  "mutations/orders": typeof mutations_orders;
  "mutations/products": typeof mutations_products;
  "mutations/stock": typeof mutations_stock;
  "queries/analytics": typeof queries_analytics;
  "queries/orders": typeof queries_orders;
  "queries/products": typeof queries_products;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
