'use client';

import { cn } from '@repo/design-system/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { BarberWithServices } from '@/lib/booking';
import { BookingSessionSidebar } from '../../components/booking-session-sidebar';

interface BarberSelectorProps {
  locale: string;
  serviceId?: string;
  barbers: BarberWithServices[];
  shopId?: string;
}

export function BarberSelector({ locale, serviceId, barbers, shopId }: BarberSelectorProps) {
  const t = useTranslations('web.guest.booking');
  const [selectedId, setSelectedId] = useState('');

  const selectedBarber = barbers.find((b) => b.id === selectedId);

  const params = new URLSearchParams();
  if (serviceId) params.set('service', serviceId);
  if (shopId) params.set('shop', shopId);
  const serviceParam = params.toString() ? `&${params.toString()}` : '';

  return (
    <div className="flex flex-col lg:flex-row gap-8 flex-1">
      {/* Left column */}
      <div className="flex-1 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-bb-espresso">
            {t('selectBarberTitle')}
          </h1>
          <p className="text-bb-on-surface-muted max-w-xl font-sans text-sm">
            {t('selectBarberSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Any available card */}
          <button
            type="button"
            onClick={() => setSelectedId('any')}
            className={cn(
              'group relative flex items-center p-8 border-2 rounded-2xl transition cursor-pointer min-h-[160px]',
              selectedId === 'any'
                ? 'border-bb-espresso-gold bg-bb-gold-muted/20 shadow-[0_8px_30px_rgba(119,90,25,0.08)]'
                : 'border-bb-cream-border bg-white hover:border-bb-espresso-gold/40 hover:shadow-sm',
            )}
          >
            {selectedId === 'any' && (
              <div className="absolute top-4 right-4 bg-bb-espresso-gold text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                SELECTED
              </div>
            )}
            <div className="w-16 h-16 rounded-full bg-bb-gold-muted flex items-center justify-center text-bb-espresso-gold shrink-0">
              <span className="material-symbols-outlined text-3xl">shuffle</span>
            </div>
            <div className="ml-6 text-left">
              <h3 className="font-bold text-bb-espresso text-xl">{t('anyAvailableTitle')}</h3>
              <p className="text-sm text-bb-on-surface-muted mt-1">
                {t('anyAvailableDesc')}
              </p>
            </div>
          </button>

          {/* Individual barber cards */}
          {barbers.map((barber) => {
            const isSelected = selectedId === barber.id;
            const eligible = !serviceId || barber.serviceIds.length === 0 || barber.serviceIds.includes(serviceId);
            return (
              <button
                key={barber.id}
                type="button"
                onClick={() => setSelectedId(barber.id)}
                className={cn(
                  'group relative flex flex-col p-8 border-2 rounded-2xl transition cursor-pointer text-left',
                  isSelected
                    ? 'border-bb-espresso-gold bg-white shadow-lg'
                    : 'border-bb-cream-border bg-white hover:border-bb-espresso-gold/40 hover:shadow-sm',
                  !eligible && 'opacity-50 grayscale',
                )}
              >
                {isSelected && (
                  <div className="absolute top-6 right-6 bg-bb-espresso-gold text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    SELECTED
                  </div>
                )}

                <div className="flex items-start gap-6 mb-4">
                  {barber.avatarUrl ? (
                    <Image
                      src={barber.avatarUrl}
                      alt={barber.name}
                      width={80}
                      height={80}
                      className={cn(
                        'w-20 h-20 rounded-full object-cover ring-4 shadow-md transition',
                        isSelected ? 'ring-bb-espresso-gold/30' : 'ring-bb-cream-border grayscale group-hover:grayscale-0',
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        'w-20 h-20 rounded-full flex items-center justify-center ring-4 shadow-md font-display font-black text-2xl transition',
                        isSelected
                          ? 'bg-bb-espresso-gold text-white ring-bb-espresso-gold/30'
                          : 'bg-bb-gold-muted text-bb-espresso-gold ring-bb-cream-border group-hover:grayscale-0',
                      )}
                    >
                      {barber.initials}
                    </div>
                  )}
                  <div className="flex-1 pt-1">
                    <h3 className="font-bold text-bb-espresso text-xl leading-tight">{barber.name}</h3>
                    <p className={cn(
                      'text-xs font-bold uppercase tracking-widest mt-1',
                      isSelected ? 'text-bb-espresso-gold' : 'text-bb-on-surface-muted',
                    )}>
                      {barber.specialty}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {barber.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-bb-gold-muted/60 text-bb-espresso">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-bb-on-surface-muted leading-relaxed">{barber.bio}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right sidebar */}
      <BookingSessionSidebar
        barber={
          selectedBarber
            ? { name: selectedBarber.name, avatarUrl: selectedBarber.avatarUrl }
            : selectedId === 'any'
              ? { name: t('anyAvailableTitle') }
              : undefined
        }
        primaryAction={
          <Link
            href={selectedId ? `/${locale}/booking/time?barber=${selectedId}${serviceParam}` : '#'}
            className={cn(
              'w-full py-4 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-2',
              selectedId
                ? 'bg-bb-espresso-gold text-white shadow-[0_8px_20px_rgba(119,90,25,0.25)] hover:scale-[0.98]'
                : 'bg-bb-cream-border text-bb-on-surface-muted cursor-not-allowed pointer-events-none',
            )}
            aria-disabled={!selectedId}
          >
            <span>{t('continueToTime')}</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </Link>
        }
        secondaryAction={
          <Link
            href={`/${locale}/booking`}
            className="w-full py-2 text-sm font-medium text-bb-on-surface-muted hover:text-bb-espresso text-center block transition"
          >
            {t('returnToServices')}
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
