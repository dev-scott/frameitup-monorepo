'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguageStore } from '@/store/use-language-store';

/* ─── Counter Hook ───────────────────────────────────── */
function useCounter(target: number, duration = 2000, inView = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return count;
}

/* ─── Stat Item ──────────────────────────────────────── */
function StatItem({
  value, suffix, label, description, delay, inView,
}: {
  value: number; suffix: string; label: string; description: string; delay: number; inView: boolean;
}) {
  const count = useCounter(value, 1800, inView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative group text-center lg:text-left"
    >
      {/* Number */}
      <div className="flex items-baseline gap-1 justify-center lg:justify-start mb-1">
        <span className="font-display text-5xl md:text-6xl font-bold text-[var(--text-primary)]">
          {count.toLocaleString()}
        </span>
        <span className="font-display text-3xl font-bold text-[var(--brand-500)]">
          {suffix}
        </span>
      </div>

      {/* Label */}
      <p className="text-base font-semibold text-[var(--text-secondary)] mb-1">{label}</p>
      <p className="text-sm text-[var(--text-muted)] leading-snug max-w-xs mx-auto lg:mx-0">{description}</p>

      {/* Underline accent */}
      <div className="mt-4 h-px bg-gradient-to-r from-[var(--brand-400)] via-[var(--brand-500)] to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

// Moved dynamically inside the StatsSection component

/* ─── Main section ───────────────────────────────────── */
export function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t, language } = useLanguageStore();

  const stats = [
    { value: 250, suffix: '+', label: t.stats.items[0]?.label ?? '', description: t.stats.items[0]?.description ?? '', delay: 0 },
    { value: 4, suffix: '.5★', label: t.stats.items[1]?.label ?? '', description: t.stats.items[1]?.description ?? '', delay: 0.15 },
    { value: 5, suffix: language === 'fr' ? ' jours' : ' days', label: t.stats.items[2]?.label ?? '', description: t.stats.items[2]?.description ?? '', delay: 0.3 },
    { value: 100, suffix: '%', label: t.stats.items[3]?.label ?? '', description: t.stats.items[3]?.description ?? '', delay: 0.45 },
  ];

  return (
    <section ref={ref} id="stats" className="section-padding relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-[var(--frame-dark)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(217,141,46,0.1)_0%,transparent_70%)]" />
      {/* Grain */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="section-label mb-4 text-[var(--brand-400)]">{t.stats.sectionLabel}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
            {t.stats.title}{' '}
            <span className="shimmer-text">{t.stats.titleHighlight}</span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
