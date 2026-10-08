'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useFrameStore } from '@/store/use-frame-store';
import { Button } from '@frameitup/ui';
import { useLanguageStore } from '@/store/use-language-store';

// ─── Zero-Dependency Canvas Confetti Engine ────────────────────────
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Resize Handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class
    class Particle {
      x: number = Math.random() * width;
      y: number = Math.random() * -height - 20;
      size: number = Math.random() * 6 + 4;
      color: string = ['#d98d2e', '#e4a44a', '#faefd9', '#a35a1c', '#3D2B1A', '#FAFAF9'][
        Math.floor(Math.random() * 6)
      ]!;
      speedX: number = Math.random() * 3 - 1.5;
      speedY: number = Math.random() * 4 + 3;
      rotation: number = Math.random() * 360;
      rotationSpeed: number = Math.random() * 4 - 2;

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Reset particles that fall off bottom
        if (this.y > height) {
          this.y = -20;
          this.x = Math.random() * width;
        }
      }

      draw() {
        ctx!.save();
        ctx!.translate(this.x, this.y);
        ctx!.rotate((this.rotation * Math.PI) / 180);
        ctx!.fillStyle = this.color;
        ctx!.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx!.restore();
      }
    }

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push(new Particle());
    }

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup after 6 seconds to prevent performance leak
    const timer = setTimeout(() => {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, width, height);
    }, 6000);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      clearTimeout(timer);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full" />;
}

// ─── Success Confirmation Page ─────────────────────────────────────
export default function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetStore = useFrameStore((state) => state.reset);
  const { t, language } = useLanguageStore();

  const orderId = searchParams.get('orderId') ?? 'ORDER-ID';
  const trackingNumber = searchParams.get('tracking') ?? 'FRM-000000';
  const total = searchParams.get('total') ?? '0.00';
  const method = searchParams.get('method') ?? '';
  const email = searchParams.get('email') ?? '';

  const isCod = method === 'CASH_ON_DELIVERY';

  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    // Reset Zustand store so cart/editor is cleared for new designs
    resetStore();

    // Calculate delivery date estimation (7 days out)
    const date = new Date();
    date.setDate(date.getDate() + 7);
    setDateStr(date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
  }, [resetStore, language]);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-24 px-6 md:px-12 flex items-center justify-center relative overflow-hidden">
      {/* Confetti animation */}
      <ConfettiCanvas />

      <div className="max-w-xl w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-8 md:p-12 text-center shadow-lg relative z-10 space-y-8">
        
        {/* Success Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center border border-emerald-200">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        {/* Messaging */}
        <div className="space-y-3">
          <span className="text-xs font-semibold tracking-widest text-[var(--brand-500)] uppercase">{t.successPage.badge}</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {t.successPage.title}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {t.successPage.desc}
          </p>
        </div>

        {/* Details Box */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 text-left space-y-4">
          <div className="flex justify-between border-b border-[var(--border)] pb-3 text-xs">
            <span className="font-bold text-[var(--text-muted)]">{t.successPage.orderId}</span>
            <span className="font-semibold text-stone-700 dark:text-stone-300 select-all font-mono">{orderId}</span>
          </div>

          <div className="flex justify-between border-b border-[var(--border)] pb-3 text-xs">
            <span className="font-bold text-[var(--text-muted)]">{t.successPage.tracking}</span>
            <span className="font-semibold text-[var(--brand-600)] select-all font-mono">{trackingNumber}</span>
          </div>

          <div className="flex justify-between border-b border-[var(--border)] pb-3 text-xs">
            <span className="font-bold text-[var(--text-muted)]">{t.successPage.paymentMode}</span>
            <span className="font-bold text-stone-700 dark:text-stone-300 font-mono">
              {isCod 
                ? (language === 'fr' ? 'Paiement à la livraison (COD)' : 'Pay on Delivery (COD)') 
                : (language === 'fr' ? 'Payé en ligne (CinetPay)' : 'Paid Online (CinetPay)')}
            </span>
          </div>

          <div className="flex justify-between border-b border-[var(--border)] pb-3 text-xs">
            <span className="font-bold text-[var(--text-muted)]">{t.successPage.totalAmount}</span>
            <span className="font-bold text-stone-700 dark:text-stone-300 font-mono">{Number(total).toLocaleString('fr-FR')} FCFA</span>
          </div>

          <div className="flex justify-between text-xs pt-1">
            <span className="font-bold text-[var(--text-muted)]">{t.successPage.estimatedDelivery}</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">{dateStr || t.successPage.calculating}</span>
          </div>
        </div>

        {/* Tracking info */}
        <div className="text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-6 space-y-2">
          {isCod ? (
            <p className="text-amber-600 dark:text-amber-400 font-semibold">
              ⚠️ {t.successPage.codWarning.replace('{total}', `${Number(total).toLocaleString('fr-FR')} FCFA`)}
            </p>
          ) : (
            <p className="text-emerald-600 dark:text-emerald-500 font-semibold">
              ✓ {t.successPage.onlineSuccess}
            </p>
          )}
          <p>{t.successPage.invoiceSent}</p>
          <p>{t.successPage.statusTrack}</p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            onClick={() => router.push(email ? `/orders?email=${encodeURIComponent(email)}` : '/orders')}
            className="flex-1 bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white font-bold rounded-xl py-3 shadow-brand hover:shadow-brand-lg"
          >
            {t.successPage.trackBtn}
          </Button>
          <Button
            onClick={() => router.push('/configure')}
            className="flex-1 border border-[var(--border)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold rounded-xl py-3"
          >
            {t.successPage.designAnother}
          </Button>
        </div>

      </div>
    </main>
  );
}
