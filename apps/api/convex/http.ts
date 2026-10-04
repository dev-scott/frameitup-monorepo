import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * FrameItUp — Convex HTTP Router
 * Expose l'API REST & GraphQL via Convex HTTP Actions
 */
const http = httpRouter();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Apollo-Require-Preflight",
};

// ─── GraphiQL Playground HTML ────────────────────────────────────────────────
const GRAPHIQL_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>FrameItUp — GraphQL Explorer</title>
  <link rel="stylesheet" href="https://unpkg.com/graphiql@3.0.10/graphiql.min.css" />
  <style>
    body { margin: 0; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    #graphiql { height: 100vh; }
  </style>
</head>
<body>
  <div id="graphiql">Loading FrameItUp GraphQL Explorer...</div>
  <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/graphiql@3.0.10/graphiql.min.js"></script>
  <script>
    const fetcher = GraphiQL.createFetcher({ url: '/graphql' });
    const defaultQuery = \`query GetOverview {
  health
  products(limit: 5) {
    _id
    sku
    name
    category
    priceAmount
    status
  }
  recentOrders(limit: 5) {
    _id
    orderNumber
    customerEmail
    totalAmount
    status
  }
}\`;
    ReactDOM.render(
      React.createElement(GraphiQL, { fetcher: fetcher, defaultQuery: defaultQuery }),
      document.getElementById('graphiql')
    );
  </script>
</body>
</html>`;

// ─── GraphQL Query Executor ──────────────────────────────────────────────────
async function executeGraphQL(
  ctx: any,
  queryStr: string,
  variables: Record<string, any> = {},
  sessionToken = ""
): Promise<{ data?: Record<string, any>; errors?: Array<{ message: string }> }> {
  const clean = queryStr.replace(/#.*$/gm, "").trim();
  const data: Record<string, any> = {};

  try {
    // Introspection query pour GraphiQL / tooling
    if (clean.includes("__schema")) {
      data["__schema"] = {
        queryType: { name: "Query" },
        mutationType: { name: "Mutation" },
        types: [
          {
            kind: "OBJECT",
            name: "Query",
            fields: [
              { name: "health", type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "String" } } },
              { name: "products", type: { kind: "LIST", ofType: { kind: "OBJECT", name: "Product" } } },
              { name: "product", type: { kind: "OBJECT", name: "Product" } },
              { name: "orders", type: { kind: "LIST", ofType: { kind: "OBJECT", name: "Order" } } },
              { name: "recentOrders", type: { kind: "LIST", ofType: { kind: "OBJECT", name: "Order" } } },
              { name: "kpiSnapshot", type: { kind: "OBJECT", name: "KPISnapshot" } },
            ],
          },
        ],
      };
      return { data };
    }

    // Health check GraphQL
    if (/health\b/.test(clean)) {
      data["health"] = "ok";
    }

    // Products query
    if (/products\s*(\(|$|\{)/.test(clean)) {
      const limitMatch = clean.match(/limit\s*:\s*(\d+)/);
      const limit = limitMatch ? parseInt(limitMatch[1] ?? "20", 10) : (variables.limit ?? 20);
      const categoryMatch = clean.match(/category\s*:\s*"([^"]+)"/);
      const category = categoryMatch ? categoryMatch[1] : variables.category;

      const products = await ctx.runQuery(api.queries.products.list, {
        category,
        paginationOpts: { numItems: limit, cursor: null },
      });
      data["products"] = products.page ?? [];
    }

    // Single product query
    if (/product\s*\(/.test(clean)) {
      const slugMatch = clean.match(/slug\s*:\s*"([^"]+)"/);
      const skuMatch = clean.match(/sku\s*:\s*"([^"]+)"/);
      const slug = slugMatch ? slugMatch[1] : variables.slug;
      const sku = skuMatch ? skuMatch[1] : variables.sku;

      if (slug) {
        data["product"] = await ctx.runQuery(api.queries.products.getBySlug, { slug });
      } else if (sku) {
        data["product"] = await ctx.runQuery(api.queries.products.getBySku, { sku });
      }
    }

    // Recent orders query
    if (/recentOrders\b/.test(clean)) {
      const limitMatch = clean.match(/limit\s*:\s*(\d+)/);
      const limit = limitMatch ? parseInt(limitMatch[1] ?? "10", 10) : (variables.limit ?? 10);
      data["recentOrders"] = await ctx.runQuery(api.queries.orders.recentOrders, { sessionToken, limit });
    }

    // Orders query
    if (/orders\s*(\(|$|\{)/.test(clean) && !/recentOrders/.test(clean)) {
      const limitMatch = clean.match(/limit\s*:\s*(\d+)/);
      const limit = limitMatch ? parseInt(limitMatch[1] ?? "20", 10) : (variables.limit ?? 20);
      const statusMatch = clean.match(/status\s*:\s*"([^"]+)"/);
      const status = statusMatch ? statusMatch[1] : variables.status;

      const orders = await ctx.runQuery(api.queries.orders.list, {
        sessionToken,
        status,
        paginationOpts: { numItems: limit, cursor: null },
      });
      data["orders"] = orders.page ?? [];
    }

    // KPI Snapshot query
    if (/kpiSnapshot\b/.test(clean)) {
      const periodMatch = clean.match(/period\s*:\s*"([^"]+)"/);
      const period = (periodMatch ? periodMatch[1] : variables.period) ?? "today";
      data["kpiSnapshot"] = await ctx.runQuery(api.queries.analytics.kpiSnapshot, {
        sessionToken,
        period: period as any,
      });
    }

    // Mutation: updateOrderStatus
    if (/updateOrderStatus\b/.test(clean)) {
      const numMatch = clean.match(/orderNumber\s*:\s*"([^"]+)"/);
      const statusMatch = clean.match(/status\s*:\s*"([^"]+)"/);
      const orderNumber = numMatch ? numMatch[1] : variables.orderNumber;
      const status = statusMatch ? statusMatch[1] : variables.status;

      data["updateOrderStatus"] = await ctx.runMutation(api.mutations.orders.updateStatus, {
        sessionToken,
        orderNumber,
        status,
      });
    }

    // Mutation: adjustStock
    if (/adjustStock\b/.test(clean)) {
      const skuMatch = clean.match(/sku\s*:\s*"([^"]+)"/);
      const deltaMatch = clean.match(/delta\s*:\s*(-?\d+)/);
      const reasonMatch = clean.match(/reason\s*:\s*"([^"]+)"/);
      const sku = skuMatch ? skuMatch[1] : variables.sku;
      const delta = deltaMatch ? parseInt(deltaMatch[1] ?? "0", 10) : variables.delta;
      const reason = (reasonMatch ? reasonMatch[1] : variables.reason) ?? "adjustment";

      data["adjustStock"] = await ctx.runMutation(api.mutations.stock.adjust, {
        sessionToken,
        sku,
        delta,
        reason,
      });
    }

    return { data };
  } catch (err: any) {
    const message = err?.data?.message ?? err.message ?? "Erreur lors de l'exécution GraphQL";
    return { data, errors: [{ message }] };
  }
}

