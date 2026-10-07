'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguageStore, type Language } from '@/store/use-language-store';
import Image from 'next/image';
import { useTheme } from 'next-themes';
const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];
function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function Footer() {
  const { theme, resolvedTheme } = useTheme();
  const { t, language, setLanguage } = useLanguageStore();
  const links = {
    [t.footer.product]: [
      { label: t.footer.links.browseFrames, href: '/frames' },
      { label: t.footer.links.designYours, href: '/configure' },
      { label: t.footer.links.myOrders, href: '/orders' },
      { label: t.footer.links.marketplace, href: 'http://localhost:3001', external: true },
    ],
    // [t.footer.company]: [
    //   { label: t.footer.links.aboutUs, href: '/about' },
    //   { label: t.footer.links.craftsmanship, href: '/craftsmanship' },
    //   { label: t.footer.links.sustainability, href: '/sustainability' },
    //   { label: t.footer.links.blog, href: '/blog' },
    // ],
    // [t.footer.support]: [
    //   { label: t.footer.links.faq, href: '/faq' },
    //   { label: t.footer.links.shipping, href: '/shipping' },
    //   { label: t.footer.links.contact, href: '/contact' },
    //   { label: t.footer.links.privacy, href: '/privacy' },
    // ],
  };

  return (
    <footer id="footer" className="relative overflow-hidden bg-[var(--frame-dark)] text-white">
      {/* Top border gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--brand-500)] to-transparent opacity-30" />
      {/* Ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-[var(--brand-500)] opacity-5 blur-3xl rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-4">
          {/* Brand col */}
          <div className="lg:col-span-2">
            {/* Logo */}
            {/* <Link href="/" className="flex items-center gap-2.5 mb-6 group w-fit">
              <div className="relative ">

                <Image src={resolvedTheme === "dark" ? "/frameitup_logo_black.svg" : "/frameitup_logo_black.svg"} alt="Frame It Up" width={90} height={90} />
              </div>
            </Link> */}
            {/* <p className="text-sm text-[rgba(250,250,249,0.5)] leading-relaxed mb-6 max-w-xs">
              {t.footer.tagline}
            </p> */}
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                {
                  label: 'Instagram', icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                  ),
                  href: "https://www.instagram.com/__frameitup/",
                  external: true,
                },
                {
                  label: 'Twitter', icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    </svg>
                  ),
                  href: "https://x.com/_Frameitup",
                  external: true,
                },
                {
                  label: 'Linkdin', icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ),
                  href: "https://www.linkedin.com/company/frameitup/?viewAsMember=true",
                  external: true,
                },
              ].map((social) => (
                <button
                  key={social.label}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg border border-[rgba(168,162,158,0.2)] flex items-center justify-center text-[rgba(250,250,249,0.4)] hover:border-[var(--brand-500)] hover:text-[var(--brand-400)] transition-all duration-200"
                >
                  <Link href={social.href} target={social.external ? "_blank" : undefined} className=''>
                    {social.icon}
                  </Link>
                </button>
              ))}
            </div>
          </div>
          {/* Links columns */}
          {/* {(Object.entries(links) as [string, { label: string; href: string; external?: boolean }[]][]).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[rgba(250,250,249,0.4)] mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.label === t.footer.links.marketplace ? "#" : "#"}
                      target={item.external ? '_blank' : undefined}
                      className={`${item.label === t.footer.links.marketplace ? 'bg-muted opacity-40 cursor-not-allowed' : ''}text-sm text-[rgba(250,250,249,0.55)] hover:text-[var(--brand-400)] transition-colors duration-200 flex items-center gap-1.5 group `}
                    >
                      {item.label}
                      {item.external && (
                        <span className="text-xs opacity-40 group-hover:opacity-70">↗</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
        </div>
        {/* Newsletter */}
        {/* <div className="border border-[rgba(168,162,158,0.12)] rounded-2xl p-6 mb-10 bg-[rgba(255,255,255,0.03)]">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <div>
              <h4 className="font-semibold text-white mb-1">{t.footer.newsletter.title}</h4>
              <p className="text-sm text-[rgba(250,250,249,0.45)]">{t.footer.newsletter.subtitle}</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder={t.footer.newsletter.placeholder}
                id="footer-newsletter-input"
                className="flex-1 md:w-64 px-4 py-2.5 bg-[rgba(255,255,255,0.06)] border border-[rgba(168,162,158,0.15)] rounded-xl text-sm text-white placeholder-[rgba(250,250,249,0.3)] focus:outline-none focus:border-[var(--brand-500)] transition-colors duration-200"
              />
              <button
                id="footer-newsletter-btn"
                className="px-5 py-2.5 bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white text-sm font-semibold rounded-xl transition-colors duration-200 whitespace-nowrap"
              >
                {t.footer.newsletter.subscribe}
              </button>
            </div>
          </div>
        </div> */}
        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-[rgba(168,162,158,0.1)]">
          <p className="text-xs text-[rgba(250,250,249,0.3)]">
            {t.footer.copyright}
          </p>
          {/* Center: Language Switcher */}
          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[rgba(250,250,249,0.3)]">
              <GlobeIcon />
            </span>
            <div className="flex items-center gap-1 rounded-lg border border-[rgba(168,162,158,0.15)] bg-[rgba(255,255,255,0.04)] p-0.5">
              {LANGUAGES.map((lang) => (
                <motion.button
                  key={lang.code}
                  id={`lang-switch-${lang.code}`}
                  onClick={() => setLanguage(lang.code)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${language === lang.code
                    ? 'bg-[var(--brand-500)] text-white shadow-sm'
                    : 'text-[rgba(250,250,249,0.4)] hover:text-[rgba(250,250,249,0.7)] hover:bg-[rgba(255,255,255,0.06)]'
                    }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-[rgba(250,250,249,0.3)]">
            <span>{t.footer.paymentsBy}</span>
            <span className="font-semibold text-[rgba(250,250,249,0.5)] ml-1">Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}