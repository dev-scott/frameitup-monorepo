/**
 * SVG/Canvas rendering utilities for the 2.5D frame studio preview.
 * All functions are pure and run on the client.
 */

export interface FrameRenderConfig {
  // Canvas dimensions
  canvasWidth: number;
  canvasHeight: number;
  // Artwork area (inner image)
  imageX: number;
  imageY: number;
  imageW: number;
  imageH: number;
  // Passepartout
  ppWidthPx: number;
  ppColorHex: string;
  hasWhiteCore: boolean;
  // Moulure
  mouldureWidthPx: number;
  mouldureColorPrimary: string;
  mouldureColorSecondary: string;
  mouldureIsWood: boolean;
  grainDirection: 'horizontal' | 'vertical' | 'diagonal';
  // Glass
  glassReflectIntensity: number;
  isFloating: boolean;
}

/** Build the 4 trapezoid corner paths for miter cuts */
export function buildMiterPaths(
  outerX: number, outerY: number,
  outerW: number, outerH: number,
  innerX: number, innerY: number,
  innerW: number, innerH: number,
): {
  top: string; bottom: string; left: string; right: string;
} {
  const ox1 = outerX, oy1 = outerY, ox2 = outerX + outerW, oy2 = outerY + outerH;
  const ix1 = innerX, iy1 = innerY, ix2 = innerX + innerW, iy2 = innerY + innerH;

  return {
    top: `M${ox1},${oy1} L${ox2},${oy1} L${ix2},${iy1} L${ix1},${iy1} Z`,
    bottom: `M${ox1},${oy2} L${ox2},${oy2} L${ix2},${iy2} L${ix1},${iy2} Z`,
    left: `M${ox1},${oy1} L${ox1},${oy2} L${ix1},${iy2} L${ix1},${iy1} Z`,
    right: `M${ox2},${oy1} L${ox2},${oy2} L${ix2},${iy2} L${ix2},${iy1} Z`,
  };
}

/** Build the passepartout bevel paths (45° inner edge reveal) */
export function buildBevelPaths(
  ppX: number, ppY: number, ppW: number, ppH: number,
  bevel: number,
): {
  top: string; bottom: string; left: string; right: string;
} {
  const x2 = ppX + ppW, y2 = ppY + ppH;
  const ix1 = ppX + bevel, iy1 = ppY + bevel;
  const ix2 = x2 - bevel, iy2 = y2 - bevel;

  return {
    top: `M${ppX},${ppY} L${x2},${ppY} L${ix2},${iy1} L${ix1},${iy1} Z`,
    bottom: `M${ppX},${y2} L${x2},${y2} L${ix2},${iy2} L${ix1},${iy2} Z`,
    left: `M${ppX},${ppY} L${ppX},${y2} L${ix1},${iy2} L${ix1},${iy1} Z`,
    right: `M${x2},${ppY} L${x2},${y2} L${ix2},${iy2} L${ix2},${iy1} Z`,
  };
}

/** Lightens a hex color by amount (0-1) */
export function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * amount));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * amount));
  const b = Math.min(255, (num & 0xff) + Math.round(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Darkens a hex color by amount (0-1) */
export function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (num & 0xff) - Math.round(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
