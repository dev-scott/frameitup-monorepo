import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { FrameProvider } from '@/context/FrameContext';
import { ConvexClientProvider } from '@/lib/ConvexClientProvider';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

/* ── Replace G-XXXXXXXXXX with your real GA4 Measurement ID ────────────── */
const GA_ID = 'G-XXXXXXXXXX';

export const metadata: Metadata = {
  title: 'FrameItUp — Encadrement Artisanal Sur-Mesure',
  description:
    'Créez votre cadre sur-mesure en ligne ou commandez un tableau prêt à poser. Moulures bois noble FSC, impression Hahnemühle 250g, livraison partout en Afrique de l\'Ouest.',
  keywords: [
    'cadre photo', 'encadrement sur-mesure', 'cadre artistique', 'impression fine art',
    'moulure bois', 'passe-partout', 'boutique tableau', 'Abidjan', 'Dakar', 'Douala', 'FCFA',
  ],
  openGraph: {
    title: 'FrameItUp — Encadrement Artisanal Sur-Mesure',
    description: 'Cadres sur-mesure & tableaux prêts à poser — livraison en Afrique de l\'Ouest.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}
        </Script>
      </head>
      <body style={{ background: 'var(--bg-canvas)', color: 'var(--text-ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ConvexClientProvider>
          <FrameProvider>
            <Navbar />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
            <Footer />
            <WhatsAppButton />
          </FrameProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
