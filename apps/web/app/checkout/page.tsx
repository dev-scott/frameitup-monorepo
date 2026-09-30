'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export default function CheckoutPage() {
  return (
    <div style={{ minHeight: '100dvh', paddingTop: 64, background: 'var(--stone-50)' }}>
      {/* Sub-header */}
      <div style={{ height: 52, borderBottom: '1px solid var(--stone-200)', background: 'var(--white)', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            href="/configurator"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--stone-500)', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--stone-900)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--stone-500)')}
          >
            <ArrowLeft size={14} />
            Retour au configurateur
          </Link>
          <span style={{ width: 1, height: 16, background: 'var(--stone-200)' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--stone-700)', fontWeight: 500 }}>
            Commander
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone-400)', margin: '0 0 8px' }}>
            Commande
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 500, color: 'var(--stone-900)', margin: 0, letterSpacing: '-0.015em' }}>
            Finaliser ma commande
          </h1>
        </div>
        <CheckoutForm />
      </div>
    </div>
  );
}
