'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react';
import { SAMPLE_ARTWORKS } from '@/data/samples';
import { PRINT_FORMATS } from '@/data/formats';
import { BOUTIQUE_PRODUCTS } from '@/data/boutique';

const CRAFT = [
  { n: '01', title: 'Papier Hahnemühle 250g', body: 'Archive certifié 100 ans. Surface légèrement texturée pour sublimer chaque détail et nuance.' },
  { n: '02', title: 'Encres pigmentaires 12 couleurs', body: 'Gamut élargi, fidélité colorimétrique photographique. Rendu stable et durable dans le temps.' },
  { n: '03', title: 'Moulures bois noble FSC', body: 'Chêne, noyer, wengé ou acajou. Chaque moulure sélectionnée à la main selon la tradition artisanale.' },
  { n: '04', title: 'Plexiglas poli au diamant', body: 'Acrylique optique haute transmission (> 92%). Surface impeccable, résistance aux UV.' },
  { n: '05', title: 'Verre antireflet minéral', body: 'Traitement multicouche, réflexion inférieure à 1%. Standard galerie d\'art internationale.' },
  { n: '06', title: 'Passe-partout biseau 45°', body: 'Carton conservation blanc cœur. La coupe révèle une profondeur élégante, caractéristique du haut de gamme.' },
];

const STEPS = [
  { n: '1', title: 'Importez votre image', body: 'Téléchargez votre photo ou choisissez parmi nos démonstrations artistiques. JPEG, PNG, WebP.' },
  { n: '2', title: 'Configurez en temps réel', body: 'Format, moulure, passe-partout, protection. Visualisez en Studio 2.5D, Room View ou 3D.' },
  { n: '3', title: 'Passez commande', body: 'Renseignez la livraison et payez en Mobile Money ou à la livraison.' },
  { n: '4', title: 'Livraison artisanale', body: 'Fabrication sous 2 jours ouvrables, emballage soigné, livraison partout en Afrique de l\'Ouest.' },
];

