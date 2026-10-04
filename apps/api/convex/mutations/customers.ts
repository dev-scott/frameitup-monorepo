import { mutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { requirePermission, logAudit } from "../lib/auth";

/**
 * Mutations Convex — Clients (permission `customers.write`)
 */

export const update = mutation({
  args: {
    sessionToken: v.string(),
    customerId: v.id("customers"),
    isVip: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requirePermission(ctx, args.sessionToken, "customers.write");
    const customer = await ctx.db.get(args.customerId);
    if (!customer) throw new ConvexError({ code: "NOT_FOUND", message: "Client introuvable." });

    const patch: Record<string, unknown> = {};
    const changes: string[] = [];
    if (args.isVip !== undefined && args.isVip !== customer.isVip) {
      patch.isVip = args.isVip;
      changes.push(args.isVip ? "passé VIP" : "retiré des VIP");
    }
    if (args.notes !== undefined) {
      patch.notes = args.notes.trim() || undefined;
      changes.push("notes");
    }
    if (args.tags !== undefined) {
      patch.tags = args.tags.map((t) => t.trim()).filter(Boolean).slice(0, 12);
      changes.push("étiquettes");
    }
    if (args.phone !== undefined) {
      patch.phone = args.phone.trim() || undefined;
      changes.push("téléphone");
    }
    await ctx.db.patch(customer._id, patch);
    await logAudit(ctx, {
      user,
      action: "customer.update",
      entity: "customer",
      entityId: customer._id,
      summary: `${customer.firstName} ${customer.lastName} : ${changes.join(", ") || "mis à jour"}`,
    });
    return { success: true };
  },
});
