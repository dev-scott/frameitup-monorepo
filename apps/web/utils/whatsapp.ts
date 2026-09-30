import type { FrameConfig, DeliveryInfo, PriceBreakdown } from '@/types/frame';
import { getFormatById } from '@/data/formats';
import { getMouldureById } from '@/data/frames';
import { getPassepartoutById, getGlassById } from '@/data/materials';
import { formatFCFA } from '@/utils/pricing';

export function formatWhatsAppMessage(
  config: FrameConfig,
  delivery: DeliveryInfo,
  price: PriceBreakdown,
): string {
  const format = getFormatById(config.format);
  const mouldure = getMouldureById(config.mouldureId);
  const passepartout = config.passepartoutId
    ? getPassepartoutById(config.passepartoutId)
    : null;
  const glass = getGlassById(config.glassType);

  const deliveryType = delivery.deliveryType === 'express' ? '🚀 Express (24h)' : '📦 Standard (3 jours)';
  const paymentMap: Record<string, string> = {
    'cash-delivery': '💵 Cash à la livraison',
    'mtn-momo': '📱 MTN Mobile Money',
    'orange-money': '🟠 Orange Money',
  };

  const lines = [
    '🖼️ *Nouvelle commande FrameItUp*',
    '━━━━━━━━━━━━━━━━━━',
    '',
    '📸 *VOTRE IMPRESSION*',
    `• Format : ${format.label} (${format.widthCm} × ${format.heightCm} cm)`,
    `• Papier : 250g archive, encres pigmentaires 12 couleurs`,
    '',
    '🪵 *ENCADREMENT*',
    `• Moulure : ${mouldure.name}`,
    passepartout ? `• Passe-partout : ${passepartout.name} (${config.passepartoutWidthMm}mm)` : '• Passe-partout : Non',
    `• Verre/Protection : ${glass?.name ?? 'Standard'}`,
    `• Finition : ${config.finish}`,
    `• Accrochage : ${hangingLabel(config.hangingType)}`,
    '',
    '💰 *DÉTAIL PRIX*',
    `• Impression + Papier : ${formatFCFA(price.impression)}`,
    `• Moulure bois : ${formatFCFA(price.mouldure)}`,
    price.passepartout > 0 ? `• Passe-partout : ${formatFCFA(price.passepartout)}` : null,
    price.verre > 0 ? `• Protection verre : ${formatFCFA(price.verre)}` : null,
    `• Accrochage : ${formatFCFA(price.accrochage)}`,
    `• Livraison : ${formatFCFA(price.livraison)}`,
    `🟰 *TOTAL : ${formatFCFA(price.total)}*`,
    '',
    '🏠 *LIVRAISON*',
    `• Nom : ${delivery.firstName} ${delivery.lastName}`,
    `• Téléphone : ${delivery.phone}`,
    `• WhatsApp : ${delivery.whatsapp}`,
    `• Ville : ${delivery.city}`,
    `• Quartier : ${delivery.quartier}`,
    `• Adresse : ${delivery.address}`,
    `• Mode : ${deliveryType}`,
    `• Paiement : ${paymentMap[delivery.paymentMethod] ?? delivery.paymentMethod}`,
    '',
    '━━━━━━━━━━━━━━━━━━',
    '🙏 Merci de confirmer disponibilité et délai de fabrication.',
  ];

  return lines.filter((l) => l !== null).join('\n');
}

function hangingLabel(type: string): string {
  switch (type) {
    case 'fil-metallique': return 'Fil métallique';
    case 'oeillet-double': return 'Œillets doubles inox';
    case 'entretoise-acier': return 'Entretoises acier (flottant)';
    default: return type;
  }
}

/** Generates a wa.me deep link with pre-filled message */
export function buildWhatsAppLink(
  phone: string,
  config: FrameConfig,
  delivery: DeliveryInfo,
  price: PriceBreakdown,
): string {
  const message = formatWhatsAppMessage(config, delivery, price);
  const encoded = encodeURIComponent(message);
  // Default business number (replace with actual number in production)
  const businessPhone = phone.startsWith('+') ? phone.replace('+', '') : `225${phone}`;
  return `https://wa.me/${businessPhone}?text=${encoded}`;
}
