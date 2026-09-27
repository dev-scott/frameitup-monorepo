import SchemaBuilder from "@pothos/core";

/**
 * Pothos Schema Builder — FrameItUp GraphQL
 * Code-first GraphQL schema avec Pothos
 */
export const builder = new SchemaBuilder<{
  Context: {
    // Convex context est injecté via HTTP Action
    userId?: string;
  };
  Scalars: {
    DateTime: { Input: number; Output: number };
    JSON: { Input: unknown; Output: unknown };
  };
}>({
  plugins: [],
});

// ─── Scalars personnalisés ─────────────────────────────────────────────────────
builder.scalarType("DateTime", {
  serialize: (val) => val as number,
  parseValue: (val) => val as number,
  description: "Unix timestamp in milliseconds",
});

builder.scalarType("JSON", {
  serialize: (val) => val,
  parseValue: (val) => val,
  description: "Arbitrary JSON value",
});
