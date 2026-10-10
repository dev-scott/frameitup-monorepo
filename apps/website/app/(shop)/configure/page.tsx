'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getSeedFrames } from '@/app/actions';
import {
  useFrameStore,
  FrameOption,
  SAMPLE_IMAGES,
  PhotoFilter,
  PreviewMode,
} from '@/store/use-frame-store';
import { getAvailableSizes, getFramePrice, getSizeLabel, ISO_SIZES } from '@/lib/frame-pricing';
import FrameRenderer, { FrameMaterial } from '@/components/configure/FrameRenderer';
import RoomPreview from '@/components/configure/RoomPreview';
import FramePreview3D from '@/components/configure/frame-preview-3d';
import { Button } from '@frameitup/ui';
import { useLanguageStore } from '@/store/use-language-store';

// Fallback frames if DB seed not yet loaded
const FALLBACK_FRAMES: FrameOption[] = [
  {
    id: 'frame-bois',
    name: 'Panneau Bois Massif',
    material: 'WOOD',
    color: '#8B6914',
    widthMm: 25,
    heightMm: 25,
    depthMm: 12,
    priceUsd: 7000,
    thumbnailUrl: '/frames/bois.webp',
  },
  {
    id: 'frame-plexiglas',
    name: 'Plexiglas Galerie Flottant',
    material: 'ACRYLIC',
    color: '#2C2016',
    widthMm: 20,
    heightMm: 20,
    depthMm: 5,
    priceUsd: 10000,
    thumbnailUrl: '/frames/plexiglas.webp',
  },
  {
    id: 'frame-vitre',
    name: 'Cadre Vitré Galerie',
    material: 'GLASS',
    color: '#1C1917',
    widthMm: 28,
    heightMm: 28,
    depthMm: 16,
    priceUsd: 7000,
    thumbnailUrl: '/frames/vitre.webp',
  },
];

const PRESET_SIZES = [
  { label: 'A2', name: 'Grand Format (42 × 60 cm)', w: 420, h: 594, ideal: 'Salon, séjour, pièce maîtresse' },
  { label: 'A3', name: 'Format Moyen (30 × 42 cm)', w: 297, h: 420, ideal: 'Chambre, bureau, entrée' },
  { label: 'A4', name: 'Format Standard (21 × 30 cm)', w: 210, h: 297, ideal: 'Étagère, bureau, galerie murale' },
  { label: 'A5', name: 'Petit Format (15 × 21 cm)', w: 148, h: 210, ideal: 'Table de chevet, console intime' },
];

const MAT_COLORS = [
  { id: 'white', name: 'Blanc Coton', hex: '#FAFAF9', desc: 'Finition galerie lumineuse' },
  { id: 'cream', name: 'Crème Douce', hex: '#F5EFEB', desc: 'Chaleureux & intemporel' },
  { id: 'black', name: 'Noir Charbon', hex: '#292524', desc: 'Contraste et intensité' },
  { id: 'green', name: 'Vert Forêt', hex: '#1C3F3A', desc: 'Teinte organique noble' },
];

const MOULDING_COLORS = [
  { id: 'black', name: 'Noir Galerie', hex: '#18181b', ring: 'ring-zinc-800' },
  { id: 'oak', name: 'Chêne Clair', hex: '#cf9e66', ring: 'ring-amber-700' },
  { id: 'walnut', name: 'Noyer Royal', hex: '#4a2810', ring: 'ring-amber-950' },
  { id: 'champagne', name: 'Or / Champagne', hex: '#d5af36', ring: 'ring-amber-400' },
  { id: 'white', name: 'Blanc Pur', hex: '#f4f4f5', ring: 'ring-zinc-300' },
];

const FILTERS: { id: PhotoFilter; label: string; previewClass: string }[] = [
  { id: 'none', label: 'Original', previewClass: '' },
  { id: 'bw', label: 'N&B Galerie', previewClass: 'grayscale contrast-125' },
  { id: 'warm', label: 'Chaud Doré', previewClass: 'sepia-[0.25] saturate-125' },
  { id: 'vintage', label: 'Rétro Vintage', previewClass: 'sepia-[0.18] contrast-110 saturate-90' },
  { id: 'cool', label: 'Bleu Ardoise', previewClass: 'hue-rotate-[185deg] saturate-110' },
];

