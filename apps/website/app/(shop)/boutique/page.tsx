import type { Metadata } from 'next';
import Link from 'next/link';
import BoutiqueGallery from '@/components/boutique/BoutiqueGallery';

export const metadata: Metadata = {
  title: 'Boutique — Tableaux Prêts à Poser',
  description:
    "Découvrez notre collection de tableaux encadrés prêts à accrocher. Impressions fine art sur Hahnemühle 250g, moulures bois noble FSC, livraison Douala & Yaoundé en 48h. Commandez via WhatsApp.",
};

const STATS = [
  { val: 'Hahnemühle 250g', label: 'Papier archive' },
  { val: 'J+2 ouvrables', label: 'Fabrication atelier' },
  { val: 'Douala · Yaoundé', label: 'Livraison 48h' },
  { val: 'Mobile Money', label: 'Paiement sécurisé' },
];

export default function BoutiquePage() {
  return (
    <main className="boutique-page">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="boutique-hero-section">
        <div className="boutique-hero-inner">
          {/* Left text */}
          <div className="boutique-hero-text">
            <span className="boutique-overline">Collection prête à poser</span>
            <h1 className="boutique-h1">
              Tableaux encadrés,{' '}
              <em className="boutique-h1-em">prêts à accrocher</em>
            </h1>
            <p className="boutique-h1-sub">
              Chaque tableau est imprimé sur papier Hahnemühle 250g, encadré dans notre
              atelier avec des moulures en bois noble FSC, et livré prêt à poser.
              Passez commande directement via WhatsApp.
            </p>
          </div>

          {/* How-to card */}
          <div className="boutique-how-card">
            <p className="boutique-how-label">Comment commander</p>
            {[
              '1. Choisissez votre tableau',
              '2. Cliquez sur « Commander »',
              '3. WhatsApp s\'ouvre',
              '4. Confirmez et payez',
            ].map(step => (
              <p key={step} className="boutique-how-step">{step}</p>
            ))}
            <div className="boutique-how-footer">
              <span className="boutique-wa-dot" />
              <span className="boutique-how-footer-text">Réponse en moins d&apos;1h</span>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="boutique-stats-strip">
          <div className="boutique-stats-inner">
            {STATS.map(({ val, label }) => (
              <div key={label} className="boutique-stat-item">
                <p className="boutique-stat-val">{val}</p>
                <p className="boutique-stat-label">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────── */}
      <section className="boutique-gallery-section">
        <div className="boutique-container">
          <BoutiqueGallery />
        </div>
      </section>

      {/* ── CTA bottom ───────────────────────────────────── */}
      <section className="boutique-cta-section">
        <div className="boutique-container boutique-cta-inner">
          <div>
            <p className="boutique-cta-sup">Vous avez votre propre photo ?</p>
            <h2 className="boutique-cta-h2">
              Créez votre cadre{' '}
              <em className="boutique-cta-em">sur-mesure</em>
            </h2>
          </div>
          <Link href="/configure" className="boutique-cta-btn">
            Configurer mon cadre →
          </Link>
        </div>
      </section>

      <style>{`
        .boutique-page {
          padding-top: 80px;
          min-height: 100vh;
        }

        /* ── Hero ── */
        .boutique-hero-section {
          border-bottom: 1px solid var(--border);
          background: var(--bg-secondary);
        }
        .boutique-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 72px 32px 56px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 48px;
        }
        .boutique-overline {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--brand-500);
          margin-bottom: 16px;
        }
        .boutique-h1 {
          font-family: var(--font-playfair), serif;
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          font-weight: 600;
          line-height: 1.08;
          letter-spacing: -0.025em;
          color: var(--text-primary);
          margin: 0 0 18px;
        }
        .boutique-h1-em {
          font-style: italic;
          color: var(--brand-500);
        }
        .boutique-h1-sub {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--text-secondary);
          max-width: 520px;
          margin: 0;
        }

        /* How-to card */
        .boutique-how-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px 28px;
          min-width: 240px;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }
        .boutique-how-label {
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin: 0 0 12px;
        }
        .boutique-how-step {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0 0 6px;
          line-height: 1.5;
        }
        .boutique-how-footer {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .boutique-wa-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #25D366;
          flex-shrink: 0;
        }
        .boutique-how-footer-text {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        /* Stats strip */
        .boutique-stats-strip {
          border-top: 1px solid var(--border);
          background: var(--bg-card);
        }
        .boutique-stats-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .boutique-stat-item {
          padding: 20px 24px;
          text-align: center;
          border-right: 1px solid var(--border);
        }
        .boutique-stat-item:last-child { border-right: none; }
        .boutique-stat-val {
          font-family: var(--font-playfair), serif;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 3px;
        }
        .boutique-stat-label {
          font-size: 0.6875rem;
          color: var(--text-muted);
          margin: 0;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* Gallery */
        .boutique-gallery-section {
          padding: 64px 0 80px;
        }
        .boutique-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* CTA */
        .boutique-cta-section {
          background: var(--text-primary);
          padding: 56px 0;
        }
        .boutique-cta-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }
        .boutique-cta-sup {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin: 0 0 10px;
        }
        .boutique-cta-h2 {
          font-family: var(--font-playfair), serif;
          font-size: clamp(1.5rem, 2.5vw, 2.25rem);
          font-weight: 600;
          color: #fff;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .boutique-cta-em {
          color: var(--brand-400);
          font-style: italic;
        }
        .boutique-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: var(--brand-500);
          color: #fff;
          font-size: 0.9375rem;
          font-weight: 600;
          border-radius: 12px;
          text-decoration: none;
          flex-shrink: 0;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .boutique-cta-btn:hover {
          background: var(--brand-600);
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .boutique-hero-inner {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 56px 24px 40px;
          }
          .boutique-how-card { min-width: unset; }
          .boutique-stats-inner { grid-template-columns: repeat(2, 1fr); }
          .boutique-stat-item:nth-child(2) { border-right: none; }
          .boutique-stat-item { border-bottom: 1px solid var(--border); }
          .boutique-stat-item:nth-child(3),
          .boutique-stat-item:nth-child(4) { border-bottom: none; }
        }
        @media (max-width: 580px) {
          .boutique-stats-inner { grid-template-columns: 1fr 1fr; }
          .boutique-gallery-section { padding: 40px 0 60px; }
          .boutique-container { padding: 0 16px; }
          .boutique-cta-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </main>
  );
}

