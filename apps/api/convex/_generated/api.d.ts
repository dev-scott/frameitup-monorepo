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
import type * as lib_auth from "../lib/auth.js";
import type * as lib_crypto from "../lib/crypto.js";
import type * as mutations_auth from "../mutations/auth.js";
import type * as mutations_customers from "../mutations/customers.js";
import type * as mutations_files from "../mutations/files.js";
import type * as mutations_finances from "../mutations/finances.js";
import type * as mutations_orders from "../mutations/orders.js";
import type * as mutations_products from "../mutations/products.js";
import type * as mutations_stock from "../mutations/stock.js";
import type * as mutations_users from "../mutations/users.js";
import type * as queries_analytics from "../queries/analytics.js";
import type * as queries_auth from "../queries/auth.js";
import type * as queries_customers from "../queries/customers.js";
import type * as queries_files from "../queries/files.js";
import type * as queries_finances from "../queries/finances.js";
import type * as queries_orders from "../queries/orders.js";
import type * as queries_products from "../queries/products.js";
import type * as queries_stock from "../queries/stock.js";
import type * as queries_users from "../queries/users.js";
import type * as seed from "../seed.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  http: typeof http;
  "lib/auth": typeof lib_auth;
  "lib/crypto": typeof lib_crypto;
  "mutations/auth": typeof mutations_auth;
  "mutations/customers": typeof mutations_customers;
  "mutations/files": typeof mutations_files;
  "mutations/finances": typeof mutations_finances;
  "mutations/orders": typeof mutations_orders;
  "mutations/products": typeof mutations_products;
  "mutations/stock": typeof mutations_stock;
  "mutations/users": typeof mutations_users;
  "queries/analytics": typeof queries_analytics;
  "queries/auth": typeof queries_auth;
  "queries/customers": typeof queries_customers;
  "queries/files": typeof queries_files;
  "queries/finances": typeof queries_finances;
  "queries/orders": typeof queries_orders;
  "queries/products": typeof queries_products;
  "queries/stock": typeof queries_stock;
  "queries/users": typeof queries_users;
  seed: typeof seed;
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
