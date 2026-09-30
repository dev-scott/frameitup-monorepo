import type { FrameConfig, PriceBreakdown } from '@/types/frame';
import { getFormatById } from '@/data/formats';
import { getMouldureById } from '@/data/frames';
import { getPassepartoutById, getGlassById } from '@/data/materials';

/** Perimeter of a format in cm */
function perimeterCm(widthCm: number, heightCm: number): number {
  return 2 * (widthCm + heightCm);
}

/** Price per cm of moulure based on width */
function mouldurePricePerCm(widthMm: number): number {
  if (widthMm <= 25) return 200;
  if (widthMm <= 40) return 350;
  if (widthMm <= 55) return 500;
  return 700;
}

export function calculatePrice(
  config: FrameConfig,
  livraisonFCFA: number = 2000,
): PriceBreakdown {
  const format = getFormatById(config.format);
  const mouldure = getMouldureById(config.mouldureId);
  const passepartout = config.passepartoutId
    ? getPassepartoutById(config.passepartoutId)
    : undefined;
  const glass = getGlassById(config.glassType);

  // Impression (base format price × multiplier for paper quality)
  const impression = Math.round(format.priceBase * 1.0);

  // Moulure (perimeter × price-per-cm × multiplier)
  const ppm = perimeterCm(format.widthCm, format.heightCm);
  const mouldureBase = Math.round(
    ppm * mouldurePricePerCm(mouldure.widthMm) * mouldure.priceMultiplier,
  );

  // Passepartout
  const passepartoutPrice =
    config.passepartoutId && passepartout ? passepartout.priceFCFA : 0;

  // Verre / Plexiglas
  const verrePrice = glass?.priceFCFA ?? 0;

  // Accrochage
  let accrochagePrice = 0;
  switch (config.hangingType) {
    case 'fil-metallique':
      accrochagePrice = 1000;
      break;
    case 'oeillet-double':
      accrochagePrice = 1500;
      break;
    case 'entretoise-acier':
      accrochagePrice = 3000;
      break;
  }

  const subtotal = impression + mouldureBase + passepartoutPrice + verrePrice + accrochagePrice;

  return {
    impression,
    mouldure: mouldureBase,
    passepartout: passepartoutPrice,
    verre: verrePrice,
    accrochage: accrochagePrice,
    subtotal,
    livraison: livraisonFCFA,
    total: subtotal + livraisonFCFA,
  };
}

/** Format a FCFA number with space thousands separator */
export function formatFCFA(amount: number): string {
  return amount.toLocaleString('fr-FR') + ' FCFA';
}
