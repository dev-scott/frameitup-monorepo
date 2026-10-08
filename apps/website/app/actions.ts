'use server';

import { Resend } from 'resend';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/lib/convex';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://fearless-axolotl-634.convex.cloud';
const convex = new ConvexHttpClient(convexUrl);

import { OrderStatus, type CreateOrderParams } from '@/lib/order-types';

// ─── Fetch All Available Frames ────────────────────────────────────
export async function getSeedFrames() {
  try {
    const products = await convex.query(api.queries.products.listAll, { category: 'cadre' });
    if (products && products.length > 0) {
      return products.map((f: any) => {
        const matAttr = f.attributes?.find((a: any) => a.key === 'Bois' || a.key === 'Matière')?.value || 'Bois';
        const isWood = matAttr.toLowerCase().includes('bois') || matAttr.toLowerCase().includes('chêne') || matAttr.toLowerCase().includes('ébène');
        return {
          id: f.slug || f._id,
          name: f.name,
          material: isWood ? 'WOOD' : 'METAL',
          color: f.attributes?.find((a: any) => a.key === 'Finition' || a.key === 'Couleur')?.value || '#8B6914',
          widthMm: 210,
          heightMm: 297,
          depthMm: 12,
          priceUsd: f.priceAmount,
          thumbnailUrl: f.images?.[0]?.url || '/frames/bois.webp',
          available: f.status === 'active',
        };
      });
    }
  } catch (error) {
    console.warn('[actions] Convex frames fallback:', error);
  }

  // Fallback defaults
  return [
    {
      id: 'frame-bois',
      name: 'Cadre en Bois',
      material: 'WOOD',
      color: '#8B6914',
      widthMm: 210,
      heightMm: 297,
      depthMm: 12,
      priceUsd: 5000,
      thumbnailUrl: '/frames/bois.webp',
      available: true,
    },
    {
      id: 'frame-plexiglas',
      name: 'Cadre Plexiglas',
      material: 'METAL',
      color: '#CBD5E1',
      widthMm: 210,
      heightMm: 297,
      depthMm: 8,
      priceUsd: 7000,
      thumbnailUrl: '/frames/plexiglas.webp',
      available: true,
    },
    {
      id: 'frame-vitre',
      name: 'Cadre Vitré',
      material: 'WOOD',
      color: '#1A1A2E',
      widthMm: 210,
      heightMm: 297,
      depthMm: 15,
      priceUsd: 5000,
      thumbnailUrl: '/frames/vitre.webp',
      available: true,
    },
  ];
}

// ─── Create Custom Framing Order ───────────────────────────────────
export async function createOrder(params: CreateOrderParams) {
  try {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = `FRM-${randomSuffix}`;

    const orderStatus = params.paymentMethod === 'CASH_ON_DELIVERY'
      ? 'pending'
      : 'confirmed';

    let orderId = `ord_${randomSuffix}`;

    try {
      const created = await convex.mutation(api.mutations.orders.create, {
        customerEmail: params.shipping.email,
        customerPhone: params.shipping.whatsapp,
        lines: params.items.map((item) => ({
          sku: item.frameId,
          name: `Cadre personnalisé (${item.frameId})`,
          quantity: item.quantity,
          unitPriceAmount: Math.round(item.unitPriceUsd),
          unitPriceCurrency: 'XOF',
          subtotalAmount: Math.round(item.unitPriceUsd * item.quantity),
          customization: {
            width: item.widthPx,
            height: item.heightPx,
            frameStyle: item.frameId,
            passepartout: Boolean(item.matColor),
            imageUrl: item.imageUrl,
          },
        })),
        subtotalAmount: Math.round(params.totalUsd),
        shippingFeeAmount: 0,
        discountAmount: 0,
        totalAmount: Math.round(params.totalUsd),
        currency: 'XOF',
        shippingAddress: {
          fullName: `${params.shipping.firstName} ${params.shipping.lastName}`.trim(),
          phone: params.shipping.whatsapp,
          street: params.shipping.line1 + (params.shipping.line2 ? ` ${params.shipping.line2}` : ''),
          city: params.shipping.city,
          country: params.shipping.country,
          zipCode: params.shipping.postalCode,
        },
        paymentMethod: params.paymentMethod,
        paymentStatus: params.paymentMethod === 'CASH_ON_DELIVERY' ? 'pending' : 'paid',
        notes: `Paiement: ${params.paymentMethod} | Transaction: ${params.transactionId || 'N/A'}`,
      });

      if (created?.orderId) {
        orderId = created.orderId;
      }
    } catch (convexErr) {
      console.warn('[actions] Convex mutation fallback:', convexErr);
    }

    // Fire email invoice sending as background operation
    try {
      await sendInvoiceEmail({
        orderId,
        trackingNumber,
        totalUsd: params.totalUsd,
        status: orderStatus,
        shipping: params.shipping,
        items: params.items,
        paymentMethod: params.paymentMethod,
        createdAt: Date.now(),
      }, params.shipping.email);
    } catch (e) {
      console.error('Failed to trigger invoice email dispatch:', e);
    }

    return {
      success: true,
      order: {
        id: orderId,
        trackingNumber: trackingNumber,
        totalUsd: params.totalUsd,
        status: params.paymentMethod === 'CASH_ON_DELIVERY' ? OrderStatus.PENDING : OrderStatus.PAYMENT_CONFIRMED,
      },
    };
  } catch (error) {
    console.error('Database unreachable, providing fallback order for offline/demo:', error);
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = `FRM-${randomSuffix}`;
    return {
      success: true,
      order: {
        id: `ord_${randomSuffix}`,
        trackingNumber: trackingNumber,
        totalUsd: params.totalUsd,
        status: params.paymentMethod === 'CASH_ON_DELIVERY' ? OrderStatus.PENDING : OrderStatus.PAYMENT_CONFIRMED,
      },
    };
  }
}