function bearer(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  return header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
}

// ─── HTTP Routes ──────────────────────────────────────────────────────────────

// Health check endpoint REST
http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({
        status: "ok",
        service: "frameitup-api",
        version: "1.0.0",
        convex: "healthy",
        timestamp: Date.now(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      }
    );
  }),
});

// GraphQL OPTIONS (CORS preflight)
http.route({
  path: "/graphql",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }),
});

// GraphQL GET (GraphiQL Explorer ou query HTTP)
http.route({
  path: "/graphql",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");
    const accept = request.headers.get("accept") ?? "";

    // Si pas de paramètre query ou si demandé dans le navigateur -> GraphiQL HTML
    if (!query || accept.includes("text/html")) {
      return new Response(GRAPHIQL_HTML, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8", ...CORS_HEADERS },
      });
    }

    // Exécution query GET
    const variablesRaw = url.searchParams.get("variables");
    const variables = variablesRaw ? JSON.parse(variablesRaw) : {};
    const result = await executeGraphQL(ctx, query, variables, bearer(request));

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }),
});

// GraphQL POST (Requêtes client GraphQL — Apollo, urql, fetch)
http.route({
  path: "/graphql",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = (await request.json()) as {
        query?: string;
        variables?: Record<string, any>;
        operationName?: string;
      };

      if (!body.query) {
        return new Response(
          JSON.stringify({ errors: [{ message: "Requête GraphQL invalide : champ 'query' manquant" }] }),
          { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
        );
      }

      const result = await executeGraphQL(ctx, body.query, body.variables ?? {}, bearer(request));
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ errors: [{ message: err.message ?? "Erreur de traitement de la requête" }] }),
        { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
      );
    }
  }),
});

export default http;
