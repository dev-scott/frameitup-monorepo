import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Récupère l'URL publique de visualisation/téléchargement d'un fichier à partir de son storageId
 */
export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
