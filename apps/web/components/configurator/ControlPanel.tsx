'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useFrame } from '@/context/FrameContext';
import { MOULDURE_STYLES } from '@/data/frames';
import { PASSEPARTOUT_OPTIONS, GLASS_OPTIONS } from '@/data/materials';
import type { GlassType, FrameFinish, HangingType } from '@/types/frame';

/* ── Accordion section ──────────────────────────────────────────────────── */
function Section({
  title,
  badge,
  open: defaultOpen = false,
  children,
}: {
  title: string;
  badge?: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--border-hairline)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '15px 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-ink)',
              letterSpacing: '-0.005em',
            }}
          >
            {title}
          </span>
          {badge && (
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                color: 'var(--text-faint)',
                fontWeight: 400,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          color="var(--n-400)"
          style={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
        />
      </button>
      {open && <div style={{ paddingBottom: 20 }}>{children}</div>}
    </div>
  );
}

/* ── Radio card (protection / accrochage) ───────────────────────────────── */
function RadioCard({
  active,
  onClick,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '11px 13px',
        borderRadius: 4,
        border: `1px solid ${active ? 'var(--text-ink)' : 'var(--border-light)'}`,
        background: active ? 'var(--text-ink)' : 'var(--bg-surface)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.15s ease, background 0.15s ease',
        width: '100%',
      }}
    >
      {/* Radio indicator */}
      <span
        style={{
          marginTop: 2,
          width: 14,
          height: 14,
          borderRadius: '50%',
          border: `1.5px solid ${active ? 'var(--white)' : 'var(--border-medium)'}`,
          background: active ? 'var(--white)' : 'transparent',
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.15s, background 0.15s',
        }}
      >
        {active && (
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--text-ink)',
            }}
          />
        )}
      </span>

      <div style={{ flex: 1 }}>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: active ? 'var(--white)' : 'var(--text-ink)',
            display: 'block',
            marginBottom: 2,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            color: active ? 'rgba(255,255,255,0.55)' : 'var(--text-faint)',
            display: 'block',
            lineHeight: 1.4,
          }}
        >
          {sub}
        </span>
      </div>
    </button>
  );
}

/* ── Range with label ───────────────────────────────────────────────────── */
function RangeRow({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
  minLabel,
  maxLabel,
}: {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  minLabel?: string;
  maxLabel?: string;
}) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8125rem',
            color: 'var(--text-ink)',
            fontWeight: 500,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      {(minLabel || maxLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--text-faint)' }}>
            {minLabel}
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--text-faint)' }}>
            {maxLabel}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function ControlPanel() {
  const {
    config,
    setMouldure,
    setPassepartout,
    setPassepartoutWidth,
    setGlass,
    setFinish,
    setHanging,
    setGlassReflect,
  } = useFrame();

  const selectedMouldure = MOULDURE_STYLES.find(m => m.id === config.mouldureId);

  return (
    <div>

      {/* ── Moulure ── */}
      <Section title="Moulure" badge={selectedMouldure?.name} open>
        {/* Swatch grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10,
            marginBottom: 14,
          }}
        >
          {MOULDURE_STYLES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMouldure(m.id)}
              title={m.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 7,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 2,
              }}
            >
              <div
                className={`swatch ${config.mouldureId === m.id ? 'active' : ''}`}
                style={{
                  width: 40,
                  height: 40,
                  background: m.swatchGradient,
                  borderRadius: 3,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.625rem',
                  color: config.mouldureId === m.id ? 'var(--text-ink)' : 'var(--text-faint)',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  maxWidth: 54,
                  fontWeight: config.mouldureId === m.id ? 500 : 400,
                  transition: 'color 0.15s',
                }}
              >
                {m.name}
              </span>
            </button>
          ))}
        </div>

        {/* Selected description */}
        {selectedMouldure && (
          <div
            style={{
              padding: '10px 14px',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 4,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                margin: '0 0 4px',
                lineHeight: 1.55,
              }}
            >
              {selectedMouldure.description}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                color: 'var(--text-faint)',
                margin: 0,
              }}
            >
              {selectedMouldure.widthMm}mm large · {selectedMouldure.depthMm}mm profondeur
            </p>
          </div>
        )}
      </Section>

      {/* ── Passe-partout ── */}
      <Section
        title="Passe-partout"
        badge={
          config.passepartoutId
            ? PASSEPARTOUT_OPTIONS.find(p => p.id === config.passepartoutId)?.name
            : 'Aucun'
        }
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          <button onClick={() => setPassepartout(null)} className={`chip ${!config.passepartoutId ? 'active' : ''}`}>
            Aucun
          </button>
          {PASSEPARTOUT_OPTIONS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPassepartout(p.id)}
              className={`chip ${config.passepartoutId === p.id ? 'active' : ''}`}
              style={{ gap: 8 }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: p.colorHex,
                  border: '1px solid rgba(0,0,0,0.12)',
                  flexShrink: 0,
                }}
              />
              {p.name}
            </button>
          ))}
        </div>

        {config.passepartoutId && (
          <RangeRow
            label="Largeur du biseau"
            value={config.passepartoutWidthMm}
            displayValue={`${config.passepartoutWidthMm} mm`}
            min={15}
            max={80}
            step={5}
            onChange={setPassepartoutWidth}
            minLabel="15 mm"
            maxLabel="80 mm"
          />
        )}
      </Section>

      {/* ── Protection ── */}
      <Section title="Protection" badge={GLASS_OPTIONS.find(g => g.id === config.glassType)?.name}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          {GLASS_OPTIONS.map((g) => (
            <RadioCard
              key={g.id}
              active={config.glassType === g.id}
              onClick={() => setGlass(g.id as GlassType)}
              label={g.name}
              sub={g.description}
            />
          ))}
        </div>
        <RangeRow
          label="Intensité des reflets"
          value={config.glassReflectIntensity}
          displayValue={`${Math.round(config.glassReflectIntensity * 100)}%`}
          min={0}
          max={1}
          step={0.05}
          onChange={setGlassReflect}
          minLabel="Aucun"
          maxLabel="Max"
        />
      </Section>

      {/* ── Finition ── */}
      <Section title="Finition" badge={config.finish}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['mat', 'satin', 'brillant'] as FrameFinish[]).map(f => (
            <button
              key={f}
              onClick={() => setFinish(f)}
              className={`chip ${config.finish === f ? 'active' : ''}`}
              style={{ textTransform: 'capitalize' }}
            >
              {f}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Accrochage ── */}
      <Section title="Accrochage" badge={hangingLabel(config.hangingType)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(
            [
              { id: 'fil-metallique',   label: 'Fil métallique',      desc: 'Câble acier inox, universel et discret' },
              { id: 'oeillet-double',   label: 'Œillets doubles',     desc: 'Vissé dans la baguette, très solide' },
              { id: 'entretoise-acier', label: 'Entretoises acier',   desc: 'Effet flottant, idéal plexiglas' },
            ] as const
          ).map(h => (
            <RadioCard
              key={h.id}
              active={config.hangingType === h.id}
              onClick={() => setHanging(h.id as HangingType)}
              label={h.label}
              sub={h.desc}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

function hangingLabel(type: string): string {
  const map: Record<string, string> = {
    'fil-metallique':   'Fil métallique',
    'oeillet-double':   'Œillets doubles',
    'entretoise-acier': 'Entretoises acier',
  };
  return map[type] ?? type;
}
