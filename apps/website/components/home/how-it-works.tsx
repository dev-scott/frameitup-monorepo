'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguageStore } from '@/store/use-language-store';

const stepMetadata = [
  {
    number: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    color: 'from-amber-400/20 to-orange-400/20',
    accent: '#d98d2e',
  },
  {
    number: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    color: 'from-stone-400/20 to-amber-400/20',
    accent: '#8B6914',
  },
  {
    number: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
      </svg>
    ),
    color: 'from-green-400/10 to-amber-400/15',
    accent: '#5C8A3A',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.8, ease: 'easeOut' as const },
  },
};

export function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useLanguageStore();

  const steps = t.howItWorks.steps.map((step, index) => ({
    ...step,
    ...stepMetadata[index],
  }));

  return (
    <section ref={ref} id="how-it-works" className="section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-500)] to-transparent opacity-30" />
      <div className="absolute -left-40 top-1/2 w-80 h-80 bg-[var(--brand-500)] opacity-5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="section-label mb-4">{t.howItWorks.sectionLabel}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-5">
            {t.howItWorks.title}{' '}
            <span className="gradient-text">{t.howItWorks.titleHighlight}</span>
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 left-[calc(100%+1rem)] w-[calc(2rem)] h-px z-10">
                  <div className="h-full bg-gradient-to-r from-[var(--brand-400)] to-transparent opacity-40" />
                </div>
              )}

              <div className="relative p-8 rounded-3xl bg-[var(--bg-card)] dark:bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--brand-400)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-frame-lg overflow-hidden">
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />

                <div className="relative z-10">
                  {/* Number + Icon */}
                  <div className="flex items-start justify-between mb-8">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${step.accent}18`, color: step.accent }}
                    >
                      {step.icon}
                    </div>
                    <span className="font-display text-6xl font-bold text-[var(--border)] dark:text-[rgba(168,162,158,0.15)] group-hover:text-[var(--brand-200)] dark:group-hover:text-[rgba(217,141,46,0.2)] transition-colors duration-500">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-8 right-8 h-0.5 rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)` }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="/configure"
            id="how-it-works-cta-btn"
            className="inline-flex items-center gap-2 text-[var(--brand-500)] hover:text-[var(--brand-600)] font-semibold transition-colors duration-200 group"
          >
            {t.howItWorks.cta}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
