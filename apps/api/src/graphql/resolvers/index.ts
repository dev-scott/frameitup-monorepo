import { builder } from "../builder";
import { ProductType, OrderType, KPISnapshotType, OrderStatusEnum } from "../types/index";

/**
 * GraphQL Query Resolvers
 * Les données viennent de Convex via le contexte HTTP Action
 */
builder.queryType({
  fields: (t) => ({
    // ─── Products ─────────────────────────────────────────────────────────────
    products: t.field({
      type: [ProductType],
      description: "Liste des produits du catalogue",
      args: {
        category: t.arg.string({ required: false }),
        status: t.arg.string({ required: false }),
        limit: t.arg.int({ required: false, defaultValue: 20 }),
      },
      resolve: async (_root, args, ctx: any) => {
        // TODO: Appeler la query Convex via ctx.runQuery
        return [];
      },
    }),

    product: t.field({
      type: ProductType,
      nullable: true,
      description: "Récupérer un produit par son slug",
      args: {
        slug: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx: any) => {
        // TODO: ctx.runQuery(api.queries.products.getBySlug, { slug: args.slug })
        return null;
      },
    }),

    // ─── Orders ───────────────────────────────────────────────────────────────
    orders: t.field({
      type: [OrderType],
      description: "Liste des commandes (dashboard uniquement)",
      args: {
        status: t.arg({ type: OrderStatusEnum, required: false }),
        cursor: t.arg.string({ required: false }),
        limit: t.arg.int({ required: false, defaultValue: 20 }),
      },
      resolve: async (_root, args, ctx: any) => {
        // TODO: ctx.runQuery(api.queries.orders.list, { status: args.status })
        return [];
      },
    }),

    order: t.field({
      type: OrderType,
      nullable: true,
      description: "Récupérer une commande par numéro",
      args: {
        orderNumber: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx: any) => {
        return null;
      },
    }),

    // ─── KPIs ─────────────────────────────────────────────────────────────────
    kpiSnapshot: t.field({
      type: KPISnapshotType,
      description: "Indicateurs clés (dashboard overview)",
      args: {
        period: t.arg.string({ required: false, defaultValue: "month" }),
      },
      resolve: async (_root, args, ctx: any) => {
        // TODO: Aggréger depuis Convex
        return {
          totalRevenue: { amount: 0, currency: "XOF" },
          revenueDelta: 0,
          totalOrders: 0,
          ordersDelta: 0,
          newCustomers: 0,
          customersDelta: 0,
          averageOrderValue: { amount: 0, currency: "XOF" },
          aovDelta: 0,
          stockAlerts: 0,
        };
      },
    }),
  }),
});

// ─── Mutations ────────────────────────────────────────────────────────────────
builder.mutationType({
  fields: (t) => ({
    updateOrderStatus: t.field({
      type: OrderType,
      nullable: true,
      description: "Changer le statut d'une commande",
      args: {
        orderId: t.arg.string({ required: true }),
        status: t.arg({ type: OrderStatusEnum, required: true }),
        notes: t.arg.string({ required: false }),
      },
      resolve: async (_root, args, ctx: any) => {
        // TODO: ctx.runMutation(api.mutations.orders.updateStatus, {...})
        return null;
      },
    }),

    createProduct: t.field({
      type: ProductType,
      nullable: true,
      description: "Créer un nouveau produit",
      args: {
        name: t.arg.string({ required: true }),
        sku: t.arg.string({ required: true }),
        priceAmount: t.arg.int({ required: true }),
        category: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx: any) => {
        return null;
      },
    }),
  }),
});
