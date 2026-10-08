import { create } from 'zustand';
import { getSizeLabel, getFramePrice } from '@/lib/frame-pricing';

export type GlasingType = 'STANDARD' | 'UV_PROTECTIVE' | 'ANTI_REFLECTIVE' | 'MUSEUM_GLASS';

export interface FrameOption {
  id: string;
  name: string;
  material: string;
  color: string;
  widthMm: number;
  heightMm: number;
  depthMm: number;
  priceUsd: number; // kept for fallback display on frames page
  thumbnailUrl: string;
}

export interface ShippingDetails {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  firstName: string;
  lastName: string;
  email: string;
  whatsapp?: string;
}

export type PhotoFilter = 'none' | 'bw' | 'warm' | 'cool' | 'sepia' | 'vintage';
export type PreviewMode = '2D' | 'ROOM' | '3D';
export type RoomTheme = 'living-modern' | 'minimalist-gallery' | 'cozy-wood';

export const SAMPLE_IMAGES = [
  {
    id: 'sample-1',
    label: 'Art Abstrait',
    src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    category: 'Art Contemporain',
  },
  {
    id: 'sample-2',
    label: 'Paysage Brumeux',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: 'Nature',
  },
  {
    id: 'sample-3',
    label: 'Architecture Minimaliste',
    src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    category: 'Design',
  },
  {
    id: 'sample-4',
    label: 'Portrait Noir & Blanc',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    category: 'Portrait',
  },
];

interface FrameState {
  // Image Upload State
  imageSrc: string | null;
  fileName: string | null;
  fileSize: string | null;

  // Visual Enhancement Options
  photoFilter: PhotoFilter;
  mouldingStyle: string; // 'black' | 'champagne' | 'oak' | 'walnut' | 'gold' | 'white'
  roomTheme: RoomTheme;
  previewMode: PreviewMode;
  glassReflection: number; // 0 to 100
  zoom: number;

  // Customization State
  artworkWidthMm: number;
  artworkHeightMm: number;

  // Frame Option
  selectedFrame: FrameOption;

  // Matting State
  hasMat: boolean;
  matColor: string;
  matColorName: string;
  matWidthMm: number;

  // Glasing State
  glasingType: GlasingType;

  // Pricing Details
  quantity: number;

  // Checkout info
  shippingDetails: ShippingDetails | null;

  // Actions
  setImage: (src: string | null, name: string | null, size: string | null) => void;
  setPhotoFilter: (filter: PhotoFilter) => void;
  setMouldingStyle: (style: string) => void;
  setRoomTheme: (theme: RoomTheme) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setGlassReflection: (val: number) => void;
  setZoom: (zoom: number) => void;
  setDimensions: (width: number, height: number) => void;
  setSelectedFrame: (frame: FrameOption) => void;
  setMat: (hasMat: boolean, color?: string, name?: string, width?: number) => void;
  setGlasing: (type: GlasingType) => void;
  setQuantity: (qty: number) => void;
  setShipping: (details: ShippingDetails) => void;
  reset: () => void;

  // Price Calculators
  calculatePrice: () => {
    baseFrame: number;
    matPrice: number;
    glassPrice: number;
    total: number;
    isAvailable: boolean;      // false si la taille n'est pas dispo pour ce cadre
    sizeLabel: string | null;  // ex: 'A3'
  };
}

const DEFAULT_FRAME: FrameOption = {
  id: 'frame-bois',
  name: 'Cadre en Bois',
  material: 'WOOD',
  color: '#8B6914',
  widthMm: 25,
  heightMm: 25,
  depthMm: 12,
  priceUsd: 7000,
  thumbnailUrl: '/frames/bois.webp',
};

export const useFrameStore = create<FrameState>((set, get) => ({
  // Image par défaut pour aperçu immédiat luxueux
  imageSrc: SAMPLE_IMAGES[0]?.src ?? '',
  fileName: 'art-abstrait-demo.jpg',
  fileSize: '1.4 MB',

  // Nouveaux réglages visuels
  photoFilter: 'none',
  mouldingStyle: 'black',
  roomTheme: 'living-modern',
  previewMode: '2D',
  glassReflection: 35,
  zoom: 1,

  // Taille par défaut : A3
  artworkWidthMm: 297,
  artworkHeightMm: 420,

  selectedFrame: DEFAULT_FRAME,

  hasMat: false,
  matColor: '#FAFAF9',
  matColorName: 'Blanc Coton',
  matWidthMm: 30,

  glasingType: 'STANDARD',
  quantity: 1,
  shippingDetails: null,

  setImage: (src, name, size) => set({ imageSrc: src, fileName: name, fileSize: size }),
  setPhotoFilter: (filter) => set({ photoFilter: filter }),
  setMouldingStyle: (style) => set({ mouldingStyle: style }),
  setRoomTheme: (theme) => set({ roomTheme: theme }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setGlassReflection: (val) => set({ glassReflection: val }),
  setZoom: (zoom) => set({ zoom }),

  setDimensions: (width, height) => set({ artworkWidthMm: width, artworkHeightMm: height }),

  setSelectedFrame: (frame) => set({ selectedFrame: frame }),

  setMat: (hasMat, color, name, width) => set((state) => ({
    hasMat,
    matColor: color ?? state.matColor,
    matColorName: name ?? state.matColorName,
    matWidthMm: width ?? state.matWidthMm,
  })),

  setGlasing: (type) => set({ glasingType: type }),

  setQuantity: (qty) => set({ quantity: qty }),

  setShipping: (details) => set({ shippingDetails: details }),

  reset: () => set({
    imageSrc: SAMPLE_IMAGES[0]?.src ?? '',
    fileName: 'art-abstrait-demo.jpg',
    fileSize: '1.4 MB',
    photoFilter: 'none',
    mouldingStyle: 'black',
    roomTheme: 'living-modern',
    previewMode: '2D',
    glassReflection: 35,
    zoom: 1,
    artworkWidthMm: 297,
    artworkHeightMm: 420,
    selectedFrame: DEFAULT_FRAME,
    hasMat: false,
    matColor: '#FAFAF9',
    matColorName: 'Blanc Coton',
    matWidthMm: 30,
    glasingType: 'STANDARD',
    quantity: 1,
    shippingDetails: null,
  }),

  calculatePrice: () => {
    const { artworkWidthMm, artworkHeightMm, selectedFrame, quantity } = get();

    // Détermine le label ISO (A2, A3, A4, A5)
    const sizeLabel = getSizeLabel(artworkWidthMm, artworkHeightMm);

    // Cherche le prix fixe pour ce cadre + cette taille
    const fixedPrice = getFramePrice(selectedFrame.id, sizeLabel);

    const isAvailable = fixedPrice !== null;

    // Prix de base = prix fixe pour cette combinaison, ou 0 si non dispo
    const baseFrame = fixedPrice ?? 0;

    // Passe-partout inclus ou supplément minime si activé
    const matPrice = 0;

    // Verre Standard uniquement = gratuit
    const glassPrice = 0;

    const subtotal = baseFrame + matPrice + glassPrice;
    const total = subtotal * quantity;

    return {
      baseFrame,
      matPrice,
      glassPrice,
      total,
      isAvailable,
      sizeLabel,
    };
  },
}));
