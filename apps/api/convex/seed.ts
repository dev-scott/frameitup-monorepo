import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Mutation pour injecter des données initiales réelles dans Convex
 */
export const seedInitialData = mutation({
  args: {
    force: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existingProducts = await ctx.db.query("products").take(1);
    if (existingProducts.length > 0 && !args.force) {
      return { message: "La base contient déjà des données. Utilisez force: true pour réinjecter." };
    }

    // 1. Clients
    const customer1 = await ctx.db.insert("customers", {
      firstName: "Kouassi",
      lastName: "Amani",
      email: "k.amani@mail.ci",
      phone: "+225 07 08 09 10 11",
      addresses: [
        {
          fullName: "Kouassi Amani",
          phone: "+225 07 08 09 10 11",
          street: "Boulevard de Marseille",
          city: "Abidjan",
          country: "Côte d'Ivoire",
        },
      ],
      totalOrders: 3,
      totalSpentAmount: 245000,
      totalSpentCurrency: "XOF",
      isVip: true,
      tags: ["Art", "Collectionneur", "VIP"],
    });

    const customer2 = await ctx.db.insert("customers", {
      firstName: "Fatou",
      lastName: "Diallo",
      email: "f.diallo@gmail.com",
      phone: "+221 77 123 45 67",
      addresses: [
        {
          fullName: "Fatou Diallo",
          phone: "+221 77 123 45 67",
          street: "Almadies",
          city: "Dakar",
          country: "Sénégal",
        },
      ],
      totalOrders: 1,
      totalSpentAmount: 72000,
      totalSpentCurrency: "XOF",
      isVip: false,
      tags: ["Nouveau"],
    });

    const customer3 = await ctx.db.insert("customers", {
      firstName: "Jean-Marc",
      lastName: "Bah",
      email: "jm.bah@outlook.com",
      phone: "+225 05 55 44 33 22",
      addresses: [
        {
          fullName: "Jean-Marc Bah",
          phone: "+225 05 55 44 33 22",
          street: "Cocody Danga",
          city: "Abidjan",
          country: "Côte d'Ivoire",
        },
      ],
      totalOrders: 5,
      totalSpentAmount: 580000,
      totalSpentCurrency: "XOF",
      isVip: true,
      tags: ["Architecte", "Sur-mesure"],
    });

    // 2. Produits
    const prod1 = await ctx.db.insert("products", {
      sku: "CAD-BAO-EBENE",
      name: "Cadre Baobab en Bois d'Ébène",
      slug: "cadre-baobab-bois-ebene",
      description: "Cadre d'artisanat d'exception sculpté dans du bois d'ébène avec finition satinée.",
      category: "cadre",
      status: "active",
      priceAmount: 45000,
      priceCurrency: "XOF",
      images: [
        {
          url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800",
          alt: "Cadre Bois d'Ébène",
          width: 800,
          height: 800,
          isPrimary: true,
        },
      ],
      attributes: [
        { key: "Bois", value: "Ébène massif" },
        { key: "Finition", value: "Satiné noir" },
      ],
      tags: ["Premium", "Ébène", "Fait main"],
      isFeatured: true,
    });

    const prod2 = await ctx.db.insert("products", {
      sku: "CAD-MIN-CHENE",
      name: "Cadre Minimaliste Chêne Clair",
      slug: "cadre-minimaliste-chene-clair",
      description: "Lignes pures et naturelles pour mettre en valeur tirages photo et lithographies.",
      category: "cadre",
      status: "active",
      priceAmount: 32000,
      priceCurrency: "XOF",
      images: [
        {
          url: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800",
          alt: "Cadre Chêne Clair",
          width: 800,
          height: 800,
          isPrimary: true,
        },
      ],
      attributes: [
        { key: "Bois", value: "Chêne naturel" },
        { key: "Profil", value: "Fin 15mm" },
      ],
      tags: ["Design", "Scandinave", "Photo"],
      isFeatured: true,
    });

    const prod3 = await ctx.db.insert("products", {
      sku: "VER-UV-MUSEE",
      name: "Verre Antireflet Musée UV 99%",
      slug: "verre-antireflet-musee-uv",
      description: "Verre optique de conservation de qualité musée bloquant 99% des rayons ultraviolets.",
      category: "accessoire",
      status: "active",
      priceAmount: 18000,
      priceCurrency: "XOF",
      images: [
        {
          url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800",
          alt: "Verre Musée UV",
          width: 800,
          height: 800,
          isPrimary: true,
        },
      ],
      attributes: [{ key: "Protection UV", value: "99%" }],
      tags: ["Conservation", "Musée"],
      isFeatured: false,
    });

    const prod4 = await ctx.db.insert("products", {
      sku: "PAS-BLA-TEXT",
      name: "Passe-partout Blanc Coton Texturé",
      slug: "passe-partout-blanc-coton",
      description: "Passe-partout sans acide 100% coton de 2.4mm avec biseau à 45°.",
      category: "accessoire",
      status: "active",
      priceAmount: 8500,
      priceCurrency: "XOF",
      images: [
        {
          url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800",
          alt: "Passe-partout Blanc",
          width: 800,
          height: 800,
          isPrimary: true,
        },
      ],
      attributes: [{ key: "Épaisseur", value: "2.4mm" }],
      tags: ["Accessoire", "Papeterie"],
      isFeatured: false,
    });

    // 3. Stock
    await ctx.db.insert("stock", {
      productId: prod1,
      sku: "CAD-BAO-EBENE",
      quantity: 4,
      reservedQuantity: 1,
      reorderPoint: 8,
      reorderQuantity: 15,
      location: "Atelier A - Étagère 2",
    });

    await ctx.db.insert("stock", {
      productId: prod2,
      sku: "CAD-MIN-CHENE",
      quantity: 18,
      reservedQuantity: 2,
      reorderPoint: 10,
      reorderQuantity: 20,
      location: "Atelier A - Étagère 1",
    });

    await ctx.db.insert("stock", {
      productId: prod3,
      sku: "VER-UV-MUSEE",
      quantity: 3,
      reservedQuantity: 2,
      reorderPoint: 10,
      reorderQuantity: 25,
      location: "Réserve Verres - Casier 4",
    });

    await ctx.db.insert("stock", {
      productId: prod4,
      sku: "PAS-BLA-TEXT",
      quantity: 35,
      reservedQuantity: 0,
      reorderPoint: 15,
      reorderQuantity: 50,
      location: "Atelier B - Carton 12",
    });

    // 4. Commandes
    const order1 = await ctx.db.insert("orders", {
      orderNumber: "#FIU-2026-0127",
      customerId: customer1,
      customerEmail: "k.amani@mail.ci",
      customerPhone: "+225 07 08 09 10 11",
      status: "processing",
      paymentStatus: "paid",
      paymentMethod: "Wave",
      lines: [
        {
          productId: prod1,
          sku: "CAD-BAO-EBENE",
          name: "Cadre Baobab en Bois d'Ébène",
          quantity: 2,
          unitPriceAmount: 45000,
          unitPriceCurrency: "XOF",
          subtotalAmount: 90000,
        },
        {
          productId: prod3,
          sku: "VER-UV-MUSEE",
          name: "Verre Antireflet Musée UV 99%",
          quantity: 2,
          unitPriceAmount: 18000,
          unitPriceCurrency: "XOF",
          subtotalAmount: 36000,
        },
      ],
      shippingAddress: {
        fullName: "Kouassi Amani",
        phone: "+225 07 08 09 10 11",
        street: "Boulevard de Marseille",
        city: "Abidjan",
        country: "Côte d'Ivoire",
      },
      subtotalAmount: 126000,
      shippingFeeAmount: 5000,
      discountAmount: 0,
      totalAmount: 131000,
      currency: "XOF",
    });

    const order2 = await ctx.db.insert("orders", {
      orderNumber: "#FIU-2026-0126",
      customerId: customer2,
      customerEmail: "f.diallo@gmail.com",
      customerPhone: "+221 77 123 45 67",
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "Orange Money",
      lines: [
        {
          productId: prod2,
          sku: "CAD-MIN-CHENE",
          name: "Cadre Minimaliste Chêne Clair",
          quantity: 2,
          unitPriceAmount: 32000,
          unitPriceCurrency: "XOF",
          subtotalAmount: 64000,
        },
      ],
      shippingAddress: {
        fullName: "Fatou Diallo",
        phone: "+221 77 123 45 67",
        street: "Almadies",
        city: "Dakar",
        country: "Sénégal",
      },
      subtotalAmount: 64000,
      shippingFeeAmount: 8000,
      discountAmount: 0,
      totalAmount: 72000,
      currency: "XOF",
    });

    const order3 = await ctx.db.insert("orders", {
      orderNumber: "#FIU-2026-0125",
      customerId: customer3,
      customerEmail: "jm.bah@outlook.com",
      customerPhone: "+225 05 55 44 33 22",
      status: "delivered",
      paymentStatus: "paid",
      paymentMethod: "Carte Bancaire",
      lines: [
        {
          productId: prod1,
          sku: "CAD-BAO-EBENE",
          name: "Cadre Baobab en Bois d'Ébène",
          quantity: 4,
          unitPriceAmount: 45000,
          unitPriceCurrency: "XOF",
          subtotalAmount: 180000,
        },
      ],
      shippingAddress: {
        fullName: "Jean-Marc Bah",
        phone: "+225 05 55 44 33 22",
        street: "Cocody Danga",
        city: "Abidjan",
        country: "Côte d'Ivoire",
      },
      subtotalAmount: 180000,
      shippingFeeAmount: 0,
      discountAmount: 10000,
      totalAmount: 170000,
      currency: "XOF",
    });

    // 5. Transactions financières
    const now = Date.now();
    await ctx.db.insert("transactions", {
      type: "income",
      category: "Vente en ligne",
      amount: 131000,
      currency: "XOF",
      description: "Paiement commande #FIU-2026-0127 (Wave)",
      orderId: order1,
      transactionDate: now - 3600000,
      paymentMethod: "Wave",
      isRecurring: false,
      tags: ["Commande", "Wave"],
    });

    await ctx.db.insert("transactions", {
      type: "income",
      category: "Vente en ligne",
      amount: 170000,
      currency: "XOF",
      description: "Paiement commande #FIU-2026-0125 (Carte Bancaire)",
      orderId: order3,
      transactionDate: now - 86400000,
      paymentMethod: "Carte Bancaire",
      isRecurring: false,
      tags: ["Commande", "CB"],
    });

    await ctx.db.insert("transactions", {
      type: "expense",
      category: "Matières premières",
      amount: 75000,
      currency: "XOF",
      description: "Achat bois d'ébène et moulures brutes",
      transactionDate: now - 172800000,
      paymentMethod: "Virement",
      isRecurring: false,
      tags: ["Fournisseur", "Bois"],
    });

    return { success: true, message: "Données initiales Convex injectées avec succès !" };
  },
});
