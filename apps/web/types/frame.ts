// ─────────────────────────────────────────────────────────────────────────────
// FrameItUp — Core TypeScript Types
// ─────────────────────────────────────────────────────────────────────────────

export type PrintFormat = 'A5' | 'A4' | 'A3' | 'A2';

export type GlassType = 'standard' | 'antireflet' | 'plexiglas-flottant';

export type FrameFinish = 'mat' | 'brillant' | 'satin';

export type HangingType = 'fil-metallique' | 'oeillet-double' | 'entretoise-acier';

export type PaymentMethod = 'cash-delivery' | 'mtn-momo' | 'orange-money';

export interface FormatSpec {
  id: PrintFormat;
  label: string;
  widthCm: number;
  heightCm: number;
  /** Pixel dimensions for canvas rendering at 1:10 scale */
  widthPx: number;
  heightPx: number;
  priceBase: number; // FCFA
}

export interface MouldureStyle {
  id: string;
  name: string;
  description: string;
  /** CSS gradient string for swatch preview */
  swatchGradient: string;
  /** Primary wood color for SVG rendering */
  colorPrimary: string;
  /** Secondary/shadow color for SVG rendering */
  colorSecondary: string;
  /** Wood grain direction: 'horizontal' | 'vertical' | 'diagonal' */
  grainDirection: 'horizontal' | 'vertical' | 'diagonal';
  widthMm: number; // moulure width
  depthMm: number; // frame depth
  priceMultiplier: number;
  isWood: boolean;
  category: 'naturel' | 'laque' | 'metal' | 'africain';
}

export interface PassepartoutOption {
  id: string;
  name: string;
  colorHex: string;
  /** Is the core (bevel edge) white? */
  hasWhiteCore: boolean;
  priceFCFA: number;
}

export interface GlassOption {
  id: GlassType;
  name: string;
  description: string;
  /** Is floating mount (spacers)? */
  isFloating: boolean;
  /** Reflectivity 0-1 for rendering */
  reflectivity: number;
  priceFCFA: number;
}

export interface SampleArtwork {
  id: string;
  title: string;
  artist: string;
  style: string;
  /** URL to artwork image */
  imageUrl: string;
  /** Recommended format for this artwork */
  recommendedFormat: PrintFormat;
  /** Recommended moulure id */
  recommendedMouldure: string;
}

export interface FrameConfig {
  /** User-uploaded image URL (blob URL or external) */
  imageUrl: string | null;
  imageFile: File | null;
  format: PrintFormat;
  mouldureId: string;
  /** Passepartout color id, or null if no passepartout */
  passepartoutId: string | null;
  /** Passepartout width in mm (0 = none) */
  passepartoutWidthMm: number;
  glassType: GlassType;
  finish: FrameFinish;
  hangingType: HangingType;
  /** Glass reflet intensity 0-1 */
  glassReflectIntensity: number;
}

export interface PriceBreakdown {
  impression: number;
  mouldure: number;
  passepartout: number;
  verre: number;
  accrochage: number;
  subtotal: number;
  livraison: number;
  total: number;
}

export interface DeliveryInfo {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  whatsapp: string;
  city: string;
  quartier: string;
  address: string;
  deliveryType: 'standard' | 'express';
  paymentMethod: PaymentMethod;
}

export interface CityOption {
  id: string;
  name: string;
  country: string;
  quartiers: string[];
  deliveryStandard: number; // FCFA
  deliveryExpress: number; // FCFA
  daysStandard: number;
  daysExpress: number;
}

export interface OrderSummary {
  orderId: string;
  config: FrameConfig;
  delivery: DeliveryInfo;
  price: PriceBreakdown;
  createdAt: Date;
}

export type RoomScene = 'salon-scandinave' | 'galerie-art' | 'bureau-chene';

export type ConfiguratorTab = 'studio' | 'room-view' | 'orbit-3d';