export default function ConfigurePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, language } = useLanguageStore();

  const {
    imageSrc,
    fileName,
    artworkWidthMm,
    artworkHeightMm,
    selectedFrame,
    hasMat,
    matColor,
    matColorName,
    matWidthMm,
    photoFilter,
    mouldingStyle,
    previewMode,
    glassReflection,
    quantity,
    setImage,
    setDimensions,
    setSelectedFrame,
    setMat,
    setPhotoFilter,
    setMouldingStyle,
    setPreviewMode,
    setGlassReflection,
    setQuantity,
    calculatePrice,
  } = useFrameStore();

  const [frames, setFrames] = useState<FrameOption[]>(FALLBACK_FRAMES);
  const [activeTab, setActiveTab] = useState<'photo' | 'frame' | 'size' | 'mat'>('photo');
  const [uploading, setUploading] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

  // Charger les cadres depuis le serveur / fallback
  useEffect(() => {
    async function load() {
      try {
        const data = await getSeedFrames();
        if (data && data.length > 0) {
          setFrames(data as FrameOption[]);
        }
      } catch (_e) {
        setFrames(FALLBACK_FRAMES);
      }
    }
    load();
  }, []);

  // Calcul du prix
  const priceData = calculatePrice();
  const currentSizeLabel = getSizeLabel(artworkWidthMm, artworkHeightMm) ?? 'A3';
  const availableSizes = getAvailableSizes(selectedFrame.id);

  // Mappeur de matériau
  const currentMaterial: FrameMaterial =
    selectedFrame.id === 'frame-plexiglas'
      ? 'plexiglas'
      : selectedFrame.id === 'frame-vitre'
      ? 'vitre'
      : 'bois';

  // Gestion du téléversement d'image
  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      setImage(result, file.name, sizeMB);

      // Détecter l'orientation de l'image
      const img = new Image();
      img.onload = () => {
        if (img.width > img.height && !isLandscape) {
          setIsLandscape(true);
          setDimensions(artworkHeightMm, artworkWidthMm);
        } else if (img.height >= img.width && isLandscape) {
          setIsLandscape(false);
          setDimensions(artworkHeightMm, artworkWidthMm);
        }
        setUploading(false);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Bascule Portrait / Paysage
  const toggleOrientation = () => {
    const nextLandscape = !isLandscape;
    setIsLandscape(nextLandscape);
    setDimensions(artworkHeightMm, artworkWidthMm);
  };

  // Sélection du format ISO
  const handleSizeSelect = (w: number, h: number) => {
    if (isLandscape) {
      setDimensions(Math.max(w, h), Math.min(w, h));
    } else {
      setDimensions(Math.min(w, h), Math.max(w, h));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-28">
      {/* ── BARRE SUPÉRIEURE DE NAVIGATION ET APERÇU ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] mb-1">
              <span className="hover:text-[var(--brand-500)] cursor-pointer" onClick={() => router.push('/')}>Accueil</span>
              <span>/</span>
              <span className="text-[var(--text-primary)] font-semibold">Studio de Personnalisation</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Concevez Votre Cadre Sur-Mesure
            </h1>
          </div>

          {/* Sélecteur de mode de vue (2.5D Studio, Room View, 3D Orbit) */}
          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-[var(--border)] shadow-sm">
            <button
              type="button"
              onClick={() => setPreviewMode('2D')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                previewMode === '2D'
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>🖼️</span>
              <span>Studio HD</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('ROOM')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                previewMode === 'ROOM'
                  ? 'bg-[var(--brand-500)] text-white shadow-brand'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>🛋️</span>
              <span>Mise en situation murale</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('3D')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                previewMode === '3D'
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>🌐</span>
              <span>3D Orbit</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── CONTENU PRINCIPAL : 2 COLONNES (SCÈNE DE RENDU / CONFIGURATEUR) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ══════════ COLONNE GAUCHE (7 COLONNES) : SCÈNE DE RENDU HAUTE FIDÉLITÉ ══════════ */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
            
            {/* Boîte de rendu principale */}
            <div className="relative rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border)] p-4 md:p-8 min-h-[520px] md:min-h-[620px] flex items-center justify-center overflow-hidden shadow-inner">
              
              {/* Fond dégradé studio subtil */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.6)_0%,rgba(0,0,0,0.04)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

              {/* 1. Mode Studio 2.5D */}
              {previewMode === '2D' && (
                <div className="relative z-10 flex flex-col items-center justify-center p-4">
                  <FrameRenderer
                    imageSrc={imageSrc || (SAMPLE_IMAGES[0]?.src ?? '')}
                    material={currentMaterial}
                    artWidth={isLandscape ? 380 : 280}
                    artHeight={isLandscape ? 280 : 380}
                    photoFilter={photoFilter}
                    mouldingStyle={mouldingStyle}
                    hasMat={hasMat}
                    matColor={matColor}
                    matWidth={matWidthMm}
                    glassReflection={glassReflection}
                  />
                  
                  {/* Légende du format affiché */}
                  <div className="mt-6 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[var(--brand-500)] animate-pulse" />
                      Format {currentSizeLabel} ({artworkWidthMm} × {artworkHeightMm} mm)
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-medium">
                      {isLandscape ? 'Format Paysage' : 'Format Portrait'}
                    </span>
                  </div>
                </div>
              )}

              {/* 2. Mode Décor Mural (Room Preview) */}
              {previewMode === 'ROOM' && (
                <div className="w-full relative z-10">
                  <RoomPreview
                    imageSrc={imageSrc || (SAMPLE_IMAGES[0]?.src ?? '')}
                    material={currentMaterial}
                    sizeLabel={currentSizeLabel}
                    photoFilter={photoFilter}
                    mouldingStyle={mouldingStyle}
                    hasMat={hasMat}
                    matColor={matColor}
                    matWidth={matWidthMm}
                    glassReflection={glassReflection}
                  />
                </div>
              )}

              {/* 3. Mode 3D Orbit */}
              {previewMode === '3D' && (
                <div className="w-full h-[520px] md:h-[600px] relative z-10">
                  <FramePreview3D
                    imageSrc={imageSrc || (SAMPLE_IMAGES[0]?.src ?? '')}
                    frameColor={selectedFrame.color}
                    frameWidthMm={selectedFrame.widthMm}
                    frameThicknessMm={selectedFrame.depthMm}
                    artworkWidthMm={artworkWidthMm}
                    artworkHeightMm={artworkHeightMm}
                    hasMat={hasMat}
                    matColor={matColor}
                    matWidthMm={matWidthMm}
                    glasingType={useFrameStore.getState().glasingType}
                    frameId={selectedFrame.id}
                  />
                  <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
                    <span className="inline-block px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-md">
                      Faites glisser pour faire pivoter le cadre à 360°
                    </span>
                  </div>
                </div>
              )}

              {/* Outils d'ambiance flottants (Reflet de vitre & orientation) */}
              {previewMode === '2D' && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[var(--bg-card)]/90 backdrop-blur-md p-2 rounded-2xl border border-[var(--border)] shadow-md">
                  <button
                    type="button"
                    onClick={toggleOrientation}
                    title="Basculer Portrait / Paysage"
                    className="p-2 rounded-xl text-xs font-semibold bg-[var(--bg-secondary)] hover:bg-[var(--brand-500)] hover:text-white transition-colors"
                  >
                    🔄 Pivoter
                  </button>
                  {currentMaterial !== 'bois' && (
                    <div className="flex items-center gap-1.5 px-2 text-xs font-medium text-[var(--text-muted)]">
                      <span>✨ Reflet:</span>
                      <input
                        type="range"
                        min="5"
                        max="85"
                        value={glassReflection}
                        onChange={(e) => setGlassReflection(Number(e.target.value))}
                        className="w-16 accent-[var(--brand-500)] cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Badge de réassurance qualité photo */}
            <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">
                    Contrôle de Résolution Artisanal
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Votre image sera imprimée sur papier d'art 250g avec encres pigmentaires 12 couleurs.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold whitespace-nowrap">
                300 DPI Optimale
              </span>
            </div>
          </div>

          {/* ══════════ COLONNE DROITE (5 COLONNES) : ÉTAPES DU CONFIGURATEUR ══════════ */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Onglets de configuration */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setActiveTab('photo')}
                className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'photo'
                    ? 'bg-[var(--bg-card)] text-[var(--brand-500)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                1. Photo
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('frame')}
                className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'frame'
                    ? 'bg-[var(--bg-card)] text-[var(--brand-500)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                2. Cadre
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('size')}
                className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'size'
                    ? 'bg-[var(--bg-card)] text-[var(--brand-500)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                3. Format
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('mat')}
                className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'mat'
                    ? 'bg-[var(--bg-card)] text-[var(--brand-500)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                4. Finition
              </button>
            </div>

            {/* CONTENU SELON L'ONGLET SÉLECTIONNÉ */}
            <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm space-y-6">
              
              {/* ── ÉTAPE 1 : PHOTO & RETOUCHES ── */}
              {activeTab === 'photo' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-1">
                      Votre Image
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Téléversez votre photo personnelle ou essayez nos modèles artistiques.
                    </p>
                  </div>

                  {/* Zone de téléversement Drag & Drop */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center ${
                      dragOver
                        ? 'border-[var(--brand-500)] bg-[var(--brand-50)]/50'
                        : 'border-[var(--border)] hover:border-[var(--brand-400)] bg-[var(--bg-secondary)]/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    />
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[var(--brand-100)] dark:bg-[var(--brand-900)]/30 text-[var(--brand-500)] flex items-center justify-center text-xl">
                      📷
                    </div>
                    <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                      {uploading ? 'Chargement en cours...' : 'Glissez votre photo ici ou cliquez pour parcourir'}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      JPG, PNG, WebP acceptés (résolution recommandée : 2000px+)
                    </p>
                  </div>

                  {/* Photos d'exemple prêtes à l'emploi */}
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                      Ou essayez un exemple artistique :
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {SAMPLE_IMAGES.map((sample) => (
                        <button
                          key={sample.id}
                          type="button"
                          onClick={() => setImage(sample.src, sample.label, '1.2 MB')}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            imageSrc === sample.src
                              ? 'border-[var(--brand-500)] ring-2 ring-[var(--brand-500)]/30 scale-105'
                              : 'border-transparent hover:opacity-85'
                          }`}
                        >
                          <img
                            src={sample.src}
                            alt={sample.label}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-1.5">
                            <span className="text-[10px] text-white font-medium truncate">
                              {sample.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filtres photographiques */}
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                      Filtre photo & ambiance :
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {FILTERS.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setPhotoFilter(f.id)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all ${
                            photoFilter === f.id
                              ? 'border-[var(--brand-500)] bg-[var(--brand-50)]/30 dark:bg-[var(--brand-950)]/40 font-bold text-[var(--brand-500)]'
                              : 'border-[var(--border)] hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg overflow-hidden border border-black/10 ${f.previewClass}`}>
                            <img src={imageSrc || (SAMPLE_IMAGES[0]?.src ?? '')} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[11px] truncate w-full">{f.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── ÉTAPE 2 : MODÈLE DE CADRE & FINITION ── */}
              {activeTab === 'frame' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-1">
                      Gamme & Finition du Cadre
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Choisissez le style d'encadrement qui sublimera votre pièce.
                    </p>
                  </div>

                  {/* Liste des 3 finitions */}
                  <div className="space-y-3">
                    {frames.map((frame) => {
                      const isSelected = selectedFrame.id === frame.id;
                      return (
                        <div
                          key={frame.id}
                          onClick={() => setSelectedFrame(frame)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                            isSelected
                              ? 'border-[var(--brand-500)] bg-[var(--brand-50)]/20 dark:bg-[var(--brand-950)]/30 shadow-sm'
                              : 'border-[var(--border)] hover:border-[var(--brand-300)] bg-[var(--bg-card)]'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-[var(--bg-secondary)] border border-[var(--border)] shrink-0">
                            {frame.id === 'frame-bois' ? '🪵' : frame.id === 'frame-plexiglas' ? '✨' : '🖼️'}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-display text-sm font-bold text-[var(--text-primary)]">
                                {frame.name}
                              </h4>
                              <span className="text-xs font-bold text-[var(--brand-500)]">
                                dès {getFramePrice(frame.id, 'A4') || getFramePrice(frame.id, 'A5')} FCFA
                              </span>
                            </div>

                            <p className="text-xs text-[var(--text-muted)] mt-1">
                              {frame.id === 'frame-bois' && 'Châssis en bois noble avec chants biseautés chaleureux. Sans vitre, rendu direct authentique.'}
                              {frame.id === 'frame-plexiglas' && 'Verre acrylique 4mm ultra-brillant avec entretoises murales en inox. Effet flottant contemporain.'}
                              {frame.id === 'frame-vitre' && 'Moulure galerie soignée avec verre protecteur antireflet. Le grand classique des galeries d\'art.'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Teinte de la moulure (uniquement pour Cadre Vitré) */}
                  {selectedFrame.id === 'frame-vitre' && (
                    <div className="pt-2 border-t border-[var(--border)]">
                      <p className="text-xs font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wider">
                        Couleur de la moulure :
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {MOULDING_COLORS.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setMouldingStyle(m.id)}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all ${
                              mouldingStyle === m.id
                                ? 'border-[var(--brand-500)] bg-[var(--brand-50)]/40 dark:bg-[var(--brand-950)]/40 shadow-sm'
                                : 'border-[var(--border)] hover:bg-[var(--bg-secondary)]'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full border border-black/20 ${m.ring} shadow-inner`}
                              style={{ backgroundColor: m.hex }}
                            />
                            <span className="text-[10px] font-medium text-[var(--text-secondary)] truncate w-full">
                              {m.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── ÉTAPE 3 : FORMAT & DIMENSIONS ── */}
              {activeTab === 'size' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-1">
                      Format & Dimensions
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Choisissez la taille idéale pour votre espace mural.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {PRESET_SIZES.map((size) => {
                      const isAvailable = availableSizes.includes(size.label);
                      const isSelected = currentSizeLabel === size.label;
                      const price = getFramePrice(selectedFrame.id, size.label);

                      return (
                        <div
                          key={size.label}
                          onClick={() => isAvailable && handleSizeSelect(size.w, size.h)}
                          className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[var(--brand-500)] bg-[var(--brand-50)]/20 dark:bg-[var(--brand-950)]/30 shadow-sm'
                              : isAvailable
                              ? 'border-[var(--border)] hover:border-[var(--brand-300)] cursor-pointer'
                              : 'opacity-40 border-[var(--border)] cursor-not-allowed bg-[var(--bg-secondary)]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center font-bold text-sm text-[var(--text-primary)]">
                              {size.label}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-[var(--text-primary)]">
                                {size.name}
                              </h4>
                              <p className="text-xs text-[var(--text-muted)]">
                                {size.ideal}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            {isAvailable && price ? (
                              <span className="text-sm font-bold text-[var(--brand-500)]">
                                {price.toLocaleString()} FCFA
                              </span>
                            ) : (
                              <span className="text-xs text-[var(--text-muted)] font-medium">
                                Non disponible
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── ÉTAPE 4 : PASSE-PARTOUT & VERRE ── */}
              {activeTab === 'mat' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-1">
                      Passe-Partout (Marie-Louise)
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Ajoutez une bordure cartonnée biseautée pour donner une profondeur de galerie d'art.
                    </p>
                  </div>

                  {/* Interrupteur Passe-Partout */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        Activer le Passe-Partout
                      </h4>
                      <p className="text-xs text-[var(--text-muted)]">
                        Biseau à 45° coupe cœur blanc
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMat(!hasMat)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        hasMat ? 'bg-[var(--brand-500)]' : 'bg-zinc-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          hasMat ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Couleurs du passe-partout */}
                  {hasMat && (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                        Couleur du carton musée :
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {MAT_COLORS.map((mat) => (
                          <div
                            key={mat.id}
                            onClick={() => setMat(true, mat.hex, mat.name)}
                            className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                              matColor === mat.hex
                                ? 'border-[var(--brand-500)] bg-[var(--brand-50)]/30 dark:bg-[var(--brand-950)]/30 ring-1 ring-[var(--brand-500)]'
                                : 'border-[var(--border)] hover:bg-[var(--bg-secondary)]'
                            }`}
                          >
                            <span
                              className="w-6 h-6 rounded-full border border-black/20 shadow-sm shrink-0"
                              style={{ backgroundColor: mat.hex }}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                                {mat.name}
                              </p>
                              <p className="text-[10px] text-[var(--text-muted)] truncate">
                                {mat.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── BARRE DE COMMANDE & TOTAL EN FCFA (STICKY) ── */}
            <div className="p-6 rounded-3xl bg-[var(--bg-card)] border-2 border-[var(--brand-500)]/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Total de la création
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-extrabold text-[var(--text-primary)]">
                      {priceData.total.toLocaleString()} FCFA
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold">TTC</span>
                  </div>
                </div>

                {/* Sélecteur de quantité */}
                <div className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-[var(--bg-card)] flex items-center justify-center font-bold text-sm text-[var(--text-primary)] hover:bg-[var(--brand-500)] hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-[var(--text-primary)]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-[var(--bg-card)] flex items-center justify-center font-bold text-sm text-[var(--text-primary)] hover:bg-[var(--brand-500)] hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Récapitulatif technique rapide */}
              <div className="text-xs text-[var(--text-muted)] space-y-1 border-t border-[var(--border)] pt-3">
                <div className="flex justify-between">
                  <span>Modèle sélectionné :</span>
                  <span className="font-semibold text-[var(--text-primary)]">{selectedFrame.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Format :</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {currentSizeLabel} ({artworkWidthMm} × {artworkHeightMm} mm)
                  </span>
                </div>
                {hasMat && (
                  <div className="flex justify-between">
                    <span>Passe-Partout :</span>
                    <span className="font-semibold text-[var(--text-primary)]">{matColorName}</span>
                  </div>
                )}
              </div>

              {/* Bouton de finalisation vers Checkout */}
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center text-base py-4 font-bold shadow-brand hover:scale-[1.01] transition-transform"
                onClick={() => router.push('/checkout')}
              >
                Commander ce Cadre →
              </Button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-[var(--text-muted)] font-medium pt-1">
                <span>🚚 Livraison Douala & Yaoundé 48h</span>
                <span>•</span>
                <span>💵 Paiement à la livraison accepté</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
