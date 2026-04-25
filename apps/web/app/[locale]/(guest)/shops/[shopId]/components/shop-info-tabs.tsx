'use client';

import { cn } from '@repo/design-system/lib/utils';
import { Scissors, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type TabKey = 'services' | 'team' | 'gallery' | 'reviews';

const MOCK_SERVICES = [
  { id: '1', name: 'Coupe Classique', duration: 30, price: 80 },
  { id: '2', name: 'Barbe Complète', duration: 20, price: 60 },
  { id: '3', name: 'Soin du Visage', duration: 45, price: 120 },
  { id: '4', name: 'Rituel Complet', duration: 75, price: 200 },
];

const MOCK_BARBERS = [
  { id: '1', name: 'Hassan Idrissi', specialty: ['Coupe', 'Barbe'] },
  { id: '2', name: 'Youssef Benali', specialty: ['Soin', 'Coupe'] },
  { id: '3', name: 'Karim Tazi', specialty: ['Rituel', 'Barbe'] },
];

const MOCK_REVIEWS = [
  { id: '1', author: 'Mehdi A.', rating: 5, comment: 'Excellent service, ambiance très agréable.', date: 'Jan 2025' },
  { id: '2', author: 'Omar B.', rating: 4, comment: 'Très bon barbier, je recommande.', date: 'Déc 2024' },
  { id: '3', author: 'Amine K.', rating: 5, comment: 'Le meilleur salon de Casablanca!', date: 'Nov 2024' },
];

export function ShopInfoTabs() {
  const t = useTranslations('web.guest.shop');
  const [activeTab, setActiveTab] = useState<TabKey>('services');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'services', label: t('services') },
    { key: 'team', label: t('team') },
    { key: 'gallery', label: t('gallery') },
    { key: 'reviews', label: t('reviews') },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 rounded-2xl bg-bb-cream p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex-1 rounded-xl px-4 py-2.5 font-sans text-sm font-semibold transition',
              activeTab === tab.key
                ? 'bg-bb-espresso text-bb-cream shadow-sm'
                : 'text-bb-espresso/60 hover:text-bb-espresso',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Services tab */}
      {activeTab === 'services' && (
        <div className="flex flex-col gap-3">
          {MOCK_SERVICES.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-bb-cream">
                  <Scissors className="size-4 text-bb-espresso" />
                </div>
                <div>
                  <p className="font-sans text-base font-semibold text-bb-espresso">
                    {service.name}
                  </p>
                  <p className="font-sans text-sm text-bb-espresso/50">
                    {service.duration} min
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-display text-lg font-bold text-bb-espresso">
                  {service.price} MAD
                </span>
                <button
                  type="button"
                  className="rounded-full bg-bb-espresso px-5 py-2 font-sans text-sm font-semibold text-bb-cream transition hover:opacity-90"
                >
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Team tab */}
      {activeTab === 'team' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_BARBERS.map((barber) => (
            <div
              key={barber.id}
              className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-sm"
            >
              <div className="size-20 rounded-full bg-bb-cream-border" />
              <div>
                <p className="font-sans text-base font-semibold text-bb-espresso">
                  {barber.name}
                </p>
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  {barber.specialty.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-bb-cream px-3 py-1 font-sans text-xs font-medium text-bb-espresso/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery tab */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-bb-cream-border"
            />
          ))}
        </div>
      )}

      {/* Reviews tab */}
      {activeTab === 'reviews' && (
        <div className="flex flex-col gap-4">
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-9 rounded-full bg-bb-cream-border" />
                  <span className="font-sans text-sm font-semibold text-bb-espresso">
                    {review.author}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-bb-espresso-gold text-bb-espresso-gold" />
                  ))}
                  <span className="ml-1 font-sans text-xs text-bb-espresso/50">
                    {review.date}
                  </span>
                </div>
              </div>
              <p className="font-sans text-sm text-bb-espresso/70">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
