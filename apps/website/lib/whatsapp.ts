// ─── WhatsApp Configuration ────────────────────────────────────────
// Change this number to your actual WhatsApp business number.
// Format: international without the + sign (e.g., 237690000000 for Cameroon)
export const WHATSAPP_NUMBER = '237689502147';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/**
 * Build a WhatsApp URL with a pre-filled message.
 */
export function buildWhatsAppUrl(message: string): string {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

/**
 * WhatsApp message templates
 */
export const WA_MESSAGES = {
  orderConfirm: (trackingNumber: string, total: string) =>
    `Bonjour FrameItUp 👋\n\nJe viens de passer une commande sur votre site.\n\n📦 Numéro de suivi: *${trackingNumber}*\n💰 Montant: *${total} FCFA*\n\nPouvez-vous me confirmer la prise en charge ? Merci !`,

  customQuote: () =>
    `Bonjour FrameItUp 👋\n\nJ'aimerais avoir un devis pour un cadre personnalisé. Pouvez-vous m'aider ?`,

  pricing: () =>
    `Bonjour FrameItUp 👋\n\nJ'aimerais discuter des tarifs et options disponibles pour un cadre. Merci !`,
};
