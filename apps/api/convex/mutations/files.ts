import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requirePermission } from "../lib/auth";

/**
 * Génère une URL d'upload temporaire vers Convex Storage.
 * Reste publique : utilisée par le tunnel de commande du site (photo du client).
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/** Suppression d'un fichier — réservée aux comptes pouvant modifier le catalogue */
export const deleteFile = mutation({
  args: { sessionToken: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.sessionToken, "products.write");
    await ctx.storage.delete(args.storageId);
    return { success: true };
  },
});
