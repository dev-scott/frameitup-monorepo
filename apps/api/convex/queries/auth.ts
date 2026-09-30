import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Queries Convex — Utilisateurs & Profil Admin
 */

export const hasAdmin = query({
  args: {},
  handler: async (ctx) => {
    const admin = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "super_admin"))
      .first();
    return !!admin;
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const clean = args.email.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", clean))
      .first();

    if (!user) return null;
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      lastLoginAt: user.lastLoginAt,
    };
  },
});
