'use client';

import { useRef, useState } from 'react';
import { Upload, Grid, X } from 'lucide-react';
import { useFrame } from '@/context/FrameContext';
import { SAMPLE_ARTWORKS } from '@/data/samples';
import { PRINT_FORMATS } from '@/data/formats';
import type { PrintFormat } from '@/types/frame';

export default function ImageUploader() {
  const { config, setImage, setMouldure, setFormat } = useFrame();
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [gallery, setGallery] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImage(URL.createObjectURL(file), file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const loadSample = (s: typeof SAMPLE_ARTWORKS[number]) => {
    setImage(s.imageUrl, null);
    setMouldure(s.recommendedMouldure);
    setFormat(s.recommendedFormat as PrintFormat);
    setGallery(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Drop zone / preview */}
      {!config.imageUrl ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          style={{
            border: `1px dashed ${drag ? 'var(--stone-900)' : 'var(--stone-300)'}`,
            borderRadius: 4,
            padding: '28px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: drag ? 'var(--stone-100)' : 'var(--stone-50)',
            transition: 'all 0.15s',
          }}
        >
          <Upload size={20} color="var(--stone-400)" style={{ margin: '0 auto 10px', display: 'block' }} />
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--stone-700)', margin: '0 0 4px', fontWeight: 500 }}>
            Glissez votre image ici
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--stone-400)', margin: 0 }}>
            JPEG · PNG · WebP — Max 10 MB
          </p>
          <input ref={inputRef} type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: 'none' }} />
        </div>
      ) : (
        <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', height: 130, background: 'var(--stone-100)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={config.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <button
            onClick={() => setImage(null, null)}
            style={{
              position: 'absolute', top: 8, right: 8,
              width: 26, height: 26, borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)', border: '1px solid var(--stone-200)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <X size={12} color="var(--stone-700)" />
          </button>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 10px', background: 'linear-gradient(transparent, rgba(28,25,23,0.5))' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              {config.imageFile?.name ?? 'Image chargée'}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => inputRef.current?.click()}
          className="btn btn-secondary"
          style={{ flex: 1, height: 36, fontSize: '0.8125rem', justifyContent: 'center' }}
        >
          <Upload size={13} />
          {config.imageUrl ? 'Changer' : 'Parcourir'}
        </button>
        <button
          onClick={() => setGallery(v => !v)}
          className="btn btn-secondary"
          style={{ flex: 1, height: 36, fontSize: '0.8125rem', justifyContent: 'center' }}
        >
          <Grid size={13} />
          Exemples
        </button>
      </div>

      {/* Sample gallery */}
      {gallery && (
        <div style={{ border: '1px solid var(--stone-200)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ padding: '8px 12px', background: 'var(--stone-50)', borderBottom: '1px solid var(--stone-200)' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--stone-500)', margin: 0 }}>
              Œuvres de démonstration
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--stone-200)' }}>
            {SAMPLE_ARTWORKS.map((s) => (
              <button
                key={s.id}
                onClick={() => loadSample(s)}
                style={{ aspectRatio: '1/1', overflow: 'hidden', cursor: 'pointer', padding: 0, border: 'none', background: 'none', display: 'block', position: 'relative' }}
                title={s.title}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.imageUrl} alt={s.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', display: 'block' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </button>
            ))}
          </div>
          <div style={{ padding: '8px 12px', background: 'var(--stone-50)', borderTop: '1px solid var(--stone-200)' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--stone-400)', margin: 0, fontStyle: 'italic' }}>
              Cliquer pour charger avec la configuration recommandée
            </p>
          </div>
        </div>
      )}

      {/* Format selector */}
      <div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--stone-400)', margin: '0 0 8px' }}>
          Format d&apos;impression
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {PRINT_FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`chip ${config.format === f.id ? 'active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
