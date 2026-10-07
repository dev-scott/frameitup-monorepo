'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useFrameStore } from '@/store/use-frame-store';
import { useRouter } from 'next/navigation';

interface MaterialOption {
  id: 'frame-bois' | 'frame-plexiglas' | 'frame-vitre';
  name: string;
  tagline: string;
  badge: string;
  startingPrice: string;
  materialProp: 'bois' | 'plexiglas' | 'vitre';
  description: string;
  specs: { label: string; value: string }[];
  highlightColor: string;
  sampleImg: string;
}

const MATERIALS: MaterialOption[] = [
  {
    id: 'frame-bois',
    name: 'Panneau Bois Massif',
    tagline: 'L\'authenticité noble de la matière brute',
    badge: 'Coup de Cœur',
    startingPrice: '5 000 FCFA',
    materialProp: 'bois',
    description:
      'Tirage d\'art contrecollé sur panneau de bois rigide aux tranches biseautées et texturées. Sans verre protecteur, il offre un contact visuel direct et chaleureux sans aucun reflet parasite.',
    specs: [
      { label: 'Support', value: 'Châssis rigide haute densité' },
      { label: 'Finition', value: 'Tranches biseautées chêne naturel' },
      { label: 'Surface', value: 'Papier fine art mat antireflet' },
      { label: 'Fixation', value: 'Crochet acier invisible fourni' },
    ],
    highlightColor: '#8B6914',
    sampleImg: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'frame-plexiglas',
    name: 'Plexiglas Galerie Flottant',
    tagline: 'L\'éclat miroir et la profondeur contemporaine',
    badge: 'Moderne & Design',
    startingPrice: '7 000 FCFA',
    materialProp: 'plexiglas',
    description:
      'Impression fine art sous verre acrylique cristal 4mm avec chants polis au diamant. Fixé au mur par 4 entretoises en acier inoxydable brossé, le tableau semble léviter à 2 cm du mur.',
    specs: [
      { label: 'Épaisseur', value: 'Acrylique pur 4 mm qualité galerie' },
      { label: 'Finition', value: 'Chants polis au diamant, brillance HD' },
      { label: 'Fixation', value: '4 entretoises inox brossé incluses' },
      { label: 'Effet', value: 'Lévitation murale 3D saisissante' },
    ],
    highlightColor: '#3b82f6',
    sampleImg: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'frame-vitre',
    name: 'Cadre Vitré Musée',
    tagline: 'L\'élégance intemporelle des grandes galeries',
    badge: 'Classique Intemporel',
    startingPrice: '3 500 FCFA',
    materialProp: 'vitre',
    description:
      'Moulure ouvragée de haute précision, assemblée à onglets 45°. Protégé par un verre minéral d\'une clarté optique remarquable et sublimé par un passe-partout biseauté en carton d\'archivage.',
    specs: [
      { label: 'Moulure', value: 'Bois laqué noir, chêne clair ou or brossé' },
      { label: 'Protection', value: 'Verre minéral haute transmission UV' },
      { label: 'Passe-Partout', value: 'Carton musée 1.5 mm biseau blanc 45°' },
      { label: 'Finition', value: 'Fermeture hermétique antipoussière' },
    ],
    highlightColor: '#d97706',
    sampleImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
  },
];

export function MaterialShowcaseSection() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>('frame-bois');
  const setSelectedFrame = useFrameStore((state) => state.setSelectedFrame);

  const activeMat: MaterialOption = MATERIALS.find((m) => m.id === selectedId) ?? MATERIALS[0]!;

  const handleConfigureMaterial = (mat: MaterialOption) => {
    setSelectedFrame({
      id: mat.id,
      name: mat.name,
      material: mat.materialProp === 'bois' ? 'WOOD' : mat.materialProp === 'plexiglas' ? 'ACRYLIC' : 'GLASS',
      color: mat.highlightColor,
      widthMm: 25,
      heightMm: 25,
      depthMm: 14,
      priceUsd: 7000,
      thumbnailUrl: `/frames/${mat.materialProp}.webp`,
    });
    router.push('/configure');
  };

  return (
    <section id="finitions" className="py-24 bg-[var(--bg-secondary)] relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[var(--brand-500)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--brand-100)] dark:bg-[var(--brand-900)]/30 text-[var(--brand-600)] dark:text-[var(--brand-400)] text-xs font-bold uppercase tracking-wider mb-4">
            Matériaux & Savoir-Faire
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-5">
            Trois Finitions d'Exception,{' '}
            <span className="gradient-text">Fabriquées à la Main</span>
          </h2>
          <p className="text-base md:text-lg text-[var(--text-muted)]">
            Chaque matériau offre une émotion unique. Découvrez la texture, la profondeur et les atouts de nos 3 créations phares.
          </p>
        </div>

        {/* Material Selector Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm max-w-full overflow-x-auto">
            {MATERIALS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedId(m.id)}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  selectedId === m.id
                    ? 'bg-[var(--brand-500)] text-white shadow-brand'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <span>{m.id === 'frame-bois' ? '🪵' : m.id === 'frame-plexiglas' ? '✨' : '🖼️'}</span>
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Material Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] p-6 md:p-12 shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Visual Showcase Presentation */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden bg-zinc-950 p-6 md:p-8 flex items-center justify-center min-h-[380px] shadow-2xl border border-white/10">
                  {/* Photo d'illustration du matériau */}
                  <img
                    src={activeMat.sampleImg}
                    alt={activeMat.name}
                    className="w-full max-h-[340px] object-cover rounded-xl shadow-2xl transition-transform duration-700 hover:scale-105"
                  />
                  
                  {/* Badge flottant */}
                  <div className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/15">
                    {activeMat.badge}
                  </div>

                  {/* Prix de départ */}
                  <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-[var(--brand-500)] text-white text-sm font-extrabold shadow-lg">
                    À partir de {activeMat.startingPrice}
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed Storytelling & Specs */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-bold text-[var(--brand-500)] uppercase tracking-wider">
                    {activeMat.tagline}
                  </span>
                  <h3 className="font-display text-3xl font-bold text-[var(--text-primary)] mt-1 mb-3">
                    {activeMat.name}
                  </h3>
                  <p className="text-[var(--text-muted)] text-base leading-relaxed">
                    {activeMat.description}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {activeMat.specs.map((spec, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                      <span className="block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                        {spec.label}
                      </span>
                      <span className="block text-xs md:text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => handleConfigureMaterial(activeMat)}
                    className="flex-1 px-8 py-4 rounded-2xl bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white font-bold text-center shadow-brand transition-all hover:-translate-y-0.5"
                  >
                    Personnaliser ce Cadre →
                  </button>

                  <Link
                    href="/configure"
                    className="px-6 py-4 rounded-2xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] font-semibold text-center text-sm text-[var(--text-primary)] transition-colors"
                  >
                    Comparer les formats
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
