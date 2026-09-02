'use client';

import { cn } from '@repo/design-system/lib/utils';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { BookingSessionSidebar } from './booking-session-sidebar';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  tier: string;
  imageUrl: string;
  category: string;
}

const SERVICES: Service[] = [
  {
    id: 'c1',
    name: 'Signature Royal Cut',
    description: 'Precision haircut crafted to your face shape using traditional Moroccan techniques.',
    duration: '45 min',
    price: '250 MAD',
    tier: 'Premium Service',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=120&q=80',
    category: 'classic',
  },
  {
    id: 'c2',
    name: 'Classic Cut & Style',
    description: 'A clean, sharp cut with expert styling. The foundation of the barbershop experience.',
    duration: '30 min',
    price: '150 MAD',
    tier: 'Classic Service',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=120&q=80',
    category: 'classic',
  },
  {
    id: 'b1',
    name: 'Royal Beard Grooming',
    description: 'Full beard sculpt, hot towel, and premium argan oil finish.',
    duration: '45 min',
    price: '450 MAD',
    tier: 'Premium Service',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=120&q=80',
    category: 'beard',
  },
  {
    id: 'b2',
    name: 'Traditional Shave',
    description: 'Straight-razor shave with traditional lather and essential oils.',
    duration: '30 min',
    price: '200 MAD',
    tier: 'Classic Service',
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=120&q=80',
    category: 'beard',
  },
  {
    id: 's1',
    name: 'Argan Facial Ritual',
    description: 'Deep cleanse, exfoliation, and hydrating Moroccan argan oil mask.',
    duration: '60 min',
    price: '350 MAD',
    tier: 'Spa Service',
    imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=120&q=80',
    category: 'care',
  },
  {
    id: 'r1',
    name: 'Full Grooming Ritual',
    description: 'The complete experience: cut, beard, and facial care.',
    duration: '90 min',
    price: '650 MAD',
    tier: 'Signature Experience',
    imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=120&q=80',
    category: 'ritual',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All Services' },
  { key: 'classic', label: 'Classic Cut' },
  { key: 'beard', label: 'Beard' },
  { key: 'care', label: 'Care' },
  { key: 'ritual', label: 'Full Ritual' },
];

interface ServiceSelectorProps {
  locale: string;
}

export function ServiceSelector({ locale }: ServiceSelectorProps) {
  const t = useTranslations('web.guest.booking');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedId, setSelectedId] = useState('');

  const filtered =
    activeCategory === 'all'
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeCategory);

  const selectedService = SERVICES.find((s) => s.id === selectedId);

  return (
    <div className="flex flex-col lg:flex-row gap-8 flex-1">
      {/* Left column */}
      <div className="flex-1 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-bb-espresso">
            {t('selectService')}
          </h1>
          <p className="text-bb-on-surface-muted max-w-xl font-sans text-sm">
            {t('selectServiceSubtitle')}
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                'rounded-full px-5 py-2.5 font-sans text-sm font-medium whitespace-nowrap transition shrink-0 border',
                activeCategory === cat.key
                  ? 'bg-bb-espresso text-bb-cream border-bb-espresso'
                  : 'border-bb-cream-border text-bb-espresso hover:bg-bb-cream-border/50',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Service cards */}
        <div className="flex flex-col gap-4">
          {filtered.map((service) => {
            const isSelected = selectedId === service.id;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedId(service.id)}
                className={cn(
                  'flex items-center gap-6 p-6 rounded-[1.5rem] border-2 text-left transition group',
                  isSelected
                    ? 'border-bb-espresso-gold bg-bb-gold-muted/20 shadow-[0_8px_30px_rgba(119,90,25,0.08)]'
                    : 'border-bb-cream-border bg-white hover:border-bb-espresso-gold/40 hover:shadow-sm',
                )}
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-bb-surface-variant">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-display font-bold text-bb-espresso text-base leading-tight">
                        {service.name}
                      </h4>
                      <p className="text-xs text-bb-on-surface-muted mt-1 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-bb-on-surface-muted">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {service.duration}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-bb-surface-variant text-bb-on-surface-muted rounded uppercase tracking-wider">
                          {service.tier}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display font-bold text-bb-espresso-gold text-lg whitespace-nowrap">
                        {service.price}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selection indicator */}
                <div className="shrink-0">
                  <span
                    className={cn(
                      'material-symbols-outlined text-2xl transition',
                      isSelected ? 'text-bb-espresso-gold' : 'text-bb-cream-border group-hover:text-bb-espresso-gold/40',
                    )}
                    style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {isSelected ? 'check_circle' : 'add_circle'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right sidebar */}
      <BookingSessionSidebar
        service={
          selectedService
            ? {
                name: selectedService.name,
                duration: selectedService.duration,
                tier: selectedService.tier,
              }
            : undefined
        }
        totalAmount={selectedService?.price}
        primaryAction={
          <Link
            href={selectedId ? `/${locale}/booking/barber?service=${selectedId}` : '#'}
            className={cn(
              'w-full py-4 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-2',
              selectedId
                ? 'bg-bb-espresso-gold text-white shadow-[0_8px_20px_rgba(119,90,25,0.25)] hover:scale-[0.98]'
                : 'bg-bb-cream-border text-bb-on-surface-muted cursor-not-allowed pointer-events-none',
            )}
            aria-disabled={!selectedId}
          >
            <span>{t('continueToBarber')}</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </Link>
        }
        policyTitle={t('secureBookingTitle')}
        policyText={t('secureBookingText')}
        termsText={
          <>
            {t('termsPrefix')}{' '}
            <a href="#" className="underline">
              {t('termsLink')}
            </a>{' '}
            {t('cancellationSuffix')}
          </>
        }
      />
    </div>
  );
}
