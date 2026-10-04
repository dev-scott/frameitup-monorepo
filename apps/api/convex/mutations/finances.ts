import { mutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { requirePermission, logAudit } from "../lib/auth";

/**
 * Mutations Convex — Finances (permission `finances.write`)
 */

export const addTransaction = mutation({
  args: {
    sessionToken: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    amount: v.number(),
    description: v.string(),
    transactionDate: v.optional(v.number()),
    paymentMethod: v.optional(v.string()),
    reference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requirePermission(ctx, args.sessionToken, "finances.write");
    if (!(args.amount > 0)) throw new ConvexError({ code: "INVALID", message: "Le montant doit être supérieur à 0." });
    if (!args.description.trim()) throw new ConvexError({ code: "INVALID", message: "Une description est requise." });

    const id = await ctx.db.insert("transactions", {
      type: args.type,
      category: args.category.trim().toLowerCase() || "divers",
      amount: Math.round(args.amount),
      currency: "XOF",
      description: args.description.trim(),
      transactionDate: args.transactionDate ?? Date.now(),
      paymentMethod: args.paymentMethod,
      reference: args.reference?.trim() || undefined,
      isRecurring: false,
      tags: [],
    });
    await logAudit(ctx, {
      user,
      action: "finance.create",
      entity: "transaction",
      entityId: id,
      summary: `${args.type === "income" ? "Recette" : "Dépense"} ajoutée : ${args.description.trim()} — ${Math.round(args.amount).toLocaleString("fr-FR")} FCFA`,
    });
    return { id };
  },
});

export const deleteTransaction = mutation({
  args: { sessionToken: v.string(), transactionId: v.id("transactions") },
  handler: async (ctx, args) => {
    const { user } = await requirePermission(ctx, args.sessionToken, "finances.write");
    const tx = await ctx.db.get(args.transactionId);
    if (!tx) throw new ConvexError({ code: "NOT_FOUND", message: "Transaction introuvable." });
    if (tx.orderId) {
      throw new ConvexError({
        code: "INVALID",
        message: "Cette recette est liée à une commande. Modifiez la commande plutôt que la transaction.",
      });
    }
    await ctx.db.delete(tx._id);
    await logAudit(ctx, {
      user,
      action: "finance.delete",
      entity: "transaction",
      entityId: tx._id,
      summary: `Transaction supprimée : ${tx.description} — ${tx.amount.toLocaleString("fr-FR")} FCFA`,
    });
    return { success: true };
  },
});
