'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useFrame } from '@/context/FrameContext';
import { calculatePrice, formatFCFA } from '@/utils/pricing';
import { getFormatById } from '@/data/formats';
import { getMouldureById } from '@/data/frames';

export default function PriceSummary() {
  const { config } = useFrame();
  const format   = getFormatById(config.format);
  const mouldure = getMouldureById(config.mouldureId);
  const price    = calculatePrice(config, 2000);

  const totalRef  = useRef<HTMLSpanElement>(null);
  const prevTotal = useRef(price.total);

  useEffect(() => {
    const from = prevTotal.current;
    const to   = price.total;
    const dur  = 350;
    const t0   = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const v = Math.round(from + (to - from) * (1 - (1 - p) ** 3));
      if (totalRef.current) totalRef.current.textContent = formatFCFA(v);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    prevTotal.current = to;
  }, [price.total]);

  const lines = [
    { label: `Impression ${format.label}`, value: price.impression },
    { label: `Moulure ${mouldure.name}`, value: price.mouldure },
    ...(price.passepartout > 0 ? [{ label: 'Passe-partout', value: price.passepartout }] : []),
    ...(price.verre > 0 ? [{ label: 'Protection', value: price.verre }] : []),
    { label: 'Accrochage', value: price.accrochage },
    { label: 'Livraison (Abidjan)', value: price.livraison },
  ];

  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--stone-200)', borderRadius: 6, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--stone-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--stone-900)' }}>
          Récapitulatif
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--stone-400)' }}>
          Prix en temps réel
        </span>
      </div>

      {/* Lines */}
      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {lines.map(({ label, value }, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--stone-500)' }}>{label}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--stone-700)', fontWeight: 500 }}>{formatFCFA(value)}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid var(--stone-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--stone-900)' }}>Total</span>
        <span ref={totalRef} style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500, color: 'var(--stone-900)' }}>
          {formatFCFA(price.total)}
        </span>
      </div>

      {/* CTA */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid var(--stone-100)' }}>
        <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 44 }}>
          Commander
          <ArrowRight size={15} />
        </Link>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--stone-400)', margin: '10px 0 0', textAlign: 'center' }}>
          Livraison sous 3 jours ouvrables
        </p>
      </div>
    </div>
  );
}