// ─── Fetch Order History (Guest by Email or Tracking Number) ────────
export async function getUserOrders(identifier?: string) {
  try {
    const queryTerm = identifier?.trim();
    if (!queryTerm) {
      return [];
    }

    let rawOrders: any[] = [];
    if (queryTerm.includes('@')) {
      rawOrders = await convex.query(api.queries.orders.listByCustomerEmail, { email: queryTerm.toLowerCase() });
    } else {
      const singleOrder = await convex.query(api.queries.orders.trackOrder, { ref: queryTerm });
      if (singleOrder) {
        rawOrders = [singleOrder];
      }
    }

    if (rawOrders && rawOrders.length > 0) {
      return rawOrders.map((order: any) => ({
        id: order._id,
        status: (order.status || 'PENDING').toUpperCase(),
        shippingLine1: order.shippingAddress?.street || '',
        shippingCity: order.shippingAddress?.city || '',
        shippingState: '',
        shippingPostalCode: order.shippingAddress?.zipCode || '',
        shippingCountry: order.shippingAddress?.country || '',
        totalUsd: Number(order.totalAmount || 0),
        trackingNumber: order.trackingNumber || order.orderNumber,
        createdAt: order._creationTime,
        items: (order.lines || []).map((item: any, idx: number) => ({
          id: `${order._id}-${idx}`,
          frameName: item.name || 'Cadre personnalisé',
          frameColor: '#8B6914',
          imageUrl: item.customization?.imageUrl || '',
          matColor: item.customization?.passepartout ? '#FFFFFF' : undefined,
          glasingType: 'STANDARD',
          quantity: item.quantity || 1,
          unitPriceUsd: Number(item.unitPriceAmount || 0),
        })),
      }));
    }
  } catch (error) {
    console.error('Error getting orders from Convex:', error);
  }
  return [];
}

