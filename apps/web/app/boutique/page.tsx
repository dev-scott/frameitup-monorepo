import type { Metadata } from 'next';
import BoutiqueGallery from '@/components/boutique/BoutiqueGallery';

export const metadata: Metadata = {
  title: 'Boutique — Tableaux Prêts à Poser | FrameItUp',
  description:
    'Découvrez notre collection de tableaux encadrés prêts à poser. Œuvres d\'art fine art, moulures bois noble, livraison en Afrique de l\'Ouest. Commandez via WhatsApp.',
};

export default function BoutiquePage() {
  return (
    <div style={{ paddingTop: 60 }}>

      {/* Hero section */}
      <section
        style={{
          borderBottom: '1px solid var(--border-hairline)',
          background: 'var(--bg-surface)',
        }}
      >
        <div className="container" style={{ paddingTop: 72, paddingBottom: 64 }}>
          <div
            className="boutique-hero"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'end',
              gap: 40,
            }}
          >
            <div>
              <span className="overline" style={{ marginBottom: 18, display: 'block' }}>
                Collection prête à poser
              </span>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                  fontWeight: 500,
                  lineHeight: 1.06,
                  letterSpacing: '-0.025em',
                  color: 'var(--text-ink)',
                  margin: '0 0 20px',
                }}
              >
                Tableaux encadrés,
                <br />
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>prêts à accrocher</em>
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  color: 'var(--text-secondary)',
                  maxWidth: 520,
                  margin: 0,
                }}
              >
                Chaque tableau est imprimé sur papier Hahnemühle 250g, encadré dans
                notre atelier avec des moulures en bois noble FSC, et livré prêt à poser.
                Passez commande directement via WhatsApp.
              </p>
            </div>

            {/* WhatsApp info card */}
            <div
              style={{
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-hairline)',
                borderRadius: 6,
                padding: '20px 24px',
                minWidth: 240,
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-faint)',
                  marginBottom: 10,
                }}
              >
                Comment commander
              </p>
              {[
                '1. Choisissez votre tableau',
                '2. Cliquez sur "Commander"',
                '3. WhatsApp s\'ouvre',
                '4. Confirmez et payez',
              ].map(s => (
                <p
                  key={s}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    margin: '0 0 6px',
                    lineHeight: 1.5,
                  }}
                >
                  {s}
                </p>
              ))}
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: '1px solid var(--border-hairline)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#25D366',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Réponse en moins d&apos;1h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div
          style={{
            borderTop: '1px solid var(--border-hairline)',
            background: 'var(--bg-canvas)',
          }}
        >
          <div className="container">
            <div
              className="boutique-stats"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1px',
                background: 'var(--border-hairline)',
                border: '1px solid var(--border-hairline)',
                borderLeft: 'none',
                borderRight: 'none',
              }}
            >
              {[
                { val: 'Hahnemühle 250g', label: 'Papier archive' },
                { val: 'J+2 ouvrables',  label: 'Fabrication' },
                { val: '6 villes',        label: 'Livraison' },
                { val: 'Mobile Money',    label: 'Paiement' },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  style={{
                    background: 'var(--bg-surface)',
                    padding: '20px 24px',
                    textAlign: 'center',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'var(--text-ink)',
                      margin: '0 0 3px',
                    }}
                  >
                    {val}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      color: 'var(--text-faint)',
                      margin: 0,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section">
        <div className="container">
          <BoutiqueGallery />
        </div>
      </section>

      {/* CTA — custom frame */}
      <section
        style={{
          background: 'var(--text-ink)',
          borderTop: '1px solid var(--n-800)',
        }}
        className="section-sm"
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 32,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p
              className="overline"
              style={{ color: 'var(--n-600)', marginBottom: 10, display: 'block' }}
            >
              Vous avez votre propre photo ?
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 500,
                color: 'var(--white)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Créez votre cadre
              <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}> sur-mesure</em>
            </h2>
          </div>
          <a
            href="/configurator"
            className="btn btn-accent"
            style={{ height: 50, paddingInline: 32, fontSize: '0.9375rem', flexShrink: 0 }}
          >
            Configurer mon cadre
          </a>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .boutique-hero { grid-template-columns: 1fr !important; }
          .boutique-stats { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .boutique-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
