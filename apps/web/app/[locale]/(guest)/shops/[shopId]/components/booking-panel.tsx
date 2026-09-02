'use client';

import { cn } from '@repo/design-system/lib/utils';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import type { ServiceCard } from '@/lib/booking';

interface BookingPanelProps {
  locale: string;
  shopId: string;
  services: ServiceCard[];
}

export function BookingPanel({ locale, shopId, services }: BookingPanelProps) {
  const t = useTranslations('web.guest.shop');
  const [selectedId, setSelectedId] = useState('');

  const selected = services.find((s) => s.id === selectedId);

  return (
    <div className="rounded-[40px] bg-white p-8 shadow-[var(--bb-shadow-onboarding)] flex flex-col gap-6">
      <h2 className="font-display text-xl font-bold text-bb-espresso">
        {t('bookSlot')}
      </h2>

      {/* Select service */}
      <div>
        <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-[0.1em] text-bb-espresso/50">
          {t('selectService')}
        </p>
        <div className="flex flex-col gap-2">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => setSelectedId(service.id)}
              className={cn(
                'flex items-center justify-between rounded-2xl px-4 py-3 text-left transition border-2',
                selectedId === service.id
                  ? 'border-bb-espresso bg-bb-cream'
                  : 'border-transparent bg-bb-cream hover:bg-bb-cream-border',
              )}
            >
              <span>
                <span className="block font-sans text-sm font-semibold text-bb-espresso">
                  {service.name}
                </span>
                <span className="block font-sans text-xs text-bb-espresso/50">
                  {service.duration}
                </span>
              </span>
              <span className="font-sans text-sm font-bold text-bb-espresso whitespace-nowrap">
                {service.price}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      {selected && (
        <div className="rounded-2xl bg-bb-cream p-4">
          <p className="font-sans text-sm text-bb-espresso/60">
            {selected.name} — {selected.price}
          </p>
          <p className="mt-1 font-sans text-sm font-semibold text-bb-espresso">
            {t('nextStepHint')}
          </p>
        </div>
      )}

      {/* CTA */}
      <Link
        href={
          selected
            ? `/${locale}/booking/barber?service=${selected.id}&shop=${shopId}`
            : `/${locale}/booking?shop=${shopId}`
        }
        aria-disabled={!selected}
        className={cn(
          'w-full rounded-full py-4 text-center font-sans text-base font-semibold transition',
          selected
            ? 'bg-bb-espresso text-bb-cream hover:opacity-90'
            : 'bg-bb-espresso/40 text-bb-cream pointer-events-none',
        )}
      >
        {t('confirmBooking')}
      </Link>

      <Link
        href={`/${locale}/sign-in`}
        className="text-center font-sans text-sm text-bb-espresso/50 hover:text-bb-espresso transition"
      >
        {t('loginToContinue')}
      </Link>
    </div>
  );
}
