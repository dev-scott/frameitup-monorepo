import { query } from "../_generated/server";
import { v } from "convex/values";
import { getSession, requireSession, publicUser } from "../lib/auth";

/**
 * Queries Convex — Session courante
 *
 * `me` est réactive : si la session est révoquée, expirée ou le compte
 * désactivé, le client reçoit `null` instantanément et se déconnecte.
 */

export const me = query({
  args: { sessionToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const auth = await getSession(ctx, args.sessionToken);
    if (!auth) return null;
    return {
      ...publicUser(auth.user),
      session: {
        id: auth.session._id,
        expiresAt: auth.session.expiresAt,
      },
    };
  },
});

export const mySessions = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const { user, session } = await requireSession(ctx, args.sessionToken);
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    return sessions
      .filter((s) => s.expiresAt > Date.now())
      .sort((a, b) => b.lastSeenAt - a.lastSeenAt)
      .map((s) => ({
        id: s._id,
        createdAt: s._creationTime,
        lastSeenAt: s.lastSeenAt,
        userAgent: s.userAgent,
        current: s._id === session._id,
      }));
  },
});
