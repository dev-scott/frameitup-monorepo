'use client';

import { MessageCircle, ExternalLink } from 'lucide-react';
import { useFrame } from '@/context/FrameContext';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import type { DeliveryInfo, PriceBreakdown } from '@/types/frame';

interface Props {
  delivery: DeliveryInfo;
  price: PriceBreakdown;
}

const BUSINESS_WHATSAPP = '+2250700000000';

export default function WhatsAppButton({ delivery, price }: Props) {
  const { config } = useFrame();

  const handleClick = () => {
    const link = buildWhatsAppLink(BUSINESS_WHATSAPP, config, delivery, price);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      id="whatsapp-order-btn"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '14px 20px',
        borderRadius: 8,
        background: 'linear-gradient(135deg, #25d366, #128c7e)',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 700,
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        letterSpacing: '0.02em',
        boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 30px rgba(37,211,102,0.5)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.3)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Shimmer overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          backgroundSize: '200% auto',
          animation: 'shimmer 2s linear infinite',
          pointerEvents: 'none',
        }}
      />

      <MessageCircle size={20} />
      <span>Transmettre ma commande sur WhatsApp</span>
      <ExternalLink size={14} style={{ opacity: 0.7 }} />
    </button>
  );
}
