import type { PassepartoutOption, GlassOption } from '@/types/frame';

export const PASSEPARTOUT_OPTIONS: PassepartoutOption[] = [
  {
    id: 'blanc-coton',
    name: 'Blanc Coton',
    colorHex: '#f8f5f0',
    hasWhiteCore: true,
    priceFCFA: 4000,
  },
  {
    id: 'creme',
    name: 'Crème Ivoire',
    colorHex: '#f5f0de',
    hasWhiteCore: true,
    priceFCFA: 4000,
  },
  {
    id: 'noir-graphite',
    name: 'Noir Graphite',
    colorHex: '#1a1a1a',
    hasWhiteCore: true,
    priceFCFA: 4500,
  },
  {
    id: 'gris-ardoise',
    name: 'Gris Ardoise',
    colorHex: '#5a6470',
    hasWhiteCore: true,
    priceFCFA: 4000,
  },
  {
    id: 'bleu-nuit',
    name: 'Bleu Nuit',
    colorHex: '#1e2a4a',
    hasWhiteCore: true,
    priceFCFA: 4500,
  },
  {
    id: 'vert-sauge',
    name: 'Vert Sauge',
    colorHex: '#7d9a7e',
    hasWhiteCore: true,
    priceFCFA: 4500,
  },
  {
    id: 'bordeaux',
    name: 'Bordeaux',
    colorHex: '#6b1f2a',
    hasWhiteCore: true,
    priceFCFA: 4500,
  },
  {
    id: 'kraft-naturel',
    name: 'Kraft Naturel',
    colorHex: '#b5975a',
    hasWhiteCore: false,
    priceFCFA: 3500,
  },
];

export const GLASS_OPTIONS: GlassOption[] = [
  {
    id: 'standard',
    name: 'Verre Standard',
    description: 'Verre minéral 2mm, protection UV basique',
    isFloating: false,
    reflectivity: 0.4,
    priceFCFA: 0,
  },
  {
    id: 'antireflet',
    name: 'Verre Antireflet',
    description: 'Verre minéral traitement antireflet, rendu galerie',
    isFloating: false,
    reflectivity: 0.08,
    priceFCFA: 8000,
  },
  {
    id: 'plexiglas-flottant',
    name: 'Plexiglas Flottant',
    description: 'Acrylique poli au diamant, entretoises inox, effet tableau flottant',
    isFloating: true,
    reflectivity: 0.2,
    priceFCFA: 15000,
  },
];

export const getPassepartoutById = (id: string): PassepartoutOption | undefined =>
  PASSEPARTOUT_OPTIONS.find((p) => p.id === id);

export const getGlassById = (id: string): GlassOption | undefined =>
  GLASS_OPTIONS.find((g) => g.id === id);
