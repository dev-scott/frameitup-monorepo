'use client';

import { useState, useEffect } from 'react';
import { X, Smartphone, CheckCircle } from 'lucide-react';
import { formatFCFA } from '@/utils/pricing';

interface Props {
  method: 'mtn-momo' | 'orange-money';
  amount: number;
  phone: string;
  onClose: () => void;
  onPaymentSuccess?: (method: 'mtn-momo' | 'orange-money') => Promise<string | void>;
}

type SimStep = 'dialing' | 'menu' | 'confirm' | 'processing' | 'success';

export default function MobileMoneySimulator({ method, amount, phone, onClose, onPaymentSuccess }: Props) {
  const [simStep, setSimStep] = useState<SimStep>('dialing');
  const [inputPin, setInputPin] = useState('');
  const [orderRef, setOrderRef] = useState<string>('');

  const isMTN = method === 'mtn-momo';
  const ussdCode = isMTN ? '*144#' : '#144#';
  const providerColor = isMTN ? '#f5c518' : '#ff6600';
  const providerName = isMTN ? 'MTN Mobile Money' : 'Orange Money';

  useEffect(() => {
    if (simStep === 'dialing') {
      const t = setTimeout(() => setSimStep('menu'), 1200);
      return () => clearTimeout(t);
    }
    if (simStep === 'processing') {
      let isMounted = true;
      (async () => {
        let createdRef = '';
        if (onPaymentSuccess) {
          try {
            const res = await onPaymentSuccess(method);
            if (typeof res === 'string') createdRef = res;
          } catch (err) {
            console.error('Erreur confirmation paiement:', err);
          }
        }
        if (!isMounted) return;
        if (createdRef) setOrderRef(createdRef);
        setSimStep('success');
        try {
          const confetti = (await import('canvas-confetti')).default;
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: [providerColor, '#c9a96e', '#ffffff'],
          });
        } catch {
          // ignore confetti on unsupported environments
        }
      })();
      return () => { isMounted = false; };
    }
  }, [simStep, providerColor, method, onPaymentSuccess]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(245,240,232,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          background: '#FFFFFF',
          border: `1px solid ${providerColor}33`,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: `0 0 60px ${providerColor}20, 0 20px 60px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Phone header */}
        <div
          style={{
            background: providerColor,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Smartphone size={18} color="#000" />
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#000', fontFamily: 'Inter, sans-serif' }}>
              {providerName}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#000' }}
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* USSD Screen */}
        <div
          style={{
            background: '#0d1a0d',
            margin: '20px',
            borderRadius: 10,
            padding: '20px',
            minHeight: '200px',
            border: '1px solid rgba(255,255,255,0.05)',
            fontFamily: '"Courier New", monospace',
            fontSize: '0.875rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {simStep === 'dialing' && (
            <div style={{ color: '#8aff8a', textAlign: 'center', paddingTop: 40 }}>
              <p style={{ margin: 0 }}>Composition de {ussdCode}…</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#8aff8a',
                      animation: `bounce 1s ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {simStep === 'menu' && (
            <div style={{ color: '#8aff8a' }}>
              <p style={{ color: providerColor, fontWeight: 700, margin: '0 0 8px' }}>
                {providerName}
              </p>
              <p style={{ margin: '0 0 4px' }}>1. Envoyer de l&apos;argent</p>
              <p style={{ margin: '0 0 4px', color: providerColor }}>2. Payer une facture ←</p>
              <p style={{ margin: '0 0 4px' }}>3. Retrait</p>
              <p style={{ margin: '0 0 4px' }}>4. Solde</p>
              <p style={{ margin: '12px 0 0', fontSize: '0.75rem', color: '#5a5a5a' }}>
                Sélectionner : 2
              </p>
            </div>
          )}

          {simStep === 'confirm' && (
            <div style={{ color: '#8aff8a' }}>
              <p style={{ color: providerColor, fontWeight: 700, margin: '0 0 10px' }}>
                Confirmation de paiement
              </p>
              <p style={{ margin: '0 0 4px' }}>Bénéficiaire : FrameItUp</p>
              <p style={{ margin: '0 0 4px' }}>Montant : {formatFCFA(amount)}</p>
              <p style={{ margin: '0 0 12px' }}>Depuis : {phone || '+225 07 XX XX XX'}</p>
              <p style={{ margin: '0 0 4px' }}>Entrez votre PIN :</p>
              <input
                type="password"
                maxLength={4}
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                placeholder="_ _ _ _"
                style={{
                  background: 'transparent',
                  border: `1px solid ${providerColor}`,
                  borderRadius: 4,
                  padding: '6px 10px',
                  color: '#8aff8a',
                  fontFamily: '"Courier New", monospace',
                  fontSize: '1.25rem',
                  letterSpacing: '0.5em',
                  width: '100%',
                  outline: 'none',
                }}
                id="ussd-pin-input"
              />
            </div>
          )}

          {simStep === 'processing' && (
            <div style={{ color: '#8aff8a', textAlign: 'center', paddingTop: 40 }}>
              <p style={{ margin: 0, color: providerColor }}>Traitement en cours…</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: providerColor,
                      animation: `bounce 0.7s ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#5a5a5a', marginTop: 16 }}>
                Ne pas fermer cette fenêtre
              </p>
            </div>
          )}

          {simStep === 'success' && (
            <div style={{ color: '#8aff8a', textAlign: 'center', paddingTop: 20 }}>
              <CheckCircle size={48} color="#4caf78" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ color: '#4caf78', fontWeight: 700, fontSize: '1rem', margin: '0 0 8px' }}>
                Paiement réussi !
              </p>
              <p style={{ margin: '0 0 4px', fontSize: '0.8rem' }}>
                {formatFCFA(amount)} débité
              </p>
              <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#5a5a5a' }}>
                Réf : {orderRef || `FIU${Date.now().toString().slice(-6)}`}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#5a5a5a', marginTop: 12 }}>
                SMS de confirmation envoyé
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {simStep === 'menu' && (
            <button
              onClick={() => setSimStep('confirm')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 8,
                background: providerColor,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#000',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Sélectionner &ldquo;Payer une facture&rdquo;
            </button>
          )}

          {simStep === 'confirm' && (
            <button
              onClick={() => { if (inputPin.length >= 4) setSimStep('processing'); }}
              disabled={inputPin.length < 4}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 8,
                background: inputPin.length >= 4 ? providerColor : '#2e2820',
                border: 'none',
                cursor: inputPin.length >= 4 ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: inputPin.length >= 4 ? '#000' : '#5a4e42',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease',
              }}
              id="confirm-payment-btn"
            >
              Confirmer le paiement
            </button>
          )}

          {simStep === 'success' && (
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 8,
                background: '#4caf78',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Fermer &amp; voir la confirmation
            </button>
          )}

          {simStep !== 'success' && (
            <button
              onClick={onClose}
              className="btn btn-ghost"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.8125rem' }}
            >
              Annuler
            </button>
          )}
        </div>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
