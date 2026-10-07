'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguageStore } from '@/store/use-language-store';

/* ─── Frame data ─────────────────────────────────────── */
const frameCollection = [
  {
    id: 'oslo',
    name: 'Oslo Classic',
    material: { en: 'Solid Oak', fr: 'Chêne massif' },
    price: '$5000',
    color: '#8B6914',
    bg: 'from-amber-50 to-stone-100 dark:from-amber-950/30 dark:to-stone-900/30',
    badgeKey: 'bestSeller' as const,
    badgeColor: 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/50',
    artColors: ['#E8D5B7', '#C4A882', '#d98d2e'],
    dimensions: '20×24"',
  },
  {
    id: 'noir',
    name: 'Noir Élégant',
    material: { en: 'Matte Black Aluminum', fr: 'Aluminium noir mat' },
    price: '$65',
    color: '#1a1a1a',
    bg: 'from-stone-100 to-slate-100 dark:from-stone-900/40 dark:to-slate-900/40',
    badgeKey: 'modern' as const,
    badgeColor: 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-900/50',
    artColors: ['#c8c8c8', '#888', '#333'],
    dimensions: '16×20"',
  },
  {
    id: 'galerie',
    name: 'Galerie Gold',
    material: { en: 'Gilded Walnut', fr: 'Noyer doré' },
    price: '$145',
    color: '#B8860B',
    bg: 'from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/30',
    badgeKey: 'premium' as const,
    badgeColor: 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-950/50',
    artColors: ['#f5e6c8', '#d4b060', '#8B6914'],
    dimensions: '24×30"',
  },
  {
    id: 'natura',
    name: 'Natura Verte',
    material: { en: 'Reclaimed Pine', fr: 'Pin recyclé' },
    price: '$75',
    color: '#4A6B3A',
    bg: 'from-green-50 to-stone-50 dark:from-green-950/20 dark:to-stone-900/30',
    badgeKey: 'eco' as const,
    badgeColor: 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950/50',
    artColors: ['#d4e8c4', '#8BA870', '#4A6B3A'],
    dimensions: '18×24"',
  },
  {
    id: 'marbre',
    name: 'Marbre Blanc',
    material: { en: 'Resin & Marble', fr: 'Résine & marbre' },
    price: '$119',
    color: '#C0C0C0',
    bg: 'from-gray-50 to-slate-100 dark:from-gray-900/30 dark:to-slate-900/30',
    badgeKey: 'luxury' as const,
    badgeColor: 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-900/50',
    artColors: ['#f0f0f0', '#d0d0d0', '#a0a0a0'],
    dimensions: '20×20"',
  },
  {
    id: 'terracotta',
    name: 'Terra Antica',
    material: { en: 'Terracotta Clay', fr: 'Argile cuite' },
    price: '$99',
    color: '#C4622D',
    bg: 'from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20',
    badgeKey: 'new' as const,
    badgeColor: 'text-orange-700 bg-orange-100 dark:text-orange-400 dark:bg-orange-950/50',
    artColors: ['#f5d4b8', '#d4856a', '#C4622D'],
    dimensions: '16×16"',
  },
];

/* ─── Frame Card ─────────────────────────────────────── */
function FrameCard({ frame, index }: { frame: typeof frameCollection[0]; index: number }) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguageStore();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const rotateX = (mousePos.y - 0.5) * -10;
  const rotateY = (mousePos.x - 0.5) * 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
        style={{
          transform: hovered
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
          transition: hovered ? 'transform 0.1s ease' : 'transform 0.5s ease',
        }}
        className={`relative p-6 rounded-3xl bg-gradient-to-br ${frame.bg} border border-[var(--border)] hover:border-[var(--brand-400)] overflow-hidden cursor-pointer`}
      >
        {/* Badge */}
        <div className="flex items-start justify-between mb-5">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${frame.badgeColor}`}>
            {t.showcase.badges[frame.badgeKey]}
          </span>
          <span className="text-xs text-[var(--text-subtle)]">{frame.dimensions}</span>
        </div>

        {/* Frame visual preview */}
        <div className="relative mb-6 flex items-center justify-center h-44">
          {/* Frame border */}
          <div
            className="relative shadow-frame transition-all duration-500 group-hover:shadow-frame-lg"
            style={{
              width: '120px',
              height: '140px',
              backgroundColor: frame.color,
              borderRadius: '4px',
              padding: '10px',
            }}
          >
            {/* Art canvas */}
            <div
              className="w-full h-full rounded-sm overflow-hidden relative"
              style={{ backgroundColor: frame.artColors[0] }}
            >
              {/* Abstract art */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${frame.artColors[0]} 0%, ${frame.artColors[1]} 50%, ${frame.artColors[2]} 100%)`,
                  opacity: 0.7,
                }}
              />
              {/* Art strokes */}
              <div
                className="absolute left-1/4 top-1/4 w-1 h-16 rounded-full opacity-60"
                style={{ backgroundColor: frame.artColors[1] }}
              />
              <div
                className="absolute right-1/3 top-1/3 w-10 h-1 rounded-full opacity-40"
                style={{ backgroundColor: frame.artColors[2] }}
              />

              {/* Glass shine */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            </div>

            {/* Frame inner shadow */}
            <div className="absolute inset-0 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] rounded-sm pointer-events-none" />
          </div>

          {/* Floating shadow */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-3 rounded-full blur-md transition-all duration-500"
            style={{
              backgroundColor: frame.color,
              opacity: hovered ? 0.25 : 0.12,
              transform: `translateX(-50%) scaleX(${hovered ? 1.2 : 1})`,
            }}
          />
        </div>

        {/* Frame info */}
        <div>
          <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-1">
            {frame.name}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">{frame.material[language as 'en' | 'fr']}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[var(--text-primary)]">{frame.price}</span>
            {/* <Link
              href={`/frames/${frame.id}`}
              id={`frame-card-${frame.id}-btn`}
              className="flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] transition-colors duration-200 group/link"
              onClick={(e) => e.stopPropagation()}
            >
              <span>{t.showcase.preview}</span>
              <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
            </Link> */}
          </div>
        </div>

        {/* Hover glow */}
        {hovered && (
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(217,141,46,0.08) 0%, transparent 60%)`,
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main Section ───────────────────────────────────── */
export function FrameShowcaseSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useLanguageStore();

  return (
    <section ref={ref} id="frames-showcase" className="section-padding relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-400)] to-transparent opacity-20" />
      <div className="absolute -right-40 top-1/3 w-96 h-96 bg-[var(--brand-500)] opacity-5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <p className="section-label mb-4">{t.showcase.sectionLabel}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
              {t.showcase.title}{' '}
              <span className="gradient-text">{t.showcase.titleHighlight}</span>
            </h2>
          </div>
          <Link
            href="/frames"
            id="showcase-view-all-btn"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 border border-[var(--border-strong)] rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--brand-400)] hover:text-[var(--brand-500)] transition-all duration-200"
          >
            {t.showcase.viewAll}
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {frameCollection.map((frame, i) => (
            <FrameCard key={frame.id} frame={frame} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