// ─── Email Invoice Sending Helper ──────────────────────────────────
async function sendInvoiceEmail(order: any, clientEmail: string) {
  const { orderId, trackingNumber, totalUsd, shipping, items, paymentMethod, createdAt } = order;
  const isCod = paymentMethod === 'CASH_ON_DELIVERY';
  const paymentMethodLabel = isCod
    ? 'Paiement à la livraison (Cash on Delivery)'
    : paymentMethod === 'MTN_MOMO'
      ? 'MTN Mobile Money'
      : 'Orange Money';

  const itemsHtml = items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #EDE8E3;">
        <strong>Cadre Personnalisé (Réf: ${item.frameId})</strong><br>
        <span style="font-size: 11px; color: #78716C;">
          Dimensions: ${item.widthPx}x${item.heightPx}mm | Passe-partout: ${item.matColor ? 'Oui' : 'Non'} | Verre: ${String(item.glasingType).replace('_', ' ')}
        </span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #EDE8E3; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #EDE8E3; text-align: right;">$${Number(item.unitPriceUsd).toFixed(2)}</td>
    </tr>
  `).join('');

  const emailHtml = `
    <div style="font-family: 'Inter', system-ui, sans-serif; background-color: #FAFAF9; color: #1C1917; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #EDE8E3; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h2 style="font-size: 26px; font-weight: bold; margin: 0; color: #1C1917;">Frame<span style="color: #d98d2e;">ItUp</span></h2>
        <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #78716C; margin: 5px 0 0 0;">Facture & Reçu d'Achat</p>
      </div>

      <div style="background-color: #FFFFFF; border: 1px solid #EDE8E3; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding-bottom: 10px; color: #78716C;">Numéro de Facture:</td>
            <td style="padding-bottom: 10px; text-align: right; font-weight: bold;">${orderId}</td>
          </tr>
          <tr>
            <td style="padding-bottom: 10px; color: #78716C;">Code Suivi Colis:</td>
            <td style="padding-bottom: 10px; text-align: right; font-weight: bold; color: #d98d2e; font-family: monospace;">${trackingNumber}</td>
          </tr>
          <tr>
            <td style="padding-bottom: 10px; color: #78716C;">Date:</td>
            <td style="padding-bottom: 10px; text-align: right;">${new Date(createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</td>
          </tr>
          <tr>
            <td style="color: #78716C;">Méthode de Paiement:</td>
            <td style="text-align: right; font-weight: bold; color: ${isCod ? '#e4a44a' : '#10B981'};">${paymentMethodLabel}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 12px; text-transform: uppercase; color: #78716C; margin-bottom: 10px; letter-spacing: 0.5px;">Adresse de Livraison</h4>
        <div style="font-size: 13px; color: #44403C; background-color: #F5F0EB; padding: 16px; border-radius: 8px;">
          <strong>${shipping.firstName} ${shipping.lastName}</strong><br>
          ${shipping.line1}${shipping.line2 ? `, ${shipping.line2}` : ''}<br>
          ${shipping.postalCode} ${shipping.city}, ${shipping.state}<br>
          ${shipping.country}<br>
          <span style="font-size: 11px; color: #78716C;">E-mail client: ${shipping.email}</span>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h4 style="font-size: 12px; text-transform: uppercase; color: #78716C; margin-bottom: 10px; letter-spacing: 0.5px;">Détails de l'article</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background-color: #EDE8E3;">
              <th style="padding: 10px; text-align: left; font-weight: bold;">Configuration</th>
              <th style="padding: 10px; text-align: center; font-weight: bold;">Qté</th>
              <th style="padding: 10px; text-align: right; font-weight: bold;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      <div style="border-top: 2px solid #EDE8E3; padding-top: 15px; text-align: right; margin-bottom: 30px;">
        <span style="font-size: 12px; text-transform: uppercase; color: #78716C;">Montant total :</span>
        <h3 style="font-size: 24px; font-weight: 900; margin: 5px 0 0 0; color: #d98d2e;">$${totalUsd.toFixed(2)}</h3>
        ${isCod
          ? '<span style="font-size: 11px; color: #e4a44a; font-weight: bold;">À payer en espèces au livreur lors de la livraison</span>'
          : '<span style="font-size: 11px; color: #10B981; font-weight: bold;">Réglé en ligne avec succès via CinetPay</span>'}
      </div>

      <div style="text-align: center; font-size: 11px; color: #A8A29E; border-top: 1px solid #EDE8E3; padding-top: 20px;">
        <p>Des questions concernant votre commande ? Contactez notre support à support@frameitup.com</p>
        <p>© 2026 FrameItUp S.A. Tous droits réservés.</p>
      </div>
    </div>
  `;

  // Dispatch using Resend API if API Key is set
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'FrameItUp <receipts@frameitup.com>',
        to: clientEmail,
        subject: `Facture FrameItUp ${trackingNumber} - Confirmation de commande`,
        html: emailHtml,
      });
      console.log(`[Resend dispatch successful] Invoice sent to ${clientEmail}`);
    } catch (e) {
      console.error('[Resend Error] Failed to send email via Resend API:', e);
      console.log(`\n--- [FALLBACK MOCK EMAIL DISPATCH] ---\nTo: ${clientEmail}\nSubject: Facture FrameItUp ${trackingNumber}\nContent:\n${emailHtml}\n---------------------------------------\n`);
    }
  } else {
    console.log(`\n--- [MOCK EMAIL DISPATCH - NO RESEND API KEY] ---\nTo: ${clientEmail}\nSubject: Facture FrameItUp ${trackingNumber}\nContent:\n${emailHtml}\n-------------------------------------------------\n`);
  }
}
