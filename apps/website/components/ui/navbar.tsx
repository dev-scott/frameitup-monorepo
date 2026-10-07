'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLanguageStore } from '@/store/use-language-store';

/* ─── Icons ─────────────────────────────────────────── */
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ─── Nav links ─────────────────────────────────────── */
// Moved dynamically inside the Navbar component

/* ─── NavLink component ─────────────────────────────── */
function NavLink({ href, label, external, active }: {
  href: string; label: string; external?: boolean; active: boolean;
}) {
  const props = external
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { href };

  return (
    <Link
      {...(label === "Marketplace" ? { href: "#" } : props)}
      className={`relative text-sm font-medium transition-colors duration-200 group ${active
        ? 'text-[var(--brand-500)]'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        } ${label === 'Marketplace' ? 'px-4 py-4 bg-muted opacity-30 cursor-not-allowed' : ''} `}
    >
      {label}
      {external && (
        <span className="ml-1 text-xs opacity-50">↗</span>
      )}
      <span className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'
        }`} />
    </Link>
  );
}

/* ─── Main Navbar ───────────────────────────────────── */
export function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguageStore();

  const navLinks: { href: string; label: string; authRequired?: boolean; external?: boolean }[] = [
    { href: '/configure', label: language === 'fr' ? 'Créer mon cadre' : t.nav.design },
    { href: '/#finitions', label: language === 'fr' ? 'Nos Finitions' : 'Finishes' },
    { href: '/#inspirations', label: language === 'fr' ? 'Inspirations' : 'Inspirations' },
    { href: '/#avis', label: language === 'fr' ? 'Avis & FAQ' : 'Reviews & FAQ' },
    { href: '/orders', label: t.nav.myOrders, authRequired: true },
  ];

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'py-3 bg-[var(--glass-bg)] backdrop-blur-2xl border-b border-[var(--border)]'
          : 'py-5 bg-transparent'
          }`}
        style={{
          boxShadow: scrolled ? '0 4px 32px rgba(28,25,23,0.08)' : 'none',
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className='flex items-center gap-2.5 '>

            <Link href="/" className="group">
              <div className="relative transition-transform duration-300 group-hover:rotate-6 ">
                {/* <div className="absolute inset-0 bg-[var(--brand-500)] rounded-lg rotate-12 group-hover:rotate-6 transition-transform duration-300" />
              <div className="absolute inset-1 bg-[var(--bg-primary)] rounded-md flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-[var(--brand-500)] rounded-sm" />
              </div> */}
                {/* add frame it up logo here */}
                <Image src={resolvedTheme === "dark" ? "/frameitup_logo_white.svg" : "/frameitup_logo_black.svg"} alt="Frame It Up" width={150} height={150} />

              </div>
              {/* <span className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Frame<span className="text-[var(--brand-500)]">ItUp</span>
            </span> */}
            </Link>

          </div>


          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8 pl-[32px]">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                external={link.external}
                active={pathname === link.href}
              />
            ))}
          </div>



          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            {mounted && (
              <button
                type="button"
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="px-2.5 py-1 rounded-lg text-xs font-bold border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--brand-500)] transition-colors"
                title="Changer de langue / Switch language"
              >
                {language.toUpperCase()}
              </button>
            )}

            {/* Theme toggle */}
            {mounted && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all duration-200"
                aria-label="Toggle theme"
                id="theme-toggle-btn"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={resolvedTheme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            )}



            {/* CTA button */}
            <Link
              href="/configure"
              id="navbar-cta-btn"
              className="hidden sm:flex items-center gap-2 px-5 py-2 bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-brand hover:shadow-brand-lg hover:-translate-y-0.5"
            >
              {t.nav.startDesigning}
              <span className="text-xs opacity-80">→</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] transition-all duration-200"
              aria-label="Toggle menu"
              id="mobile-menu-btn"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[var(--bg-primary)] border-l border-[var(--border)] shadow-xl lg:hidden"
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        target={link.external ? '_blank' : undefined}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${pathname === link.href
                          ? 'bg-[var(--brand-50)] text-[var(--brand-600)] dark:bg-[rgba(217,141,46,0.1)] dark:text-[var(--brand-400)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                          }`}
                      >
                        {link.label}
                        {link.external && <span className="text-xs opacity-40">↗</span>}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-auto flex flex-col gap-3">

                  <Link
                    href="/configure"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white text-sm font-semibold rounded-xl transition-all duration-200"
                  >
                    {t.nav.startDesigning} →
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
