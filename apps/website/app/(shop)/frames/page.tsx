'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getSeedFrames } from '@/app/actions';
import { useFrameStore, FrameOption } from '@/store/use-frame-store';
import { Button } from '@frameitup/ui';
import { useLanguageStore } from '@/store/use-language-store';

const translateMaterial = (mat: string, lang: string) => {
  if (lang === 'fr') {
    switch (mat.toLowerCase()) {
      case 'oak': return 'Chêne';
      case 'wood': return 'Bois';
      case 'aluminum': return 'Aluminium';
      case 'walnut': return 'Noyer';
      case 'pine': return 'Pin';
      case 'resin': return 'Résine';
      case 'clay': return 'Argile';
      default: return mat;
    }
  }
  return mat;
};

export default function BrowseFramesPage() {
  const router = useRouter();
  const setSelectedFrame = useFrameStore((state) => state.setSelectedFrame);
  const [frames, setFrames] = useState<FrameOption[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguageStore();

  useEffect(() => {
    async function load() {
      const data = await getSeedFrames();
      console.log("here is my frame data", data)
      setFrames(data as FrameOption[]);
      setLoading(false);
    }
    load();
  }, []);

  const handleSelect = (frame: FrameOption) => {
    setSelectedFrame(frame);
    router.push('/configure');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-widest text-[var(--brand-500)] uppercase"
          >
            {t.framesPage.sectionLabel}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            {t.framesPage.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[var(--text-secondary)] text-lg"
          >
            {t.framesPage.subtitle}
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-[var(--bg-secondary)] rounded-2xl h-[450px]" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {frames.map((frame) => (
              <motion.div
                key={frame.id}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative flex flex-col justify-between overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Visual frame demo container */}
                <div className="relative aspect-square w-full rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center p-8 mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />

                  {/* Floating simulated 3D frame item */}
                  <motion.div
                    className="relative w-48 h-48 flex items-center justify-center"
                    style={{
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)'
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    {/* Outer Frame Bevel */}
                    <div
                      className="absolute inset-0 rounded-lg border-8"
                      style={{
                        borderColor: frame.color,
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6)'
                      }}
                    />
                    {/* Inner Passe-partout (Mat) */}
                    <div className="absolute inset-2 bg-[#F9F6F0] border border-stone-300 flex items-center justify-center p-4">
                      {/* Fake print graphic inside */}
                      <div className="w-full h-full bg-gradient-to-tr from-amber-800/20 to-orange-400/20 flex items-center justify-center border border-stone-200">
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-400/30 animate-pulse" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Info and action */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                        {frame.name}
                      </h3>
                      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                        {language === 'fr' ? `${t.framesPage.profile} ${translateMaterial(frame.material, language)}` : `${frame.material} ${t.framesPage.profile}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[var(--brand-500)]">
                        {frame.priceUsd.toLocaleString('fr-FR')} FCFA
                      </span>
                      <p className="text-[10px] text-[var(--text-subtle)]">{t.framesPage.perLinearMeter}</p>
                    </div>
                  </div>

                  {/* Material Specs */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[var(--border)] text-xs text-[var(--text-secondary)]">
                    <div>
                      <span className="block text-[10px] text-[var(--text-subtle)] uppercase">{t.framesPage.width}</span>
                      <span className="font-semibold">{frame.widthMm} mm</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[var(--text-subtle)] uppercase">{t.framesPage.height}</span>
                      <span className="font-semibold">{frame.heightMm} mm</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[var(--text-subtle)] uppercase">{t.framesPage.depth}</span>
                      <span className="font-semibold">{frame.depthMm} mm</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelect(frame)}
                    className="w-full bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white font-medium rounded-xl py-2.5 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2"
                  >
                    {t.framesPage.designWith}
                    <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
