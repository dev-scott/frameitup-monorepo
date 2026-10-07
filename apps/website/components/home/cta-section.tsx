'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useLanguageStore } from '@/store/use-language-store';

export function CtaSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const { t } = useLanguageStore();

  const staticGuarantees = [
    { icon: '🎨' },
    { icon: '🚀' },
    { icon: '♻️' },
    { icon: '💯' },
  ];

  const guarantees = t.cta.guarantees.map((item, idx) => ({
    ...item,
    ...staticGuarantees[idx],
  }));

  return (
    <section ref={ref} id="cta" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-400)] to-transparent opacity-20" />

      {/* Floating decorations */}
      <motion.div
        style={{ y }}
        className="absolute -left-20 top-10 w-64 h-64 rounded-full bg-[var(--brand-500)] opacity-[0.07] blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-40, 40]) }}
        className="absolute -right-20 bottom-10 w-80 h-80 rounded-full bg-[var(--brand-600)] opacity-[0.06] blur-3xl pointer-events-none"
      />

      {/* Decorative frame shapes */}
      <div className="absolute left-8 top-1/4 opacity-10 dark:opacity-5">
        <div className="w-16 h-20 border-2 border-[var(--brand-500)] rounded-md rotate-12" />
      </div>
      <div className="absolute right-12 bottom-1/4 opacity-10 dark:opacity-5">
        <div className="w-20 h-14 border-2 border-[var(--brand-400)] rounded-md -rotate-6" />
      </div>
      <div className="absolute right-1/4 top-8 opacity-[0.08] dark:opacity-[0.04]">
        <div className="w-10 h-12 border border-[var(--brand-500)] rounded animate-float" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-block"
        >
          <span className="badge-premium">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-500)]" />
            {t.cta.badge}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] mb-6 leading-tight"
        >
          {t.cta.title}{' '}
          <span className="relative inline-block">
            <span className="shimmer-text">{t.cta.titleShimmer}</span>
            <br />
            <span className="gradient-text">{t.cta.titleGradient}</span>
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg md:text-xl text-[var(--text-muted)] mb-12 max-w-2xl mx-auto"
        >
          {t.cta.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/configure"
            id="cta-start-designing-btn"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white font-bold rounded-2xl text-lg shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10">{t.cta.startDesigning}</span>
            <motion.span
              className="relative z-10 text-xl"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              →
            </motion.span>
            {/* Shimmer sweep */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-700 ease-in-out" />
          </Link>

          <Link
            href="/frames"
            id="cta-browse-btn"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[var(--bg-card)] dark:bg-[var(--bg-tertiary)] border border-[var(--border-strong)] text-[var(--text-primary)] font-semibold rounded-2xl text-lg hover:border-[var(--brand-400)] hover:bg-[var(--bg-secondary)] transition-all duration-300 hover:-translate-y-1"
          >
            {t.cta.browseCollection}
          </Link>
        </motion.div>

        {/* Guarantee badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-14"
        >
          {guarantees.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[var(--text-muted)]">
              <span className="text-base">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
