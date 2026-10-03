import { query } from "../_generated/server";
import { v } from "convex/values";
import { requirePermission, publicUser } from "../lib/auth";

/**
 * Queries Convex — Équipe & journal d'activité
 */

export const listUsers = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "users.manage");
    const users = await ctx.db.query("users").collect();
    const now = Date.now();
    const sessions = await ctx.db.query("sessions").collect();
    return users
      .map((u) => ({
        ...publicUser(u),
        isLocked: !!u.lockedUntil && u.lockedUntil > now,
        activeSessions: sessions.filter((s) => s.userId === u._id && s.expiresAt > now).length,
      }))
      .sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const auditLog = query({
  args: {
    sessionToken: v.string(),
    entity: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "audit.read");
    const limit = Math.min(args.limit ?? 100, 500);
    if (args.entity && args.entity !== "all") {
      return await ctx.db
        .query("auditLogs")
        .withIndex("by_entity", (q) => q.eq("entity", args.entity!))
        .order("desc")
        .take(limit);
    }
    return await ctx.db.query("auditLogs").order("desc").take(limit);
  },
});
