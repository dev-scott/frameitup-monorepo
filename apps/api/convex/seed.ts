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

export const seedBoutiqueProducts = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Assurer la présence du compte administrateur
    const admin = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "admin@frameitup.com"))
      .first();

    if (!admin) {
      await ctx.db.insert("users", {
        email: "admin@frameitup.com",
        firstName: "Directeur",
        lastName: "FrameItUp",
        role: "super_admin",
        isActive: true,
        password: "admin",
        lastLoginAt: Date.now(),
      });
    }

    // 2. Œuvres d'art de la boutique avec images HD
    const artworks = [
      {
        sku: "ART-HARMONIE-DOREE",
        slug: "harmonie-doree-a3",
        name: "Harmonie Dorée",
        category: "tableau" as const,
        description: "Explosion de couleurs chaudes sur fond ivoire. Moulure chêne naturel huilé, passe-partout blanc cœur.",
        priceAmount: 42000,
        priceCurrency: "XOF",
        status: "active" as const,
        isFeatured: true,
        images: [{
          url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=90",
          alt: "Harmonie Dorée",
          width: 800,
          height: 800,
          isPrimary: true,
        }],
        attributes: [
          { key: "artist", value: "Collection FrameItUp" },
          { key: "style", value: "Art Abstrait" },
          { key: "dimensions", value: "30 × 40 cm" },
          { key: "mouldure", value: "Chêne naturel huilé 22mm" },
          { key: "passepartout", value: "Blanc cœur 30mm" },
          { key: "protection", value: "Verre antireflet minéral" },
        ],
        tags: ["Art Abstrait", "Bestseller"],
      },
      {
        sku: "ART-SAHEL-SUNSET",
        slug: "sahel-sunset",
        name: "Coucher de Sahel",
        category: "tableau" as const,
        description: "La lumière rasante du crépuscule sur la savane. Tirage fine art 250g, couleurs profondes et lumineuses.",
        priceAmount: 58000,
        priceCurrency: "XOF",
        status: "active" as const,
        isFeatured: true,
        images: [{
          url: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=90",
          alt: "Coucher de Sahel",
          width: 800,
          height: 800,
          isPrimary: true,
        }],
        attributes: [
          { key: "artist", value: "Collection FrameItUp" },
          { key: "style", value: "Photographie" },
          { key: "dimensions", value: "40 × 60 cm" },
          { key: "mouldure", value: "Acajou rouge poli 18mm" },
          { key: "passepartout", value: "Sans passe-partout" },
          { key: "protection", value: "Plexiglas poli au diamant" },
        ],
        tags: ["Photographie", "Nouveau"],
      },
      {
        sku: "ART-BOTANIQUE-TROP",
        slug: "botanique-tropicale",
        name: "Botanique Tropicale",
        category: "tableau" as const,
        description: "Illustration botanique inspirée des flores d'Afrique équatoriale. Rendu détaillé et texturé.",
        priceAmount: 38000,
        priceCurrency: "XOF",
        status: "active" as const,
        isFeatured: false,
        images: [{
          url: "https://images.unsplash.com/photo-1490750967868-88df5691cc06?w=800&q=90",
          alt: "Botanique Tropicale",
          width: 800,
          height: 800,
          isPrimary: true,
        }],
        attributes: [
          { key: "artist", value: "Collection FrameItUp" },
          { key: "style", value: "Botanique" },
          { key: "dimensions", value: "30 × 40 cm" },
          { key: "mouldure", value: "Chêne naturel huilé 22mm" },
          { key: "passepartout", value: "Ivoire 25mm" },
          { key: "protection", value: "Verre antireflet minéral" },
        ],
        tags: ["Botanique", "Plantes"],
      },
      {
        sku: "ART-PORTRAIT-CONTEMP",
        slug: "portrait-contemporain",
        name: "Portrait Contemporain",
        category: "tableau" as const,
        description: "Étude de lumière en noir et blanc. La moulure laquée noire sublime la profondeur du regard.",
        priceAmount: 52000,
        priceCurrency: "XOF",
        status: "active" as const,
        isFeatured: false,
        images: [{
          url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=90",
          alt: "Portrait Contemporain",
          width: 800,
          height: 800,
          isPrimary: true,
        }],
        attributes: [
          { key: "artist", value: "Collection FrameItUp" },
          { key: "style", value: "Portrait" },
          { key: "dimensions", value: "40 × 50 cm" },
          { key: "mouldure", value: "Laque noire mate 20mm" },
          { key: "passepartout", value: "Blanc cœur 30mm" },
          { key: "protection", value: "Verre antireflet minéral" },
        ],
        tags: ["Portrait", "Noir et Blanc"],
      },
      {
        sku: "ART-LIGNES-URBAINES",
        slug: "lignes-urbaines",
        name: "Lignes Urbaines",
        category: "tableau" as const,
        description: "La géométrie de la ville moderne capturée à l'heure bleue. Cadre aluminium brossé discret.",
        priceAmount: 74000,
        priceCurrency: "XOF",
        status: "active" as const,
        isFeatured: true,
        images: [{
          url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=90",
          alt: "Lignes Urbaines",
          width: 800,
          height: 800,
          isPrimary: true,
        }],
        attributes: [
          { key: "artist", value: "Collection FrameItUp" },
          { key: "style", value: "Architecture" },
          { key: "dimensions", value: "50 × 70 cm" },
          { key: "mouldure", value: "Aluminium argent brossé 15mm" },
          { key: "passepartout", value: "Sans passe-partout" },
          { key: "protection", value: "Plexiglas poli au diamant" },
        ],
        tags: ["Architecture", "Grand format"],
      },
      {
        sku: "ART-CASCADE-LUMIERE",
        slug: "cascade-lumiere",
        name: "Cascade de Lumière",
        category: "tableau" as const,
        description: "La puissance apaisante de l'eau en longue exposition. Rendu soyeux sur papier Hahnemühle 250g.",
        priceAmount: 62000,
        priceCurrency: "XOF",
        status: "active" as const,
        isFeatured: false,
        images: [{
          url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=90",
          alt: "Cascade de Lumière",
          width: 800,
          height: 800,
          isPrimary: true,
        }],
        attributes: [
          { key: "artist", value: "Collection FrameItUp" },
          { key: "style", value: "Paysage" },
          { key: "dimensions", value: "40 × 60 cm" },
          { key: "mouldure", value: "Wengé africain 25mm" },
          { key: "passepartout", value: "Lin naturel 20mm" },
          { key: "protection", value: "Verre antireflet minéral" },
        ],
        tags: ["Paysage", "Nature"],
      },
    ];

    let inserted = 0;
    for (const art of artworks) {
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", art.slug))
        .first();

      if (!existing) {
        const prodId = await ctx.db.insert("products", art);
        await ctx.db.insert("stock", {
          productId: prodId,
          sku: art.sku,
          quantity: 12,
          reservedQuantity: 0,
          reorderPoint: 3,
          reorderQuantity: 10,
          location: "Atelier Central - Rayon B",
        });
        inserted++;
      }
    }

    return { success: true, insertedCount: inserted };
  },
});

