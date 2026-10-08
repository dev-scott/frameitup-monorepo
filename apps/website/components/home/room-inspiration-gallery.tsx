'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const INSPIRATIONS = [
  {
    id: 1,
    title: 'Mur Galerie Scandinave',
    space: 'Salon Contemporain',
    dimensions: 'Composition A3 & A4',
    frameType: 'Cadre Vitré Noir Galerie & Chêne',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
    caption: 'L\'association de formats asymétriques donne vie aux souvenirs de voyage.',
  },
  {
    id: 2,
    title: 'Panneau Bois & Chaleur Minérale',
    space: 'Coin Lecture & Bureau',
    dimensions: 'Grand Format A2',
    frameType: 'Panneau Bois Massif',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80',
    caption: 'L\'absence de vitre sublime les tirages artistiques sans aucun reflet.',
  },
  {
    id: 3,
    title: 'Éclat Plexiglas Flottant',
    space: 'Séjour Minimaliste & Lumineux',
    dimensions: 'Format A2 Élite',
    frameType: 'Plexiglas Flottant Inox',
    image: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=1000&q=80',
    caption: 'Les entretoises en acier inoxydable projettent une ombre portée tridimensionnelle.',
  },
  {
    id: 4,
    title: 'Duo Chambre Cosy',
    space: 'Tête de lit & Ambiance Feutrée',
    dimensions: '2 × Format A4',
    frameType: 'Cadre Vitré avec Passe-Partout',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80',
    caption: 'Le passe-partout ivoire met en valeur les portraits en noir et blanc.',
  },
];

export function RoomInspirationGallery() {
  const [activeItem, setActiveItem] = useState(INSPIRATIONS[0]);

  return (
    <section id="inspirations" className="py-24 bg-[var(--bg-primary)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--brand-100)] dark:bg-[var(--brand-900)]/30 text-[var(--brand-600)] dark:text-[var(--brand-400)] text-xs font-bold uppercase tracking-wider mb-4">
              Mises en Scène Réelles
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
              Inspirez Vos <span className="gradient-text">Espaces de Vie</span>
            </h2>
          </div>
          <p className="text-base text-[var(--text-muted)] max-w-md">
            Du salon moderne au bureau intimiste, observez comment nos cadres s'intègrent naturellement dans vos intérieurs.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INSPIRATIONS.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveItem(item)}
              className="group rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
            >
              {/* Image box */}
              <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Space Tag */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
                  {item.space}
                </div>

                {/* Text overlay on image bottom */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold text-amber-400 block mb-0.5">
                    {item.dimensions}
                  </span>
                  <h3 className="font-display text-lg font-bold leading-tight">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                  <span>🖼️</span>
                  <span className="truncate">{item.frameType}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {item.caption}
                </p>
                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs font-bold text-[var(--brand-500)] group-hover:text-[var(--brand-600)]">
                  <span>Configurer ce style</span>
                  <span>→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner Callout */}
        <div className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#1c1917] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-display text-2xl md:text-3xl font-bold">
              Besoin d'un conseil d'agencement sur-mesure ?
            </h3>
            <p className="text-sm text-stone-300 max-w-xl">
              Envoyez-nous la photo de votre mur sur WhatsApp : notre équipe vous propose une simulation de disposition gratuite sous 24h.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/configure"
              className="px-6 py-3.5 rounded-xl bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white font-bold text-sm shadow-brand transition-all"
            >
              Lancer le configurateur
            </Link>
            <a
              href="https://wa.me/237699000000?text=Bonjour%2C%20je%20souhaite%20un%20conseil%20pour%20encadrer%20une%20photo%20sur%20FrameItUp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <span>💬 WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
