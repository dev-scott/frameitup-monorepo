'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buildWhatsAppUrl, WA_MESSAGES } from '@/lib/whatsapp';
import { useLanguageStore } from '@/store/use-language-store';

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const { language } = useLanguageStore();

  const options = [
    {
      id: 'order',
      icon: '📦',
      label: language === 'fr' ? 'Suivi de commande' : 'Order tracking',
      href: buildWhatsAppUrl(language === 'fr'
        ? 'Bonjour FrameItUp 👋\n\nJ\'aimerais suivre l\'état de ma commande. Pouvez-vous m\'aider ?'
        : 'Hello FrameItUp 👋\n\nI\'d like to track my order status. Can you help me?'),
    },
    {
      id: 'quote',
      icon: '🖼️',
      label: language === 'fr' ? 'Devis cadre personnalisé' : 'Custom frame quote',
      href: buildWhatsAppUrl(WA_MESSAGES.customQuote()),
    },
    {
      id: 'pricing',
      icon: '💬',
      label: language === 'fr' ? 'Discuter des tarifs' : 'Discuss pricing',
      href: buildWhatsAppUrl(WA_MESSAGES.pricing()),
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Quick action bubbles */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col gap-2 items-end"
          >
            {/* Label */}
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mr-1 mb-1">
              {language === 'fr' ? 'Écrire sur WhatsApp' : 'Chat on WhatsApp'}
            </span>

            {options.map((opt, i) => (
              <motion.a
                key={opt.id}
                href={opt.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2.5 bg-white dark:bg-stone-900 border border-[var(--border)] text-[var(--text-primary)] text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all max-w-[220px] whitespace-nowrap"
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp FAB */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
        aria-label="WhatsApp"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />

        {/* WhatsApp SVG icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-white relative z-10 transition-transform"
          style={{ transform: open ? 'rotate(90deg) scale(0.85)' : 'none', transition: 'transform 0.3s' }}
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </motion.button>
    </div>
  );
}
