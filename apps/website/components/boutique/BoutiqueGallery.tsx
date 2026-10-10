'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { BOUTIQUE_PRODUCTS, type BoutiqueProduct } from '@/data/boutique';

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

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function BoutiqueGallery() {
  const [activeStyle, setActiveStyle] = useState('Tous');

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
  const filtered = activeStyle === 'Tous' ? allProducts : allProducts.filter(p => p.style === activeStyle);

  return (
    <div>
      {/* Filter pills */}
      <div className="boutique-filters">
        {styles.map(s => (
          <button
            key={s}
            onClick={() => setActiveStyle(s)}
            className={`boutique-filter-pill ${activeStyle === s ? 'active' : ''}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="boutique-grid">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="boutique-empty">
          <p>Aucune œuvre dans cette catégorie</p>
          <button className="boutique-filter-pill active" onClick={() => setActiveStyle('Tous')}>
            Voir toutes les œuvres
          </button>
        </div>
      )}

      <style>{`
        .boutique-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }
        .boutique-filter-pill {
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 0.8125rem;
          font-weight: 500;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .boutique-filter-pill:hover {
          border-color: var(--brand-400);
          color: var(--brand-500);
          background: var(--bg-secondary);
        }
        .boutique-filter-pill.active {
          background: var(--brand-500);
          border-color: var(--brand-500);
          color: #fff;
        }
        .boutique-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .boutique-empty {
          text-align: center;
          padding: 80px 0;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          font-size: 1.125rem;
        }
        @media (max-width: 1024px) {
          .boutique-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 580px) {
          .boutique-grid { grid-template-columns: 1fr; }
          .boutique-filters { gap: 6px; }
        }
      `}</style>
    </div>
  );
}

function ProductCard({ product }: { product: BoutiqueProduct }) {
  const [hovered, setHovered] = useState(false);

  const BADGE_COLORS: Record<string, string> = {
    Bestseller: 'var(--brand-500)',
    Nouveau: '#10b981',
    'Grand format': '#6366f1',
    'Édition limitée': '#ec4899',
    'Coup de cœur': '#f43f5e',
  };
  const badgeColor = product.badge ? (BADGE_COLORS[product.badge] || 'var(--brand-500)') : 'var(--brand-500)';

  return (
    <div
      className="boutique-card"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        borderColor: hovered ? 'var(--brand-400)' : 'var(--border)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}
        />
        {/* Overlay gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }} />

        {/* Badge */}
        {product.badge && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            background: badgeColor, color: '#fff',
            fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '3px 10px', borderRadius: 999,
          }}>
            {product.badge}
          </span>
        )}

        {/* Style tag */}
        <span style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(15,14,13,0.65)', color: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(6px)',
          fontSize: '0.65rem', fontWeight: 500,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '3px 10px', borderRadius: 999,
        }}>
          {product.style}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 22px' }}>
        <div style={{ marginBottom: 10 }}>
          <h3 style={{
            fontSize: '1.0625rem', fontWeight: 600,
            color: 'var(--text-primary)', margin: '0 0 2px',
            fontFamily: 'var(--font-playfair)',
            letterSpacing: '-0.01em',
          }}>
            {product.title}
          </h3>
          <p style={{
            fontSize: '0.75rem', color: 'var(--text-muted)',
            margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            {product.dimensions} · {product.artist}
          </p>
        </div>

        <p style={{
          fontSize: '0.8125rem', lineHeight: 1.65,
          color: 'var(--text-secondary)', margin: '0 0 14px',
        }}>
          {product.description}
        </p>

        {/* Specs */}
        <div style={{
          padding: '10px 12px',
          background: 'var(--bg-secondary)',
          borderRadius: 8,
          marginBottom: 16,
        }}>
          {[
            { label: 'Moulure', value: product.mouldure },
            { label: 'Passe-partout', value: product.passepartout ?? 'Aucun' },
            { label: 'Protection', value: product.protection },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', gap: 8, padding: '3px 0',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div>
            <p style={{
              fontSize: '0.625rem', color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2,
            }}>
              Prix tout compris
            </p>
            <p style={{
              fontSize: '1.25rem', fontWeight: 700,
              color: 'var(--brand-500)', lineHeight: 1,
              fontFamily: 'var(--font-playfair)',
            }}>
              {formatFCFA(product.priceFCFA)}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <Link
              href={`/configure`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '8px 12px', borderRadius: 10,
                border: '1px solid var(--border-strong)',
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem', fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              title="Personnaliser ce cadre"
            >
              Personnaliser
            </Link>
            <a
              href={buildWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#25D366', color: '#fff',
                fontSize: '0.75rem', fontWeight: 600,
                padding: '8px 14px', borderRadius: 10,
                textDecoration: 'none',
                transition: 'background 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1aad52'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#25D366'; }}
            >
              <WhatsAppIcon />
              Commander
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

