'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/boutique',     label: 'Boutique' },
  // { href: '/#savoir-faire',label: 'Savoir-faire' },
  { href: '/#process',     label: 'Comment ça marche' },
  { href: '/configurator', label: 'Configurateur' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          insetInline: 0,
          zIndex: 100,
          height: 62,
          background: scrolled ? 'rgba(248,246,243,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--border-hairline)' : 'transparent'}`,
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div
          className="container"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo SVG */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Image
              src="/frameitup_logo.svg"
              alt="FrameItUp"
              width={180}
              height={70}
              style={{
                height: 46,
                width: 'auto',
                /* The SVG has white text + orange icon — on transparent/light bg we need to show the orange icon only */
                transition: 'filter 0.3s ease',
              }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex" style={{ alignItems: 'center', gap: 28 }}>
            {LINKS.map(({ href, label }) => {
              const active = pathname === href.split('#')[0];
              const isBoutique = href === '/boutique';
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8125rem',
                    fontWeight: isBoutique ? 500 : 400,
                    color: active
                      ? 'var(--text-ink)'
                      // : isBoutique
                      //   ? 'var(--accent)'
                        : 'var(--text-secondary)',
                    textDecoration: 'none',
                    position: 'relative',
                    paddingBottom: 2,
                    transition: 'color 0.15s ease',
                    letterSpacing: isBoutique ? '0.01em' : 0,
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-ink)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = active ? 'var(--text-ink)' :'var(--text-secondary)')}
                >
                  {label}
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: -2,
                        left: 0,
                        right: 0,
                        height: 1.5,
                        background: 'var(--accent)',
                        borderRadius: 1,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              href="/configurator"
              className="btn btn-primary hidden md:inline-flex"
              style={{ height: 38, fontSize: '0.8125rem', paddingInline: '18px' }}
            >
              Créer mon cadre
            </Link>

            {/* Hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 2px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--text-body)', transition: 'all 0.22s ease', transform: menuOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none' }} />
              <span style={{ display: 'block', width: 16, height: 1.5, background: 'var(--text-body)', transition: 'opacity 0.22s ease', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--text-body)', transition: 'all 0.22s ease', transform: menuOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed',
          top: 62,
          insetInline: 0,
          bottom: 0,
          zIndex: 99,
          background: 'var(--bg-canvas)',
          padding: '40px 24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
          borderTop: '1px solid var(--border-hairline)',
        }}
      >
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.375rem',
              fontWeight: 500,
              // color: href === '/boutique' ? 'var(--accent)' : 'var(--text-ink)',
              textDecoration: 'none',
              padding: '18px 0',
              borderBottom: '1px solid var(--border-hairline)',
              display: 'block',
              letterSpacing: '-0.01em',
            }}
          >
            {label}
          </Link>
        ))}
        <div style={{ marginTop: 32 }}>
          <Link
            href="/configurator"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', height: 48 }}
          >
            Créer mon cadre
          </Link>
        </div>
      </div>
    </>
  );
}