export default function HomePage() {
  return (
    <div style={{ paddingTop: 60 }}>

      {/* ══ HERO ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          minHeight: 'calc(100dvh - 60px)',
          display: 'grid',
          gridTemplateRows: '1fr auto',
          borderBottom: '1px solid var(--border-hairline)',
          overflow: 'hidden',
        }}
      >
        <div
          className="container hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 0,
            alignItems: 'stretch',
          }}
        >
          {/* Left: copy */}
          <div
            className="hero-left"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingBlock: 88,
              paddingRight: 72,
              borderRight: '1px solid var(--border-hairline)',
            }}
          >
            {/* Eyebrow */}
            <span className="overline" style={{ marginBottom: 28 }}>
              Encadrement artisanal sur-mesure
            </span>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.75rem, 5.5vw, 4.75rem)',
                fontWeight: 500,
                lineHeight: 1.03,
                letterSpacing: '-0.025em',
                color: 'var(--text-ink)',
                margin: '0 0 30px',
              }}
            >
              Vos œuvres
              <br />
              <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>méritent mieux</em>
              <br />
              qu&apos;un cadre banal.
            </h1>

      

            {/* Sub-copy */}
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                maxWidth: 400,
                margin: '0 0 44px',
              }}
            >
              Impression fine art sur Hahnemühle, moulures en bois noble FSC et
              plexiglas poli au diamant. Configurez votre cadre en quelques minutes.
            </p>

            {/* CTA row */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/configurator" className="btn btn-primary" style={{ height: 48, paddingInline: 28 }}>
                Créer mon cadre
                <ArrowRight size={16} />
              </Link>
              <Link href="#savoir-faire" className="btn btn-secondary" style={{ height: 48 }}>
                Notre savoir-faire
              </Link>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: 'flex',
                gap: 48,
                marginTop: 64,
                paddingTop: 40,
                borderTop: '1px solid var(--border-hairline)',
              }}
              className="hero-stats"
            >
              {[
                { val: '100+', label: 'Ans de durabilité archive' },
                { val: '12',   label: 'Encres pigmentaires' },
                { val: '6',    label: 'Villes desservies' },
              ].map(({ val, label }) => (
                <div key={val}>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '2.125rem',
                      fontWeight: 500,
                      color: 'var(--text-ink)',
                      lineHeight: 1,
                      marginBottom: 5,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {val}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      color: 'var(--text-faint)',
                      lineHeight: 1.4,
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating frame visual */}
          <div
            className="hero-right"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-subtle)',
              padding: 48,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background texture lines */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, var(--border-hairline) 40px)',
                opacity: 0.5,
              }}
            />

            {/* Frame */}
            <div
              className="anim-float"
              style={{
                position: 'relative',
                zIndex: 1,
                padding: 20,
                background: 'linear-gradient(145deg, #C4A070 0%, #8B6438 35%, #D4B080 55%, #7A5830 100%)',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              {/* Passe-partout */}
              <div
                style={{
                  padding: 28,
                  background: '#FAF8F4',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=540&q=90"
                  alt="Œuvre encadrée — exemple FrameItUp"
                  style={{
                    display: 'block',
                    width: '100%',
                    maxWidth: 270,
                    height: 330,
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>

            {/* Floating label */}
            <div
              style={{
                position: 'absolute',
                bottom: 28,
                right: 28,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-hairline)',
                borderRadius: 4,
                padding: '11px 16px',
                boxShadow: 'var(--shadow-sm)',
                zIndex: 2,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.625rem',
                  color: 'var(--text-faint)',
                  marginBottom: 3,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}
              >
                Exemple
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.9375rem',
                  color: 'var(--text-ink)',
                }}
              >
                Chêne naturel, format A3
              </p>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div
          style={{
            borderTop: '1px solid var(--border-hairline)',
            padding: '14px 0',
            overflow: 'hidden',
            background: 'var(--bg-surface)',
          }}
        >
          <div className="container">
            <div style={{ display: 'flex', gap: 52, overflowX: 'auto', scrollbarWidth: 'none' }}>
              {[
                'Papier Hahnemühle 250g archive',
                'Moulures certifiées FSC',
                'Livraison Abidjan · Dakar · Douala',
                '12 encres pigmentaires',
                'Plexiglas poli au diamant',
                'Verre antireflet minéral',
                'Biseau 45° blanc cœur',
              ].map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    flexShrink: 0,
                  }}
                >
                  {s}
                  {i < 6 && (
                    <span style={{ color: 'var(--accent)', fontSize: '0.375rem', lineHeight: 1 }}>●</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SAVOIR-FAIRE ═══════════════════════════════════════════════════════ */}
      <section id="savoir-faire" className="section" style={{ borderBottom: '1px solid var(--border-hairline)' }}>
        <div className="container">

          {/* Section header */}
          <div
            className="sf-header"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 80,
              marginBottom: 72,
              alignItems: 'end',
            }}
          >
            <div>
              <span className="overline" style={{ marginBottom: 18, display: 'block' }}>Savoir-faire</span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  fontWeight: 500,
                  lineHeight: 1.08,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-ink)',
                  margin: 0,
                }}
              >
                Une fabrication qui
                <br />
                <em style={{ fontStyle: 'italic' }}>ne fait aucun compromis</em>
              </h2>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              Chaque cadre sort de notre atelier après un contrôle rigoureux.
              Du choix du bois à l&apos;assemblage final, nous n&apos;utilisons
              que des matériaux de première qualité, sélectionnés pour leur durabilité.
            </p>
          </div>

          {/* Craft grid */}
          <div
            className="craft-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1px',
              background: 'var(--border-hairline)',
              border: '1px solid var(--border-hairline)',
            }}
          >
            {CRAFT.map((item) => (
              <div
                key={item.n}
                style={{
                  background: 'var(--bg-canvas)',
                  padding: '36px 32px',
                  transition: 'background 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-canvas)')}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.8125rem',
                    color: 'var(--border-medium)',
                    display: 'block',
                    marginBottom: 28,
                    letterSpacing: '0.02em',
                  }}
                >
                  {item.n}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: 'var(--text-ink)',
                    margin: '0 0 10px',
                    lineHeight: 1.3,
                    letterSpacing: '-0.005em',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    lineHeight: 1.75,
                    color: 'var(--text-muted)',
                    margin: 0,
                  }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GALLERY ═══════════════════════════════════════════════════════════ */}
      <section className="section" style={{ borderBottom: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
            <div>
              <span className="overline" style={{ marginBottom: 14, display: 'block' }}>Galerie</span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.75rem, 3vw, 2.375rem)',
                  fontWeight: 500,
                  color: 'var(--text-ink)',
                  margin: 0,
                  letterSpacing: '-0.015em',
                }}
              >
                Œuvres de démonstration
              </h2>
            </div>
            <Link
              href="/configurator"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                transition: 'color 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              Ouvrir le configurateur
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Masonry-style grid */}
          <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {SAMPLE_ARTWORKS.map((artwork, i) => (
              <Link
                href="/configurator"
                key={artwork.id}
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: i % 3 === 0 ? '3/4' : '1/1',
                  background: 'var(--n-200)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                    display: 'block',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(26,23,20,0.72) 0%, transparent 50%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '20px 20px',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1rem',
                        color: 'var(--white)',
                        margin: '0 0 3px',
                        lineHeight: 1.3,
                      }}
                    >
                      {artwork.title}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.65)',
                        margin: 0,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {artwork.recommendedFormat}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FORMATS ════════════════════════════════════════════════════════════ */}
      <section
        id="formats"
        className="section-sm"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-hairline)' }}
      >
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <span className="overline" style={{ marginBottom: 14, display: 'block' }}>Formats disponibles</span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 500,
                color: 'var(--text-ink)',
                letterSpacing: '-0.015em',
              }}
            >
              Choisissez votre format
            </h2>
          </div>
          <div
            className="formats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1px',
              background: 'var(--border-hairline)',
              border: '1px solid var(--border-hairline)',
            }}
          >
            {PRINT_FORMATS.map((f) => (
              <div
                key={f.id}
                style={{
                  padding: '32px 28px',
                  background: 'var(--bg-surface)',
                  transition: 'background 0.18s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-canvas)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
              >
                {/* Paper prop representation */}
                <div
                  style={{
                    width: Math.min(f.widthCm * 2.8, 60),
                    height: Math.min(f.heightCm * 2.8, 80),
                    border: '1.5px solid var(--text-ink)',
                    marginBottom: 20,
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'var(--text-ink)',
                    margin: '0 0 4px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Format {f.label}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    margin: '0 0 14px',
                  }}
                >
                  {f.widthCm} × {f.heightCm} cm
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    color: 'var(--accent)',
                    fontWeight: 500,
                  }}
                >
                  Dès {(f.priceBase / 1000).toFixed(0)} 000 FCFA
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESS ════════════════════════════════════════════════════════════ */}
      <section id="process" className="section" style={{ borderBottom: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div style={{ marginBottom: 64 }}>
            <span className="overline" style={{ marginBottom: 14, display: 'block' }}>Processus</span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                fontWeight: 500,
                color: 'var(--text-ink)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              De votre photo à votre mur,<br />en 4 étapes simples
            </h2>
          </div>
          <div
            className="steps-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1px',
              background: 'var(--border-hairline)',
              border: '1px solid var(--border-hairline)',
            }}
          >
            {STEPS.map((s) => (
              <div
                key={s.n}
                style={{
                  padding: '36px 28px',
                  background: 'var(--bg-canvas)',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-canvas)')}
              >
                {/* Step number circle */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    border: '1px solid var(--text-ink)',
                    borderRadius: '50%',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--text-ink)',
                    marginBottom: 24,
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: 'var(--text-ink)',
                    margin: '0 0 10px',
                    letterSpacing: '-0.005em',
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    lineHeight: 1.75,
                    color: 'var(--text-muted)',
                    margin: 0,
                  }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--text-ink)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="overline" style={{ color: 'var(--n-600)', marginBottom: 28, display: 'block' }}>
            Prêt à commencer ?
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              fontWeight: 500,
              lineHeight: 1.06,
              color: 'var(--white)',
              margin: '0 0 20px',
              letterSpacing: '-0.025em',
            }}
          >
            Chaque photo a une histoire.
            <br />
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Encadrez-la comme elle le mérite.</em>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              color: 'var(--n-500)',
              maxWidth: 420,
              margin: '0 auto 52px',
              lineHeight: 1.8,
            }}
          >
            Configurez votre cadre sur-mesure en quelques minutes.
            Livraison dans toute l&apos;Afrique de l&apos;Ouest.
          </p>
          <Link
            href="/configurator"
            className="btn btn-accent"
            style={{ height: 52, paddingInline: 36, fontSize: '0.9375rem' }}
          >
            Ouvrir le configurateur
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ══ BOUTIQUE TEASER ═══════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
            <div>
              <span className="overline" style={{ marginBottom: 14, display: 'block' }}>Boutique</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.375rem)', fontWeight: 500, color: 'var(--text-ink)', margin: 0, letterSpacing: '-0.015em' }}>
                Tableaux prêts à accrocher
              </h2>
            </div>
            <Link
              href="/boutique"
              style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', fontWeight: 500 }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.75')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              Voir toute la boutique
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div
            className="boutique-preview-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}
          >
            {BOUTIQUE_PRODUCTS.slice(0, 3).map((product) => (
              <Link
                key={product.id}
                href="/boutique"
                style={{ textDecoration: 'none', display: 'block', position: 'relative', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--n-200)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)', display: 'block' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
                />
                {product.badge && (
                  <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--accent)', color: 'var(--white)', fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 2 }}>
                    {product.badge}
                  </span>
                )}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(26,23,20,0.80) 0%, transparent 100%)' }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.0625rem', color: 'var(--white)', margin: '0 0 2px', lineHeight: 1.3 }}>
                    {product.title}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                    {product.dimensions} · {product.priceFCFA.toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/boutique" className="btn btn-secondary" style={{ height: 44 }}>
              Explorer les {BOUTIQUE_PRODUCTS.length} tableaux
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ WHATSAPP SECTION ══════════════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div
            className="wa-section"
            style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center' }}
          >
            <div>
              <span className="overline" style={{ marginBottom: 16, display: 'block' }}>Contact direct</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 500, color: 'var(--text-ink)', margin: '0 0 14px', letterSpacing: '-0.015em' }}>
                Une question ? Écrivez-nous sur WhatsApp
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0, maxWidth: 500 }}>
                Notre atelier vous répond en moins d&apos;une heure. Conseils sur votre cadre, devis personnalisé, suivi de commande — tout par message.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <a
                href="https://wa.me/237658732446?text=Bonjour%20FrameItUp%20%F0%9F%91%8B"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#25D366', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, padding: '14px 28px', borderRadius: 4, textDecoration: 'none', boxShadow: '0 4px 20px rgba(37,211,102,0.30)', transition: 'background 0.15s ease' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#1DB954')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#25D366')}
              >
                <MessageCircle size={20} />
                Nous écrire sur WhatsApp
              </a>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--text-faint)' }}>
                +237 658 732 446
              </span>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-left { padding-right: 0 !important; border-right: none !important; padding-block: 64px !important; }
          .hero-right { display: none !important; }
          .sf-header  { grid-template-columns: 1fr !important; gap: 24px !important; }
          .craft-grid { grid-template-columns: 1fr 1fr !important; }
          .formats-grid { grid-template-columns: 1fr 1fr !important; }
          .steps-grid  { grid-template-columns: 1fr 1fr !important; }
          .gallery-grid { grid-template-columns: 1fr 1fr !important; }
          .boutique-preview-grid { grid-template-columns: 1fr 1fr !important; }
          .wa-section { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
        @media (max-width: 580px) {
          .hero-stats { flex-wrap: wrap; gap: 28px !important; }
          .craft-grid { grid-template-columns: 1fr !important; }
          .gallery-grid { grid-template-columns: 1fr !important; }
          .formats-grid { grid-template-columns: 1fr !important; }
          .steps-grid  { grid-template-columns: 1fr !important; }
          .boutique-preview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
