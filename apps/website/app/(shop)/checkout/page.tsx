'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useFrameStore } from '@/store/use-frame-store';
import { createOrder } from '@/app/actions';
import { Button } from '@frameitup/ui';
import { useLanguageStore } from '@/store/use-language-store';
import { buildWhatsAppUrl, WA_MESSAGES } from '@/lib/whatsapp';

export default function CheckoutPage() {
  const router = useRouter();
  const { t, language } = useLanguageStore();

  // Zustand Store
  const {
    imageSrc,
    artworkWidthMm,
    artworkHeightMm,
    selectedFrame,
    hasMat,
    matColor,
    matColorName,
    matWidthMm,
    glasingType,
    quantity,
    calculatePrice,
    setShipping,
  } = useFrameStore();

  // Redirect if no image configured
  if (!imageSrc && typeof window !== 'undefined') {
    router.push('/configure');
  }

  // Shipping Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    line1: '',
    line2: '',
    city: 'Douala',
    state: 'Littoral',
    postalCode: '00237',
    country: 'Cameroon',
  });

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'MOBILE_MONEY'>('CASH_ON_DELIVERY');
  const [carrier, setCarrier] = useState<'MTN' | 'ORANGE'>('MTN');
  const [momoNumber, setMomoNumber] = useState<string>('');

  // CinetPay Portal Simulation States
  const [showCinetPay, setShowCinetPay] = useState<boolean>(false);
  const [cinetPayStep, setCinetPayStep] = useState<'INIT' | 'USSD_PUSH' | 'PIN_ENTER' | 'SUCCESS'>('INIT');
  const [ussdProgress, setUssdProgress] = useState<number>(0);
  const [mockPin, setMockPin] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pricing calculations
  const prices = calculatePrice();

  // Validate form fields
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName) errs.firstName = t.checkoutPage.errors.required;
    if (!formData.lastName) errs.lastName = t.checkoutPage.errors.required;
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = t.checkoutPage.errors.invalidEmail;
    if (!formData.line1) errs.line1 = t.checkoutPage.errors.required;
    if (!formData.city) errs.city = t.checkoutPage.errors.required;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit flow
  const handlePaymentInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (paymentMethod === 'CASH_ON_DELIVERY') {
      // Direct placement (no CinetPay required)
      processOrderRegistry('CASH_ON_DELIVERY');
    } else {
      // Trigger CinetPay Aggregate Portal Simulation
      setShowCinetPay(true);
      setCinetPayStep('INIT');
    }
  };

  const startUssdSimulation = () => {
    setCinetPayStep('USSD_PUSH');
    setUssdProgress(0);
    const interval = setInterval(() => {
      setUssdProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setCinetPayStep('PIN_ENTER');
          return 100;
        }
        return prev + 20;
      });
    }, 600);
  };

  const handlePinSubmit = () => {
    if (mockPin.length < 4) return;
    setCinetPayStep('SUCCESS');
    setTimeout(() => {
      setShowCinetPay(false);
      processOrderRegistry(carrier === 'MTN' ? 'MTN_MOMO' : 'ORANGE_MONEY');
    }, 1500);
  };

  const processOrderRegistry = async (method: 'CASH_ON_DELIVERY' | 'MTN_MOMO' | 'ORANGE_MONEY') => {
    setProcessing(true);
    setShipping(formData);

    const transactionId = method === 'CASH_ON_DELIVERY'
      ? undefined
      : `CP-TX-${Math.floor(100000 + Math.random() * 900000)}`;

    const res = await createOrder({
      shipping: {
        line1: formData.line1,
        line2: formData.line2 || undefined,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        whatsapp: formData.whatsapp,
      },
      items: [
        {
          frameId: selectedFrame.id,
          imageUrl: imageSrc ?? '',
          matColor: hasMat ? matColor : undefined,
          glasingType: glasingType,
          widthPx: artworkWidthMm,
          heightPx: artworkHeightMm,
          quantity: quantity,
          unitPriceUsd: prices.total / quantity,
        },
      ],
      totalUsd: prices.total,
      paymentMethod: method,
      transactionId: transactionId,
    });

    setProcessing(false);
    if (res.success && res.order) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('frameitup_guest_email', formData.email);
        } catch (_) {}
      }
      // Build WhatsApp confirmation message
      const waMsg = WA_MESSAGES.orderConfirm(
        res.order.trackingNumber ?? 'N/A',
        res.order.totalUsd.toLocaleString('fr-FR')
      );
      const waUrl = buildWhatsAppUrl(waMsg);
      // Open WhatsApp in a new tab
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      // Navigate to success page in current tab
      router.push(`/checkout/success?orderId=${res.order.id}&tracking=${res.order.trackingNumber}&total=${res.order.totalUsd}&method=${method}&email=${encodeURIComponent(formData.email)}`);
    } else {
      alert((res as any)?.error || 'Failed to place order.');
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-24 px-6 md:px-12 flex justify-center relative">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* LEFT COLUMN: SHIPPING AND METHOD */}
        <form onSubmit={handlePaymentInitiate} className="lg:col-span-7 space-y-8">

          {/* Shipping Details */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-6 shadow-md space-y-6">
            <h2 className="text-xl font-bold font-display text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              {t.checkoutPage.title}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">{t.checkoutPage.firstName}</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full px-3 py-2.5 border rounded-xl bg-transparent text-sm font-medium ${errors.firstName ? 'border-rose-500' : 'border-[var(--border)]'}`}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">{t.checkoutPage.lastName}</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full px-3 py-2.5 border rounded-xl bg-transparent text-sm font-medium ${errors.lastName ? 'border-rose-500' : 'border-[var(--border)]'}`}
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>

                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">{t.checkoutPage.email}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2.5 border rounded-xl bg-transparent text-sm font-medium ${errors.email ? 'border-rose-500' : 'border-[var(--border)]'}`}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">{t.checkoutPage.whatsapp}</label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className={`w-full px-3 py-2.5 border rounded-xl bg-transparent text-sm font-medium ${errors.phone ? 'border-rose-500' : 'border-[var(--border)]'}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">{t.checkoutPage.addressLine1}</label>
              <input
                type="text"
                required
                value={formData.line1}
                onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                className={`w-full px-3 py-2.5 border rounded-xl bg-transparent text-sm font-medium ${errors.line1 ? 'border-rose-500' : 'border-[var(--border)]'}`}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">{t.checkoutPage.addressLine2}</label>
              <input
                type="text"
                value={formData.line2}
                onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                className="w-full px-3 py-2.5 border border-[var(--border)] rounded-xl bg-transparent text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">{t.checkoutPage.city}</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full px-3 py-2.5 border rounded-xl bg-transparent text-sm font-medium ${errors.city ? 'border-rose-500' : 'border-[var(--border)]'}`}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">{t.checkoutPage.state}</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[var(--border)] rounded-xl bg-transparent text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">{t.checkoutPage.postalCode}</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[var(--border)] rounded-xl bg-transparent text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">{t.checkoutPage.country}</label>
                <input
                  type="text"
                  required
                  readOnly
                  value={formData.country}
                  className="w-full px-3 py-2.5 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] text-sm font-semibold cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Modes de règlement disponibles */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {language === 'fr' ? 'Mode de paiement sécurisé' : 'Secure Payment Method'}
            </h3>

            {/* Option 1 : Paiement à la livraison */}
            <div
              onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                paymentMethod === 'CASH_ON_DELIVERY'
                  ? 'border-[var(--brand-500)] bg-[var(--brand-50)]/30 dark:bg-[var(--brand-950)]/30 shadow-sm'
                  : 'border-[var(--border)] hover:border-[var(--brand-300)]'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'CASH_ON_DELIVERY'}
                onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                className="mt-1 accent-[var(--brand-500)]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[var(--text-primary)]">
                    💵 {language === 'fr' ? 'Paiement à la livraison (Espèces)' : 'Cash on Delivery'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                    Recommandé
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {language === 'fr'
                    ? 'Réglez en espèces directement à notre coursier après avoir vérifié la qualité de votre cadre.'
                    : 'Pay with cash directly to our delivery courier upon inspecting your frame.'}
                </p>
              </div>
            </div>

            {/* Option 2 : Mobile Money (MTN / Orange) */}
            <div
              onClick={() => setPaymentMethod('MOBILE_MONEY')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-3 ${
                paymentMethod === 'MOBILE_MONEY'
                  ? 'border-[var(--brand-500)] bg-[var(--brand-50)]/30 dark:bg-[var(--brand-950)]/30 shadow-sm'
                  : 'border-[var(--border)] hover:border-[var(--brand-300)]'
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'MOBILE_MONEY'}
                  onChange={() => setPaymentMethod('MOBILE_MONEY')}
                  className="mt-1 accent-[var(--brand-500)]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[var(--text-primary)]">
                      📱 Mobile Money (MTN / Orange)
                    </span>
                    <div className="flex gap-1.5">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FFCC00] text-black rounded-md">MTN</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FF6600] text-white rounded-md">Orange</span>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {language === 'fr'
                      ? 'Paiement instantané par push USSD sécurisé sur votre téléphone.'
                      : 'Instant payment via secure USSD push on your mobile.'}
                  </p>
                </div>
              </div>

              {/* Champs opérateur et numéro Mobile Money si sélectionné */}
              {paymentMethod === 'MOBILE_MONEY' && (
                <div className="pt-3 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                      Opérateur
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCarrier('MTN')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          carrier === 'MTN'
                            ? 'bg-[#FFCC00] text-black ring-2 ring-amber-400'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                        }`}
                      >
                        MTN MoMo
                      </button>
                      <button
                        type="button"
                        onClick={() => setCarrier('ORANGE')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          carrier === 'ORANGE'
                            ? 'bg-[#FF6600] text-white ring-2 ring-orange-400'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                        }`}
                      >
                        Orange Money
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                      Numéro Mobile Money (9 chiffres)
                    </label>
                    <input
                      type="tel"
                      placeholder="6XX XXX XXX"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-xl bg-transparent text-sm font-medium"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* RIGHT COLUMN: SUMMARY & CTAs */}
        <div className="lg:col-span-5">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-6 shadow-md space-y-6 sticky top-28">
            <h2 className="text-xl font-bold font-display text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              {t.checkoutPage.summary}
            </h2>

            {imageSrc && (
              <div className="flex gap-4">
                <div
                  className="w-20 h-20 flex items-center justify-center relative flex-shrink-0"
                  style={{
                    border: `3px solid ${selectedFrame.color}`,
                    backgroundColor: hasMat ? matColor : 'transparent',
                    padding: hasMat ? '4px' : '0px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageSrc} alt="Preview" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">
                    {t.ordersPage.customFrame.replace('{name}', selectedFrame.name)}
                  </h4>
                  <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Artwork: {artworkWidthMm}x{artworkHeightMm}mm
                  </p>
                  <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Mat: {hasMat ? `${matWidthMm}mm (${matColorName})` : 'None'}
                  </p>
                  <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    {t.ordersPage.glass}: {language === 'fr' ? (glasingType === 'STANDARD' ? 'Standard' : glasingType === 'UV_PROTECTIVE' ? 'Protection UV' : glasingType === 'ANTI_REFLECTIVE' ? 'Anti-reflet' : 'Qualité Muséale') : glasingType.replace('_', ' ')}
                  </p>
                  <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    {t.ordersPage.qty}: {quantity}
                  </p>
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="space-y-3 pt-6 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>{language === 'fr' ? 'Profil de cadre personnalisé' : 'Custom Frame Profile'}</span>
                <span>{prices.baseFrame.toLocaleString('fr-FR')} FCFA</span>
              </div>
              {hasMat && (
                <div className="flex justify-between">
                  <span>{language === 'fr' ? 'Bordure passe-partout' : 'Mat Board Border'}</span>
                  <span>{prices.matPrice.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}
              {glasingType !== 'STANDARD' && (
                <div className="flex justify-between">
                  <span>{language === 'fr' ? 'Verre protecteur' : 'Glazing Treatment'}</span>
                  <span>{prices.glassPrice.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{language === 'fr' ? 'Expédition & Livraison' : 'Shipping & Delivery'}</span>
                <span className="text-emerald-600 font-bold uppercase">{language === 'fr' ? 'Gratuit (Cameroun)' : 'Free (Cameroon)'}</span>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-4 flex justify-between items-end">
              <span className="text-xs uppercase font-bold text-[var(--text-muted)]">{t.checkoutPage.total}</span>
              <span className="text-2xl font-black font-display text-[var(--text-primary)]">
                {prices.total.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <Button
              type="submit"
              onClick={handlePaymentInitiate}
              className="w-full bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white font-bold rounded-xl py-3.5 shadow-brand hover:shadow-brand-lg mt-6 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {paymentMethod === 'MOBILE_MONEY'
                ? (language === 'fr' ? 'Payer avec Mobile Money' : 'Pay with Mobile Money')
                : (language === 'fr' ? 'Confirmer la commande (Paiement à la livraison)' : 'Confirm Order (Cash on Delivery)')}
            </Button>

            {/* Alternative directe WhatsApp */}
            <button
              type="button"
              onClick={() => {
                const text = `Bonjour FrameItUp ! 👋\nJe souhaite passer commande d'un cadre personnalisé :\n\n🖼️ *Modèle* : ${selectedFrame.name}\n📏 *Dimensions* : ${artworkWidthMm}x${artworkHeightMm}mm\n${hasMat ? `🎨 *Passe-Partout* : ${matColorName} (${matWidthMm}mm)\n` : ''}🔢 *Quantité* : ${quantity}\n💰 *Total* : ${prices.total.toLocaleString('fr-FR')} FCFA\n\n👤 *Nom* : ${formData.firstName || 'Client'} ${formData.lastName || ''}\n📍 *Livraison* : ${formData.city}, ${formData.line1 || 'À préciser'}\n📞 *Contact* : ${formData.whatsapp || 'Même numéro'}\n\nMerci de me confirmer la prise en charge !`;
                window.open(buildWhatsAppUrl(text), '_blank');
              }}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>💬</span>
              <span>{language === 'fr' ? 'Transmettre directement sur WhatsApp' : 'Direct Order via WhatsApp'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* CINETPAY GATEWAY MODAL SIMULATION */}
      <AnimatePresence>
        {showCinetPay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1E293B] border border-stone-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl text-white"
            >
              {/* Header */}
              <div className="bg-[#0F172A] p-4 flex justify-between items-center border-b border-stone-700">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center text-slate-900 font-black text-[9px]">CP</span>
                  <span className="font-bold text-xs uppercase tracking-widest text-stone-300">{t.checkoutPage.cinetpay.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCinetPay(false)}
                  className="text-stone-400 hover:text-white text-xs font-semibold"
                >
                  {language === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">

                {cinetPayStep === 'INIT' && (
                  <div className="space-y-5 text-center">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase block tracking-wider">{language === 'fr' ? 'Transaction de paiement pour' : 'Payment Transaction for'}</span>
                      <h4 className="font-bold text-lg text-amber-500">FrameItUp Custom Framing</h4>
                      <p className="text-2xl font-black font-mono mt-1">{prices.total.toLocaleString('fr-FR')} FCFA</p>
                    </div>

                    <div className="bg-slate-800/50 p-4 border border-slate-700 rounded-xl space-y-1 text-xs text-left">
                      <div className="flex justify-between">
                        <span className="text-stone-400">{language === 'fr' ? 'Portefeuille opérateur :' : 'Carrier wallet:'}</span>
                        <span className="font-bold">{carrier === 'MTN' ? 'MTN MoMo' : 'Orange Money'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">{language === 'fr' ? 'Téléphone du portefeuille :' : 'Wallet phone:'}</span>
                        <span className="font-bold font-mono">+237 {momoNumber}</span>
                      </div>
                    </div>

                    <Button
                      onClick={startUssdSimulation}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl py-3"
                    >
                      {t.checkoutPage.cinetpay.payBtn}
                    </Button>
                  </div>
                )}

                {cinetPayStep === 'USSD_PUSH' && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">{language === 'fr' ? 'Envoi du chargement réseau mobile...' : 'Sending Mobile Network Payload...'}</h4>
                      <p className="text-xs text-stone-400">{language === 'fr' ? 'Demande de session push USSD (+237)...' : 'Requesting USSD push session code (+237)...'}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${ussdProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {cinetPayStep === 'PIN_ENTER' && (
                  <div className="space-y-6 text-center">
                    <div>
                      <h4 className="font-bold text-sm text-amber-400">{language === 'fr' ? '✓ Session USSD initiée' : '✓ USSD Session Initiated'}</h4>
                      <p className="text-xs text-stone-400 mt-1">{t.checkoutPage.cinetpay.pinEnter}</p>
                    </div>

                    {/* Numeric PIN display dots */}
                    <div className="flex justify-center gap-4 py-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${mockPin.length > i
                            ? 'bg-amber-400 border-amber-400 scale-110 shadow-lg shadow-amber-400/40'
                            : 'border-stone-500'
                            }`}
                        />
                      ))}
                    </div>

                    {/* Sim keyboard layout */}
                    <div className="grid grid-cols-3 gap-3 max-w-[200px] mx-auto">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => mockPin.length < 4 && setMockPin(mockPin + val)}
                          className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center font-bold text-lg border border-slate-700/60"
                        >
                          {val}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setMockPin('')}
                        className="w-12 h-12 bg-rose-950/30 text-rose-400 hover:bg-rose-950/50 rounded-full flex items-center justify-center text-xs font-bold"
                      >
                        {language === 'fr' ? 'Effacer' : 'Clear'}
                      </button>
                      <button
                        type="button"
                        onClick={() => mockPin.length < 4 && setMockPin(mockPin + '0')}
                        className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center font-bold text-lg border border-slate-700/60"
                      >
                        0
                      </button>
                      <button
                        type="button"
                        onClick={handlePinSubmit}
                        disabled={mockPin.length < 4}
                        className="w-12 h-12 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-950/60 disabled:opacity-40 rounded-full flex items-center justify-center text-xs font-bold"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                )}

                {cinetPayStep === 'SUCCESS' && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/20">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-emerald-400">{t.checkoutPage.cinetpay.success}</h4>
                      <p className="text-xs text-stone-400">{language === 'fr' ? 'Référence de reçu enregistrée dans le système CinetPay.' : 'Receipt reference logged to CinetPay system.'}</p>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECURE LOADING SCREEN OVERLAY */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center flex-col text-white"
          >
            <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-6" />
            <p className="font-medium text-stone-300">{language === 'fr' ? 'Enregistrement de la commande de cadre personnalisé...' : 'Registering custom frame order...'}</p>
            <span className="text-[10px] uppercase text-stone-500 font-mono tracking-widest mt-2">SSL Secure 256-Bit TLS</span>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
