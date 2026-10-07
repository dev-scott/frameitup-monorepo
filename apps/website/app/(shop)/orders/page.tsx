'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getUserOrders } from '@/app/actions';
import { Button } from '@frameitup/ui';
import { useLanguageStore } from '@/store/use-language-store';

function OrdersContent() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t, language } = useLanguageStore();
  const searchParams = useSearchParams();

  // Define status flow values dynamically inside the component
  const statusSteps = [
    { status: 'PENDING', label: t.ordersPage.steps.pending },
    { status: 'PAYMENT_CONFIRMED', label: t.ordersPage.steps.payment },
    { status: 'IN_PRODUCTION', label: t.ordersPage.steps.production },
    { status: 'QUALITY_CHECK', label: t.ordersPage.steps.quality },
    { status: 'SHIPPED', label: t.ordersPage.steps.shipped },
    { status: 'DELIVERED', label: t.ordersPage.steps.delivered }
  ];

  const fetchOrders = async (queryTerm?: string) => {
    setLoading(true);
    let term = queryTerm?.trim() || '';
    if (!term && typeof window !== 'undefined') {
      term = searchParams.get('email') || searchParams.get('ref') || localStorage.getItem('frameitup_guest_email') || '';
    }
    if (term) {
      setSearchQuery(term);
      const data = await getUserOrders(term);
      setOrders(data);
    } else {
      setOrders([]);
    }
    setLoading(false);
  };

  // Load user order history on mount
  useEffect(() => {
    fetchOrders();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (typeof window !== 'undefined' && searchQuery.includes('@')) {
      try {
        localStorage.setItem('frameitup_guest_email', searchQuery.trim());
      } catch (_) {}
    }
    fetchOrders(searchQuery);
  };

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex((s) => s.status === status);
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-24 px-6 md:px-12 flex justify-center">
      <div className="max-w-7xl px-6 w-full space-y-12">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-widest text-[var(--brand-500)] uppercase">{t.ordersPage.dashboard}</span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {t.ordersPage.title}
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              {t.ordersPage.subtitle}
            </p>
          </div>

          {/* Quick Search/Lookup Form */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'fr' ? 'Email ou code de suivi...' : 'Email or tracking ref...'}
              className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-[var(--brand-500)] transition-colors w-full md:w-72"
            />
            <Button
              type="submit"
              className="bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white text-sm font-semibold rounded-xl px-4 py-2.5 shadow-brand whitespace-nowrap"
            >
              {language === 'fr' ? 'Rechercher' : 'Search'}
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse bg-[var(--bg-secondary)] rounded-3xl h-[280px]" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-8 space-y-4 flex flex-col items-center">
            <svg className="w-16 h-16 text-[var(--text-subtle)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <h3 className="font-display text-xl font-bold">{t.ordersPage.emptyTitle}</h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm">
              {t.ordersPage.emptyDesc}
            </p>
            <Button
              onClick={() => window.location.href = '/configure'}
              className="bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white font-semibold rounded-xl px-6 py-2.5 shadow-brand mt-4"
            >
              {t.ordersPage.startDesigning}
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const currentStepIdx = getStatusIndex(order.status);
              
              return (
                <div 
                  key={order.id}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-8"
                >
                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border)] pb-4 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8">
                      <div>
                        <span className="block text-[10px] text-[var(--text-subtle)] uppercase">{t.ordersPage.orderPlaced}</span>
                        <span className="font-semibold text-stone-700 dark:text-stone-300">
                          {new Date(order.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[var(--text-subtle)] uppercase">{t.ordersPage.totalCost}</span>
                        <span className="font-bold text-stone-700 dark:text-stone-300">
                          {order.totalUsd.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[var(--text-subtle)] uppercase">{t.ordersPage.shipTo}</span>
                        <span className="font-semibold text-stone-700 dark:text-stone-300 truncate max-w-[120px] block" title={`${order.shippingLine1}, ${order.shippingCity}`}>
                          {order.shippingCity}, {order.shippingCountry}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[var(--text-subtle)] uppercase">{t.ordersPage.trackingRef}</span>
                        <span className="font-mono font-bold text-[var(--brand-600)] uppercase select-all">
                          {order.trackingNumber}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300 border border-amber-200">
                      {language === 'fr' 
                        ? (order.status === 'PENDING' ? 'Enregistrée' : order.status === 'PAYMENT_CONFIRMED' ? 'Payée' : order.status === 'IN_PRODUCTION' ? 'En production' : order.status === 'QUALITY_CHECK' ? 'Contrôle' : order.status === 'SHIPPED' ? 'Expédiée' : 'Livrée')
                        : order.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Items Grid */}
                  <div className="space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div 
                          className="w-16 h-16 flex items-center justify-center relative flex-shrink-0"
                          style={{
                            border: `2px solid ${item.frameColor}`,
                            backgroundColor: item.matColor ? item.matColor : 'transparent',
                            padding: item.matColor ? '2.5px' : '0px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.imageUrl} alt="Framed Artwork" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[var(--text-primary)]">
                            {t.ordersPage.customFrame.replace('{name}', item.frameName)}
                          </h4>
                          <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                            {t.ordersPage.glass}: {language === 'fr' ? (item.glasingType === 'STANDARD' ? 'Standard' : item.glasingType === 'UV_PROTECTIVE' ? 'Protection UV' : item.glasingType === 'ANTI_REFLECTIVE' ? 'Anti-reflet' : 'Qualité Muséale') : item.glasingType.replace('_', ' ')} • {t.ordersPage.qty}: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* TIMELINE PROGRESS COMPONENT */}
                  <div className="pt-4 space-y-6">
                    <div className="relative">
                      {/* Grey background line */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-200 dark:bg-stone-800 -translate-y-1/2 rounded-full" />
                      
                      {/* Active progress color line */}
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] -translate-y-1/2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%`
                        }}
                      />

                      {/* Timeline Nodes */}
                      <div className="relative flex justify-between">
                        {statusSteps.map((step, idx) => {
                          const isActive = idx <= currentStepIdx;
                          const isCurrent = idx === currentStepIdx;
                          
                          return (
                            <div key={step.status} className="flex flex-col items-center group relative">
                              
                              {/* Node Circle */}
                              <div 
                                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center relative z-10 ${
                                  isCurrent 
                                    ? 'bg-white border-[var(--brand-500)] scale-125 ring-4 ring-[var(--brand-100)] dark:ring-[var(--brand-900)]/30' 
                                    : isActive 
                                      ? 'bg-[var(--brand-500)] border-[var(--brand-500)]' 
                                      : 'bg-[var(--bg-card)] border-stone-300 dark:border-stone-700'
                                }`}
                              >
                                {isActive && !isCurrent && (
                                  <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>

                              {/* Label text */}
                              <span 
                                className={`mt-2.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                  isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-subtle)]'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default function MyOrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)]" />}>
      <OrdersContent />
    </Suspense>
  );
}
