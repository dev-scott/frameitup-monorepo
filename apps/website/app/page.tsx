import { HeroSection } from '@/components/home/hero-section';
import { HowItWorksSection } from '@/components/home/how-it-works';
import { MaterialShowcaseSection } from '@/components/home/material-showcase';
import { RoomInspirationGallery } from '@/components/home/room-inspiration-gallery';
import { StatsSection } from '@/components/home/stats-section';
import { TestimonialsSection } from '@/components/home/testimonials';
import { CtaSection } from '@/components/home/cta-section';

export const metadata = {
  title: 'FrameItUp — Cadres Personnalisés d\'Exception & Qualité Musée',
  description:
    'Importez votre photo, personnalisez votre encadrement en direct (bois massif, plexiglas flottant, cadre vitré) et recevez votre œuvre prête à accrocher chez vous.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* 1. Hero d'impact avec démonstration visuelle immersive */}
      <HeroSection />

      {/* 2. Le processus d'encadrement en 3 étapes simples */}
      <HowItWorksSection />

      {/* 3. Découverte interactive des 3 finitions artisanales */}
      <MaterialShowcaseSection />

      {/* 4. Mises en scène réelles et inspirations de décoration murale */}
      <RoomInspirationGallery />

      {/* 5. Chiffres clés et garanties de confection artisanale */}
      <StatsSection />

      {/* 6. Témoignages clients vérifiés et Foire Aux Questions (FAQ) */}
      <TestimonialsSection />

      {/* 7. Appel à l'action final */}
      <CtaSection />
    </main>
  );
}
