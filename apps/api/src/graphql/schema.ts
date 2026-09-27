// Import types and resolvers to build the schema
import "./types/index";
import "./resolvers/index";
import { builder } from "./builder";

/**
 * FrameItUp GraphQL Schema
 * Assemblé via Pothos — code-first
 */
export const schema = builder.toSchema();
