'use client';

import { useState } from 'react';
import { useFrame } from '@/context/FrameContext';
import type { RoomScene } from '@/types/frame';
import { getMouldureById } from '@/data/frames';
import { getFormatById } from '@/data/formats';

const ROOMS: { id: RoomScene; label: string; wall: string; floor: string }[] = [
  { id: 'salon-scandinave', label: 'Salon',   wall: '#EEEBE5', floor: '#C9C2B8' },
  { id: 'galerie-art',      label: 'Galerie', wall: '#F4F3F1', floor: '#E2DFDA' },
  { id: 'bureau-chene',     label: 'Bureau',  wall: '#E8E0D0', floor: '#B09878' },
];

export default function RoomView() {
  const { config } = useFrame();
  const [room, setRoom] = useState<RoomScene>('salon-scandinave');
  const format   = getFormatById(config.format);
  const mouldure = getMouldureById(config.mouldureId);

  const maxW  = 200;
  const scale = Math.min(maxW / (format.widthCm * 6), 1);
  const fW    = format.widthCm * 6 * scale;
  const fH    = format.heightCm * 6 * scale;
  const mW    = Math.max((mouldure.widthMm / 10) * 6 * scale, 7);
  const ppW   = config.passepartoutId ? Math.max((config.passepartoutWidthMm / 10) * 6 * scale, 5) : 0;

  const current = ROOMS.find(r => r.id === room) ?? ROOMS[0];

  const ppHex = config.passepartoutId
    ? (config.passepartoutId === 'noir-graphite' ? '#1a1a1a' : config.passepartoutId === 'creme' ? '#f5f0de' : '#f8f5f0')
    : '#f8f5f0';

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Scene */}
      <div
        style={{
          height: 340,
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(180deg, ${current.wall} 0%, ${current.wall} 55%, ${current.floor} 55%)`,
        }}
      >
        {/* Baseboard */}
        <div style={{ position: 'absolute', top: '55%', left: 0, right: 0, height: 2, background: 'rgba(0,0,0,0.06)' }} />

        {/* Frame */}
        <div style={{ position: 'absolute', top: '14%', left: '50%', transform: 'translateX(-50%)' }}>
          <div
            style={{
              width: fW + mW * 2,
              height: fH + mW * 2,
              background: mouldure.swatchGradient,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: fW + ppW * 2,
                height: fH + ppW * 2,
                background: ppHex,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {config.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={config.imageUrl} alt="" style={{ width: fW, height: fH, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: fW, height: fH, background: 'var(--stone-200)' }} />
              )}
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: 6, fontFamily: 'var(--font-sans)', fontSize: '0.625rem', color: 'rgba(0,0,0,0.3)' }}>
            {format.label} · {format.widthCm}×{format.heightCm}cm
          </p>
        </div>
      </div>

      {/* Room tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {ROOMS.map(r => (
          <button key={r.id} onClick={() => setRoom(r.id)} className={`chip ${room === r.id ? 'active' : ''}`}>
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
