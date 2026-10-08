'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/store/use-language-store';

interface TestimonialType {
  id: number;
  name: string;
  role: string;
  avatar: string;
  avatarColor: string;
  rating: number;
  text: string;
  frame: string;
}

const TESTIMONIALS_DATA: TestimonialType[] = [
  {
    id: 1,
    name: 'Sophie Marceau',
    role: 'Architecte d\'intérieur, Douala',
    avatar: 'SM',
    avatarColor: '#8B6914',
    rating: 5,
    text: 'J\'ai commandé un ensemble de 3 cadres vitrés pour un salon à Bonapriso. La qualité des finitions et du passe-partout biseauté dépasse toutes mes attentes. Mes clients étaient émerveillés.',
    frame: 'Cadre Vitré Galerie A3',
  },
  {
    id: 2,
    name: 'Christian N.',
    role: 'Photographe d\'art, Yaoundé',
    avatar: 'CN',
    avatarColor: '#2C5F8A',
    rating: 5,
    text: 'Le plexiglas flottant avec entretoises inox donne un rendu digne d\'une galerie internationale. Les couleurs sont d\'une netteté époustouflante et les noirs sont denses et profonds.',
    frame: 'Plexiglas Galerie A2',
  },
  {
    id: 3,
    name: 'Estelle & Marc',
    role: 'Particuliers, Kribi',
    avatar: 'EM',
    avatarColor: '#5C4A8A',
    rating: 5,
    text: 'Nous avons fait encadrer notre photo de mariage sur panneau bois massif. L\'absence de reflet et la chaleur du bois rendent la photo vivante au-dessus de notre lit. Livraison très soignée !',
    frame: 'Panneau Bois Massif A2',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Quelle résolution d\'image dois-je envoyer pour obtenir un beau rendu ?',
    a: 'Les photos prises avec n\'importe quel smartphone moderne (iPhone, Samsung, Pixel) ou appareil photo numérique conviennent parfaitement. Notre atelier applique un algorithme de suréchantillonnage d\'art et vérifie chaque fichier avant tirage pour garantir une netteté cristalline.',
  },
  {
    q: 'Quels sont les délais de fabrication et de livraison ?',
    a: 'Votre cadre est assemblé à la main sous 24 à 48 heures. La livraison à Douala et Yaoundé s\'effectue en 48h à 72h ouvrées directement à votre domicile ou à votre bureau dans un emballage renforcé antichoc.',
  },
  {
    q: 'Le système d\'accroche murale est-il fourni ?',
    a: 'Oui, sans aucun supplément ! Chaque cadre arrive 100% prêt à être accroché : attaches crantées pour le bois, 4 entretoises en acier inoxydable avec chevilles pour le plexiglas, et crochets de cimaise pour les cadres sous verre.',
  },
  {
    q: 'Comment s\'effectue le règlement ?',
    a: 'Vous avez le choix total : paiement à la livraison en espèces après avoir examiné votre cadre, ou paiement immédiat et sécurisé via Mobile Money (Orange Money / MTN MoMo).',
  },
  {
    q: 'Puis-je échanger directement avec un conseiller sur WhatsApp ?',
    a: 'Oui, avec plaisir ! Cliquez à tout moment sur le bouton vert WhatsApp présent sur le site. Vous discuterez directement avec un membre de notre atelier pour obtenir des conseils de cadrage, de taille ou de disposition.',
  },
];

export function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const current: TestimonialType = TESTIMONIALS_DATA[activeIdx] ?? TESTIMONIALS_DATA[0]!;

  return (
    <section id="avis" className="py-24 bg-[var(--bg-secondary)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--brand-100)] dark:bg-[var(--brand-900)]/30 text-[var(--brand-600)] dark:text-[var(--brand-400)] text-xs font-bold uppercase tracking-wider mb-4">
            Témoignages & Confiance
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Ce Que Disent Nos <span className="gradient-text">Clients Passionnés</span>
          </h2>
          <p className="text-base text-[var(--text-muted)]">
            Découvrez les retours de passionnés d'art, d'architectes et de particuliers qui ont sublimé leurs murs avec FrameItUp.
          </p>
        </div>

        {/* Testimonials Carousel Card */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="p-8 md:p-12 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] shadow-xl relative overflow-hidden">
            {/* Ambient Watermark Quote */}
            <div className="absolute top-4 right-8 font-display text-9xl text-[var(--brand-500)]/10 font-bold pointer-events-none select-none">
              “
            </div>

            {/* Stars */}
            <div className="flex gap-1 text-amber-500 mb-6 text-base">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>

            {/* Testimonial Quote */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="space-y-6 relative z-10"
              >
                <p className="text-lg md:text-xl text-[var(--text-primary)] leading-relaxed italic">
                  "{current.text}"
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                      style={{ backgroundColor: current.avatarColor }}
                    >
                      {current.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">
                        {current.name}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)]">
                        {current.role}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-xs font-semibold text-[var(--brand-600)] dark:text-[var(--brand-400)] self-start sm:self-auto">
                    Modèle : {current.frame}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-8 pt-4">
              {TESTIMONIALS_DATA.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeIdx === idx ? 'w-8 bg-[var(--brand-500)]' : 'w-2.5 bg-[var(--border)] hover:bg-[var(--brand-300)]'
                  }`}
                  aria-label={`Avis ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQ INTERACTIVE ACCORDION ── */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Questions Fréquentes
            </h3>
            <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">
              Tout ce que vous devez savoir pour passer commande en toute sérénité.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm md:text-base text-[var(--text-primary)] hover:text-[var(--brand-500)] transition-colors"
                  >
                    <span>{item.q}</span>
                    <span className={`w-6 h-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[var(--brand-500)]' : ''}`}>
                      ▼
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-xs md:text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)]/50 pt-3">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
