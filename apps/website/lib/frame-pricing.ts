// ─── Prix fixes par type de cadre et format ────────────────────────
// Clés: frameId → { format: prix en FCFA }
// Les formats sans prix pour un type sont simplement absents (non disponibles).

export const FRAME_SIZE_PRICES: Record<string, Record<string, number>> = {
  'frame-bois': {
    'A2': 10000,
    'A3': 7000,
    'A4': 5000,
  },
  'frame-plexiglas': {
    'A2': 16000,
    'A3': 10000,
    'A4': 7000,
  },
  'frame-vitre': {
    'A3': 7000,
    'A4': 5000,
    'A5': 3500,
  },
};

/**
 * Dimensions ISO standard en mm (largeur × hauteur portrait)
 */
export const ISO_SIZES: Record<string, { w: number; h: number }> = {
  'A2': { w: 420, h: 594 },
  'A3': { w: 297, h: 420 },
  'A4': { w: 210, h: 297 },
  'A5': { w: 148, h: 210 },
};

/**
 * Retourne le label du format ISO qui correspond aux dimensions données,
 * ou null si aucun format ne correspond exactement.
 */
export function getSizeLabel(widthMm: number, heightMm: number): string | null {
  for (const [label, dims] of Object.entries(ISO_SIZES)) {
    if (
      (dims.w === widthMm && dims.h === heightMm) ||
      (dims.h === widthMm && dims.w === heightMm) // paysage accepté
    ) {
      return label;
    }
  }
  return null;
}

/**
 * Retourne le prix fixe pour un frame + taille donnés.
 * Retourne null si la combinaison n'est pas disponible.
 */
export function getFramePrice(frameId: string, sizeLabel: string | null): number | null {
  if (!sizeLabel) return null;
  return FRAME_SIZE_PRICES[frameId]?.[sizeLabel] ?? null;
}

/**
 * Retourne les formats disponibles pour un frame donné.
 */
export function getAvailableSizes(frameId: string): string[] {
  return Object.keys(FRAME_SIZE_PRICES[frameId] ?? {});
}
