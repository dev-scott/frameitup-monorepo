'use client';

import { useState } from 'react';
import { ArrowRight, MessageCircle, Sliders } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { BOUTIQUE_PRODUCTS, BOUTIQUE_STYLES, type BoutiqueProduct } from '@/data/boutique';

const WA_NUMBER = '237658732446';

function formatFCFA(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

function buildWhatsAppUrl(product: BoutiqueProduct) {
  const msg = encodeURIComponent(
    `Bonjour FrameItUp 👋\n\nJe souhaite commander ce tableau :\n\n🖼️ *${product.title}*\n📐 ${product.dimensions}\n🖼 Moulure : ${product.mouldure}\n💰 ${formatFCFA(product.priceFCFA)}\n\nPouvez-vous me confirmer la disponibilité et les délais de livraison ? Merci !`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

export default function BoutiqueGallery() {
  const [activeStyle, setActiveStyle] = useState('Tous');

  // Chargement des produits depuis Convex
  const dbProducts = useQuery(api.queries.products.listAll, {});

  const allProducts: BoutiqueProduct[] = (dbProducts && dbProducts.length > 0)
    ? dbProducts.map((p: any) => ({
        id: p.slug || p._id,
        title: p.name,
        artist: p.attributes?.find((a: any) => a.key === 'artist')?.value || 'Collection FrameItUp',
        style: p.attributes?.find((a: any) => a.key === 'style')?.value || (p.tags?.[0] ?? 'Art Abstrait'),
        description: p.description || "Œuvre d'art fine art imprimée sur papier d'art.",
        imageUrl: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=90',
        dimensions: p.attributes?.find((a: any) => a.key === 'dimensions')?.value || '40 × 50 cm',
        mouldure: p.attributes?.find((a: any) => a.key === 'mouldure')?.value || 'Chêne naturel huilé',
        passepartout: p.attributes?.find((a: any) => a.key === 'passepartout')?.value || null,
        protection: p.attributes?.find((a: any) => a.key === 'protection')?.value || 'Verre antireflet minéral',
        priceFCFA: p.priceAmount,
        badge: p.isFeatured ? 'Bestseller' : undefined,
      }))
    : BOUTIQUE_PRODUCTS;

  const styles = Array.from(new Set(['Tous', ...allProducts.map(p => p.style).filter(Boolean)]));

  const filtered = activeStyle === 'Tous'
    ? allProducts
    : allProducts.filter(p => p.style === activeStyle);

  return (
    <div>
      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 48,
        }}
      >
        {styles.map(s => (
          <button
            key={s}
            onClick={() => setActiveStyle(s)}
            className={`chip ${activeStyle === s ? 'active' : ''}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div
        className="boutique-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }}
      >
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: 8 }}>
            Aucune œuvre dans cette catégorie
          </p>
          <button className="chip" onClick={() => setActiveStyle('Tous')}>
            Voir toutes les œuvres
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .boutique-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .boutique-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function ProductCard({ product }: { product: BoutiqueProduct }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 6,
        overflow: 'hidden',
        transition: 'box-shadow 0.22s ease, border-color 0.22s ease',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        borderColor: hovered ? 'var(--border-light)' : 'var(--border-hairline)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--bg-recessed)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        {/* Badge */}
        {product.badge && (
          <span
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: 'var(--accent)',
              color: 'var(--white)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: 2,
            }}
          >
            {product.badge}
          </span>
        )}
        {/* Style chip */}
        <span
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(26,23,20,0.72)',
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.625rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: 2,
            backdropFilter: 'blur(4px)',
          }}
        >
          {product.style}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 24px' }}>
        {/* Title row */}
        <div style={{ marginBottom: 12 }}>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--text-ink)',
              margin: '0 0 3px',
              letterSpacing: '-0.01em',
            }}
          >
            {product.title}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              color: 'var(--text-faint)',
              margin: 0,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {product.dimensions}
          </p>
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            margin: '0 0 16px',
          }}
        >
          {product.description}
        </p>

        {/* Specs */}
        <div
          style={{
            padding: '10px 12px',
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-hairline)',
            borderRadius: 4,
            marginBottom: 18,
          }}
        >
          {[
            { label: 'Moulure', value: product.mouldure },
            { label: 'Passe-partout', value: product.passepartout ?? 'Aucun' },
            { label: 'Protection', value: product.protection },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
                padding: '3px 0',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  color: 'var(--text-faint)',
                  flexShrink: 0,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  textAlign: 'right',
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.625rem',
                color: 'var(--text-faint)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 2,
              }}
            >
              Prix tout compris
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.375rem',
                fontWeight: 500,
                color: 'var(--text-ink)',
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}
            >
              {formatFCFA(product.priceFCFA)}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {(() => {
              const mLower = (product.mouldure || '').toLowerCase();
              const matchingMouldure = mLower.includes('acajou')
                ? 'acajou-rouge'
                : mLower.includes('noir') || mLower.includes('laque')
                ? 'laque-noir'
                : mLower.includes('argent') || mLower.includes('alu')
                ? 'aluminium-argent'
                : mLower.includes('weng')
                ? 'wenge-africain'
                : 'chene-naturel';
              const formatParam = (product.dimensions || '').includes('30 × 40') ? 'A3' : (product.dimensions || '').includes('50 × 70') ? 'A2' : 'A4';

              return (
                <Link
                  href={`/configurator?img=${encodeURIComponent(product.imageUrl)}&format=${formatParam}&mouldure=${matchingMouldure}&sample=${encodeURIComponent(product.id)}`}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '8px 12px', height: 38, gap: 5 }}
                  title="Personnaliser et commander en ligne"
                >
                  <Sliders size={13} />
                  Acheter
                </Link>
              );
            })()}
            <a
              href={buildWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#25D366',
                color: '#FFFFFF',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '8px 12px',
                height: 38,
                borderRadius: 4,
                textDecoration: 'none',
                transition: 'background 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#1DB954';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = '#25D366';
              }}
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
