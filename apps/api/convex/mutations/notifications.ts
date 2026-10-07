import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Mutations Convex — Notifications (Website / App)
 */

export const create = mutation({
  args: {
    userId: v.string(),
    type: v.string(),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      body: args.body,
      read: false,
      createdAt: Date.now(),
    });
    return { notificationId };
  },
});

export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { read: true });
    return { success: true };
  },
});

export const markAllAsRead = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("read"), false))
      .collect();

    for (const item of unread) {
      await ctx.db.patch(item._id, { read: true });
    }
    return { updated: unread.length };
  },
});
