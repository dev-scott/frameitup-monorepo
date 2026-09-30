'use client';

import Link from 'next/link';
import Image from 'next/image';

const NAV = [
  { label: 'Boutique',          href: '/boutique' },
  { label: 'Comment ça marche', href: '/#process' },
  // { label: 'Savoir-faire',      href: '/#savoir-faire' },
  { label: 'Configurateur',     href: '/configurator' },
];

const SERVICES = [
  'Impression fine art Hahnemühle 250g',
  'Encadrement bois noble FSC',
  'Passe-partout biseau 45°',
  'Plexiglas poli au diamant',
  'Verre antireflet minéral',
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--text-ink)' }}>
      {/* Top rule */}
      <div style={{ height: 1, background: 'var(--n-800)' }} />

      <div className="container" style={{ paddingTop: 80, paddingBottom: 52 }}>

        {/* Grid */}
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '2.2fr 1fr 1fr',
            gap: 64,
            paddingBottom: 56,
            borderBottom: '1px solid var(--n-800)',
          }}
        >
          {/* Brand column */}
          <div>
            {/* Logo */}
            <div style={{ marginBottom: 24 }}>
              <Image
                src="/frameitup_logo.svg"
                alt="FrameItUp"
                width={160}
                height={64}
                style={{ height: 40, width: 'auto', filter: 'brightness(10)' }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--n-600)',
                  marginTop: 8,
                }}
              >
                Atelier d&apos;encadrement artisanal
              </p>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9375rem',
                lineHeight: 1.8,
                color: 'var(--n-500)',
                maxWidth: 300,
                marginBottom: 28,
              }}
            >
              Chaque œuvre mérite un écrin à sa hauteur. Nous fabriquons des cadres
              d&apos;exception depuis Doula, livrés partout au cameroun.
            </p>

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Tél',     value: ' +237 6 89 50 21 47' },
                { label: 'Email',   value: 'frameitup05@gmail.com' },
                { label: 'Adresse', value: 'Douala, Cameroun' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', gap: 12, fontSize: '0.875rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--n-600)',
                      minWidth: 56,
                      flexShrink: 0,
                    }}
                  >
                    {label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', color: 'var(--n-400)' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--n-600)',
                marginBottom: 22,
                fontWeight: 600,
              }}
            >
              Navigation
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[{ href: '/', label: 'Accueil' }, ...NAV].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.9375rem',
                      color: 'var(--n-500)',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                      lineHeight: 1,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--n-500)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--n-600)',
                marginBottom: 22,
                fontWeight: 600,
              }}
            >
              Prestations
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {SERVICES.map((s) => (
                <li
                  key={s}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    color: 'var(--n-500)',
                    lineHeight: 1.4,
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 28,
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8125rem',
              color: 'var(--n-600)',
            }}
          >
            © {new Date().getFullYear()} FrameItUp. Tous droits réservés.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8125rem',
              color: 'var(--n-700)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            {/* r */}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </footer>
  );
}
