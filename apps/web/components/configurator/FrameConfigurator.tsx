'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Monitor, Home, Box, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useFrame } from '@/context/FrameContext';
import ImageUploader from './ImageUploader';
import ControlPanel from './ControlPanel';
import StudioCanvas from './StudioCanvas';
import RoomView from './RoomView';
import PriceSummary from './PriceSummary';
import type { ConfiguratorTab, PrintFormat } from '@/types/frame';

const OrbitViewer = dynamic(() => import('./OrbitViewer'), { ssr: false });

const TABS: { id: ConfiguratorTab; label: string; icon: React.ReactNode }[] = [
  { id: 'studio',    label: 'Studio',    icon: <Monitor size={13} /> },
  { id: 'room-view', label: 'Mise en situation', icon: <Home size={13} /> },
  { id: 'orbit-3d',  label: 'Vue 3D',    icon: <Box size={13} /> },
];

function ConfiguratorUrlSync() {
  const searchParams = useSearchParams();
  const { setImage, setFormat, setMouldure } = useFrame();
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    const imgParam = searchParams.get('img');
    const formatParam = searchParams.get('format');
    const mouldureParam = searchParams.get('mouldure');

    if (imgParam) {
      setImage(decodeURIComponent(imgParam), null);
      loadedRef.current = true;
    }
    if (formatParam && ['A5', 'A4', 'A3', 'A2'].includes(formatParam)) {
      setFormat(formatParam as PrintFormat);
    }
    if (mouldureParam) {
      setMouldure(mouldureParam);
    }
  }, [searchParams, setImage, setFormat, setMouldure]);

  return null;
}

export default function FrameConfigurator() {
  const [tab, setTab] = useState<ConfiguratorTab>('studio');
  const { reset } = useFrame();

  return (
    <div style={{ minHeight: '100dvh', paddingTop: 64, background: 'var(--stone-50)' }}>
      <Suspense fallback={null}>
        <ConfiguratorUrlSync />
      </Suspense>

      {/* ── Sub-header ── */}
      <div style={{ height: 52, borderBottom: '1px solid var(--border-hairline)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link
              href="/"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--stone-500)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--stone-900)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--stone-500)')}
            >
              <ArrowLeft size={14} />
              Retour
            </Link>
            <span style={{ width: 1, height: 16, background: 'var(--stone-200)' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--text-body)', fontWeight: 500, letterSpacing: '-0.005em' }}>
              Configurateur
            </span>
          </div>
          <button
            onClick={reset}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--stone-500)',
              background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--stone-900)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--stone-500)')}
          >
            <RotateCcw size={13} />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div
        className="container"
        style={{ paddingTop: 32, paddingBottom: 64, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}
        id="configurator-layout"
      >
        {/* Left column: controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Step 1: Image */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--stone-200)', borderRadius: 6, padding: 24 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone-400)', margin: '0 0 18px' }}>
              Étape 1 — Votre image
            </p>
            <ImageUploader />
          </div>

          {/* Step 2: Options */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--stone-200)', borderRadius: 6, marginTop: 8, padding: 24 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone-400)', margin: '0 0 4px' }}>
              Étape 2 — Configuration
            </p>
            <ControlPanel />
          </div>
        </div>

        {/* Right column: preview + price */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'sticky', top: 128 }}>

          {/* Preview card */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--stone-200)', borderRadius: 6, overflow: 'hidden' }}>
            {/* Tab bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-hairline)' }}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    flex: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    padding: '10px 6px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `2px solid ${tab === t.id ? 'var(--text-ink)' : 'transparent'}`,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)', fontSize: '0.73rem', fontWeight: tab === t.id ? 500 : 400,
                    color: tab === t.id ? 'var(--text-ink)' : 'var(--text-faint)',
                    transition: 'color 0.15s ease, border-color 0.15s ease',
                    marginBottom: -1,
                    letterSpacing: '0.01em',
                  }}
                >
                  {t.icon}
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Canvas */}
            <div
              style={{
                background: 'var(--bg-subtle)',
                minHeight: 360,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {tab === 'studio'    && <StudioCanvas />}
              {tab === 'room-view' && <RoomView />}
              {tab === 'orbit-3d'  && (
                <Suspense fallback={<p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--stone-400)' }}>Chargement 3D…</p>}>
                  <OrbitViewer />
                </Suspense>
              )}
            </div>
          </div>

          {/* Price */}
          <PriceSummary />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #configurator-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
