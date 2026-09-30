'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Truck, Zap, CheckCircle2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useFrame } from '@/context/FrameContext';
import { DELIVERY_CITIES } from '@/data/cities';
import { calculatePrice, formatFCFA } from '@/utils/pricing';
import { getMouldureById } from '@/data/frames';
import { getFormatById } from '@/data/formats';
import type { DeliveryInfo, PaymentMethod } from '@/types/frame';

const MobileMoneySimulator = dynamic(() => import('./MobileMoneySimulator'), { ssr: false });

const EMPTY: DeliveryInfo = {
  firstName: '', lastName: '', email: '', phone: '', whatsapp: '',
  city: 'abidjan', quartier: '', address: '',
  deliveryType: 'standard', paymentMethod: 'cash-delivery',
};

type Step = 'summary' | 'delivery' | 'payment';

const L: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: 7,
};

export default function CheckoutForm() {
  const { config } = useFrame();
  const [step, setStep] = useState<Step>('summary');
  const [info, setInfo] = useState<DeliveryInfo>(EMPTY);
  const [errs, setErrs] = useState<Partial<Record<keyof DeliveryInfo, string>>>({});
  const [momoOpen, setMomoOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
  } | null>(null);

  const createOrder = useMutation(api.mutations.orders.create);
  const generateUploadUrl = useMutation(api.mutations.files.generateUploadUrl);

  const city     = DELIVERY_CITIES.find(c => c.id === info.city) ?? DELIVERY_CITIES[0];
  const livFCFA  = info.deliveryType === 'express' ? city.deliveryExpress : city.deliveryStandard;
  const price    = calculatePrice(config, livFCFA);
  const format   = getFormatById(config.format);
  const mouldure = getMouldureById(config.mouldureId);

  const upd = <K extends keyof DeliveryInfo>(k: K, v: DeliveryInfo[K]) => {
    setInfo(p => ({ ...p, [k]: v }));
    setErrs(p => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e: typeof errs = {};
    if (!info.firstName) e.firstName = 'Requis';
    if (!info.lastName)  e.lastName  = 'Requis';
    if (!info.phone)     e.phone     = 'Requis';
    if (!info.quartier)  e.quartier  = 'Requis';
    if (!info.address)   e.address   = 'Requis';
    setErrs(e);
    return !Object.keys(e).length;
  };

  const handleCreateOrder = async (overridePaymentStatus?: 'pending' | 'paid'): Promise<string> => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const clientEmail = (info.email && info.email.trim())
        ? info.email.trim()
        : `${info.phone.replace(/[^0-9]/g, '') || 'client'}@frameitup.ci`;

      const pStatus = overridePaymentStatus ?? (info.paymentMethod === 'cash-delivery' ? 'pending' : 'paid');

      let storageId: string | undefined = undefined;

      // Si le client a téléversé une image, on la stocke directement dans Convex Storage
      if (config.imageFile) {
        try {
          const uploadUrl = await generateUploadUrl();
          const uploadRes = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': config.imageFile.type },
            body: config.imageFile,
          });
          if (uploadRes.ok) {
            const uploadJson = await uploadRes.json();
            storageId = uploadJson.storageId;
          }
        } catch (uploadErr) {
          console.warn("Échec téléversement image vers Convex Storage:", uploadErr);
        }
      }

      const result = await createOrder({
        customerEmail: clientEmail,
        customerPhone: info.phone,
        lines: [
          {
            sku: `CADRE-${config.format}-${config.mouldureId.toUpperCase()}`,
            name: `Cadre sur-mesure ${format.label} — ${mouldure.name}`,
            quantity: 1,
            unitPriceAmount: price.subtotal,
            unitPriceCurrency: 'XOF',
            subtotalAmount: price.subtotal,
            customization: {
              width: format.widthCm,
              height: format.heightCm,
              frameStyle: mouldure.name,
              passepartout: !!config.passepartoutId,
              imageUrl: config.imageUrl || undefined,
              storageId: storageId as any,
            },
          },
        ],
        subtotalAmount: price.subtotal,
        shippingFeeAmount: livFCFA,
        discountAmount: 0,
        totalAmount: price.total,
        currency: 'XOF',
        shippingAddress: {
          fullName: `${info.firstName} ${info.lastName}`.trim(),
          phone: info.phone,
          street: `${info.quartier}, ${info.address}`,
          city: city.name,
          country: city.country,
        },
        paymentMethod: info.paymentMethod,
        paymentStatus: pStatus,
        notes: `Livraison: ${info.deliveryType.toUpperCase()} | WhatsApp: ${info.whatsapp || 'Non précisé'}`,
      });

      setOrderSuccess({
        orderNumber: result.orderNumber,
        totalAmount: price.total,
        paymentMethod: info.paymentMethod,
        paymentStatus: pStatus,
      });

      return result.orderNumber;
    } catch (err: any) {
      console.error('Erreur lors de la création de commande Convex:', err);
      const msg = err?.message || "Impossible d'enregistrer la commande dans la base de données. Veuillez réessayer.";
      setSubmitError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    const waText = encodeURIComponent(
      `Bonjour FrameItUp 👋\n\nJe viens de valider ma commande *${orderSuccess.orderNumber}* (${formatFCFA(orderSuccess.totalAmount)}) pour un cadre ${format.label} (${mouldure.name}).\nPouvez-vous me confirmer la prise en charge ? Merci !`
    );
    const waUrl = `https://wa.me/237658732446?text=${waText}`;

    return (
      <div style={{ maxWidth: 580, margin: '0 auto', background: 'var(--bg-surface)', border: '1px solid var(--border-hairline)', borderRadius: 12, padding: '36px 32px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34, 197, 94, 0.12)', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle2 size={36} />
        </div>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#16a34a', fontWeight: 700 }}>
          Commande enregistrée en base de données
        </span>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.875rem', color: 'var(--stone-900)', margin: '10px 0 6px', fontWeight: 500 }}>
          Merci pour votre commande !
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', color: 'var(--stone-600)', margin: '0 0 24px' }}>
          Votre commande a été transmise à notre atelier et est désormais visible en direct dans le tableau de bord d&apos;administration.
        </p>

        {/* Order reference card */}
        <div style={{ background: 'var(--bg-canvas)', border: '1px dashed var(--stone-300)', borderRadius: 8, padding: '18px 24px', marginBottom: 28, textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--stone-200)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--stone-500)' }}>N° de commande</span>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--stone-900)' }}>
              {orderSuccess.orderNumber}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--stone-500)' }}>Montant total</span>
            <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--stone-900)' }}>
              {formatFCFA(orderSuccess.totalAmount)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--stone-500)' }}>Mode de paiement</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--stone-700)', fontWeight: 500 }}>
              {orderSuccess.paymentMethod === 'cash-delivery' ? 'Cash à la livraison' : orderSuccess.paymentMethod === 'mtn-momo' ? 'MTN Mobile Money' : 'Orange Money'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--stone-500)' }}>Statut</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: orderSuccess.paymentStatus === 'paid' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(234, 179, 8, 0.15)', color: orderSuccess.paymentStatus === 'paid' ? '#16a34a' : '#b45309' }}>
              {orderSuccess.paymentStatus === 'paid' ? 'Payé ✓' : 'À régler à la livraison'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: '#25D366',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              padding: '12px 20px',
              borderRadius: 6,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <MessageCircle size={18} />
            Suivre ma commande sur WhatsApp
          </a>

          <Link
            href="/boutique"
            className="btn btn-secondary"
            style={{ justifyContent: 'center', height: 46 }}
          >
            <ShoppingBag size={16} />
            Découvrir d&apos;autres tableaux
          </Link>
        </div>
      </div>
    );
  }

  const STEPS = [
    { id: 'summary' as Step, label: 'Récapitulatif' },
    { id: 'delivery' as Step, label: 'Livraison' },
    { id: 'payment' as Step, label: 'Paiement' },
  ];
  const stepIdx = STEPS.findIndex(s => s.id === step);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : undefined }}>
            <div
              onClick={() => i < stepIdx && setStep(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                cursor: i < stepIdx ? 'pointer' : 'default',
              }}
            >
              <div
                style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  border: `1.5px solid ${i <= stepIdx ? 'var(--text-ink)' : 'var(--border-light)'}`,
                  background: i < stepIdx ? 'var(--text-ink)' : i === stepIdx ? 'var(--text-ink)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600,
                  color: i <= stepIdx ? 'var(--white)' : 'var(--text-faint)',
                  transition: 'all 0.25s ease',
                }}
              >
                {i + 1}
              </div>
              <span className="sm:inline" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: i === stepIdx ? 600 : 400, color: i === stepIdx ? 'var(--text-ink)' : 'var(--text-faint)', display: 'none' }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1, background: i < stepIdx ? 'var(--text-ink)' : 'var(--border-light)', margin: '0 10px', transition: 'background 0.3s ease' }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 1: Summary ── */}
      {step === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-hairline)', borderRadius: 6 }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--stone-200)' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', color: 'var(--stone-900)', margin: 0 }}>
                Votre commande
              </h2>
            </div>
            <div style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 76, height: 76, border: '3px solid rgba(0,0,0,0.08)', flexShrink: 0, overflow: 'hidden', background: 'var(--stone-100)' }}>
                {config.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={config.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : null}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--stone-900)', margin: '0 0 8px' }}>
                  Format {format.label} — {mouldure.name}
                </p>
                {[
                  `${format.widthCm} × ${format.heightCm} cm`,
                  `Moulure ${mouldure.widthMm}mm`,
                  config.passepartoutId ? `Passe-partout ${config.passepartoutWidthMm}mm biseau` : 'Sans passe-partout',
                  `Protection : ${verreLabel(config.glassType)}`,
                ].map((l, i) => (
                  <p key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--stone-500)', margin: '0 0 2px' }}>{l}</p>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--stone-100)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { l: 'Impression 250g archive', v: price.impression },
                { l: 'Moulure artisanale', v: price.mouldure },
                ...(price.passepartout > 0 ? [{ l: 'Passe-partout', v: price.passepartout }] : []),
                ...(price.verre > 0 ? [{ l: 'Protection', v: price.verre }] : []),
                { l: 'Accrochage', v: price.accrochage },
              ].map((x, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--stone-500)' }}>{x.l}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--stone-700)', fontWeight: 500 }}>{formatFCFA(x.v)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--stone-100)', marginTop: 2 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--stone-900)' }}>Sous-total</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', color: 'var(--stone-900)' }}>{formatFCFA(price.subtotal)}</span>
              </div>
            </div>
          </div>

          <button onClick={() => setStep('delivery')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 46 }}>
            Continuer
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* ── Step 2: Delivery ── */}
      {step === 'delivery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-hairline)', borderRadius: 6, padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', color: 'var(--stone-900)', margin: '0 0 24px' }}>
              Livraison
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={L}>Prénom *</label>
                  <input className="input" value={info.firstName} onChange={e => upd('firstName', e.target.value)} placeholder="Kofi" />
                  {errs.firstName && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-error, #C0392B)', marginTop: 4 }}>{errs.firstName}</p>}
                </div>
                <div>
                  <label style={L}>Nom *</label>
                  <input className="input" value={info.lastName} onChange={e => upd('lastName', e.target.value)} placeholder="Mensah" />
                  {errs.lastName && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-error, #C0392B)', marginTop: 4 }}>{errs.lastName}</p>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={L}>Téléphone *</label>
                  <input className="input" type="tel" value={info.phone} onChange={e => upd('phone', e.target.value)} placeholder="+225 07 XX XX XX" />
                  {errs.phone && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#C0392B', marginTop: 4 }}>{errs.phone}</p>}
                </div>
                <div>
                  <label style={L}>Email (suivi de commande)</label>
                  <input className="input" type="email" value={info.email ?? ''} onChange={e => upd('email', e.target.value)} placeholder="kofi@example.com" />
                </div>
              </div>

              <div>
                <label style={L}>WhatsApp (optionnel)</label>
                <input className="input" type="tel" value={info.whatsapp} onChange={e => upd('whatsapp', e.target.value)} placeholder="+225 07 XX XX XX (si différent)" />
              </div>

              <div>
                <label style={L}>Ville</label>
                <select className="input" value={info.city} onChange={e => { upd('city', e.target.value); upd('quartier', ''); }}>
                  {DELIVERY_CITIES.map(c => <option key={c.id} value={c.id}>{c.name} ({c.country})</option>)}
                </select>
              </div>

              <div>
                <label style={L}>Quartier *</label>
                <select className="input" value={info.quartier} onChange={e => upd('quartier', e.target.value)}>
                  <option value="">Sélectionner…</option>
                  {city.quartiers.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                {errs.quartier && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#C0392B', marginTop: 4 }}>{errs.quartier}</p>}
              </div>

              <div>
                <label style={L}>Adresse *</label>
                <textarea className="input" value={info.address} onChange={e => upd('address', e.target.value)} placeholder="Rue, bâtiment, repère…" rows={2} style={{ resize: 'vertical' }} />
                {errs.address && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#C0392B', marginTop: 4 }}>{errs.address}</p>}
              </div>

              {/* Delivery mode */}
              <div>
                <label style={L}>Mode de livraison</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {([
                    { id: 'standard' as const, icon: <Truck size={16} />, label: `Standard J+${city.daysStandard}`, price: city.deliveryStandard },
                    { id: 'express'  as const, icon: <Zap  size={16} />, label: `Express J+${city.daysExpress}`,  price: city.deliveryExpress },
                  ]).map(opt => {
                    const active = info.deliveryType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => upd('deliveryType', opt.id)}
                        style={{
                          padding: 14, border: `1px solid ${active ? 'var(--text-ink)' : 'var(--border-light)'}`,
                          background: active ? 'var(--text-ink)' : 'var(--bg-surface)',
                          borderRadius: 4, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ color: active ? 'var(--stone-300)' : 'var(--stone-500)', marginBottom: 8 }}>{opt.icon}</div>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: active ? 'var(--white)' : 'var(--stone-900)', margin: '0 0 3px' }}>{opt.label}</p>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: active ? 'var(--stone-400)' : 'var(--stone-500)', margin: 0 }}>{formatFCFA(opt.price)}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Total preview */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'var(--white)', border: '1px solid var(--stone-200)', borderRadius: 6 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--stone-600)' }}>Total livraison incluse</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.375rem', color: 'var(--stone-900)' }}>{formatFCFA(price.total)}</span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStep('summary')} className="btn btn-secondary" style={{ gap: 6 }}>
              <ArrowLeft size={14} /> Retour
            </button>
            <button onClick={() => { if (validate()) setStep('payment'); }} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Choisir le paiement <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Payment ── */}
      {step === 'payment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-hairline)', borderRadius: 6, padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', color: 'var(--stone-900)', margin: '0 0 20px' }}>
              Paiement
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {([
                { id: 'cash-delivery', label: 'Cash à la livraison',    desc: 'Remise en main propre lors de la livraison' },
                { id: 'mtn-momo',      label: 'MTN Mobile Money',       desc: 'Confirmation USSD via *144#' },
                { id: 'orange-money',  label: 'Orange Money',           desc: 'Confirmation USSD via #144#' },
              ] as const).map(pm => {
                const active = info.paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => upd('paymentMethod', pm.id as PaymentMethod)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                      borderRadius: 4, textAlign: 'left', cursor: 'pointer',
                      border: `1px solid ${active ? 'var(--stone-900)' : 'var(--stone-200)'}`,
                      background: active ? 'var(--stone-900)' : 'var(--white)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div
                      style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                        border: `1.5px solid ${active ? 'var(--white)' : 'var(--stone-300)'}`,
                        background: active ? 'var(--white)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--stone-900)' }} />}
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500, color: active ? 'var(--white)' : 'var(--stone-900)', margin: '0 0 2px' }}>{pm.label}</p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: active ? 'var(--stone-400)' : 'var(--stone-500)', margin: 0 }}>{pm.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Final total */}
          <div style={{ padding: '18px 20px', background: 'var(--bg-surface)', border: '1px solid var(--border-hairline)', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--stone-500)', margin: '0 0 4px' }}>Montant total</p>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--stone-900)', margin: 0, fontWeight: 500 }}>{formatFCFA(price.total)}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--stone-400)', margin: '0 0 2px' }}>Livraison incluse</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--stone-400)', margin: 0 }}>Fabrication J+2 ouvrables</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {submitError && (
              <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: 6, color: '#dc2626', fontSize: '0.8125rem' }}>
                {submitError}
              </div>
            )}

            {info.paymentMethod === 'cash-delivery' && (
              <button
                type="button"
                onClick={() => handleCreateOrder('pending')}
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ justifyContent: 'center', height: 48, fontSize: '0.9375rem', fontWeight: 600 }}
              >
                {isSubmitting ? 'Enregistrement de la commande...' : `Confirmer la commande — ${formatFCFA(price.total)}`}
              </button>
            )}

            {(info.paymentMethod === 'mtn-momo' || info.paymentMethod === 'orange-money') && (
              <button
                type="button"
                onClick={() => setMomoOpen(true)}
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ justifyContent: 'center', height: 48, fontSize: '0.9375rem', fontWeight: 600 }}
              >
                {isSubmitting ? 'Traitement en cours...' : `Payer maintenant — ${formatFCFA(price.total)}`}
              </button>
            )}

            <button
              type="button"
              onClick={() => setStep('delivery')}
              disabled={isSubmitting}
              className="btn btn-ghost"
              style={{ justifyContent: 'center' }}
            >
              <ArrowLeft size={14} /> Retour
            </button>
          </div>
        </div>
      )}

      {momoOpen && (
        <MobileMoneySimulator
          method={info.paymentMethod as 'mtn-momo' | 'orange-money'}
          amount={price.total}
          phone={info.phone}
          onClose={() => setMomoOpen(false)}
          onPaymentSuccess={async () => {
            const orderNum = await handleCreateOrder('paid');
            return orderNum;
          }}
        />
      )}
    </div>
  );
}

function verreLabel(type: string) {
  return type === 'antireflet' ? 'Verre antireflet' : type === 'plexiglas-flottant' ? 'Plexiglas' : 'Standard';
}
