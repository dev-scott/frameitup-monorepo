import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Génère une URL d'upload temporaire pour téléverser un fichier directement dans Convex Storage
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
/**
 * Supprime un fichier du stockage Convex
 */
export const deleteFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
    return { success: true };
  },
});
