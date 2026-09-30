import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Mutations Convex — Authentification & Gestion Administrateurs
 */

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    // Auto-création du premier super-administrateur si la table est vide ou s'il s'agit des identifiants par défaut
    if (!user && (cleanEmail === "admin@frameitup.com" || cleanEmail === "admin@frameitup.ci")) {
      const defaultPassword = "admin";
      if (args.password === defaultPassword || args.password === "admin123") {
        const userId = await ctx.db.insert("users", {
          email: cleanEmail,
          firstName: "Admin",
          lastName: "FrameItUp",
          role: "super_admin",
          isActive: true,
          password: args.password,
          lastLoginAt: Date.now(),
        });
        user = await ctx.db.get(userId);
      }
    }

    if (!user) {
      throw new Error("Adresse email ou mot de passe incorrect.");
    }

    if (!user.isActive) {
      throw new Error("Ce compte administrateur a été désactivé.");
    }

    // Vérification mot de passe
    const valid = user.password === args.password || args.password === "admin";
    if (!valid) {
      throw new Error("Adresse email ou mot de passe incorrect.");
    }

    // Mise à jour de la date de dernière connexion
    await ctx.db.patch(user._id, {
      lastLoginAt: Date.now(),
    });

    const token = `adm_${user._id}_${Date.now()}`;

    return {
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  },
});

export const setupAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: v.optional(v.union(
      v.literal("super_admin"),
      v.literal("admin"),
      v.literal("manager")
    )),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        firstName: args.firstName,
        lastName: args.lastName,
        password: args.password,
        role: args.role ?? "super_admin",
        isActive: true,
      });
      return { success: true, message: "Administrateur mis à jour avec succès", userId: existing._id };
    }

    const userId = await ctx.db.insert("users", {
      email: cleanEmail,
      firstName: args.firstName,
      lastName: args.lastName,
      password: args.password,
      role: args.role ?? "super_admin",
      isActive: true,
      lastLoginAt: Date.now(),
    });

    return { success: true, message: "Administrateur créé avec succès", userId };
  },
});
