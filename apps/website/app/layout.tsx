import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Montserrat, Playfair_Display } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { ConvexClientProvider } from '@/lib/ConvexClientProvider';
import './globals.css';

// reduit la taille de la police

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' });


export const metadata: Metadata = {
  title: { default: 'FrameItUp — Premium Custom Frames', template: '%s | FrameItUp' },
  description: 'Design and order beautiful custom frames for your most cherished memories. Museum-quality, delivered in days.',
  keywords: ['custom frames', 'photo frames', 'museum quality', 'framed prints', 'wall art'],
  openGraph: {
    title: 'FrameItUp — Premium Custom Frames',
    description: 'Museum-quality custom frames, crafted and delivered in days.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ConvexClientProvider>
          <ThemeProvider >
            <Navbar />
            {children}
            <Footer />
            <WhatsAppButton />
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
