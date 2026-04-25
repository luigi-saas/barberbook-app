'use client';

import { cn } from '@repo/design-system/lib/utils';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { BookingSessionSidebar } from '../../components/booking-session-sidebar';

interface Barber {
  id: string;
  name: string;
  rating: number;
  yearsExp: number;
  specialty: string;
  bio: string;
  skills: string[];
  avatarUrl: string;
  tagline: string;
}

const BARBERS: Barber[] = [
  {
    id: 'yassine',
    name: 'Yassine El Mansouri',
    rating: 4.9,
    yearsExp: 12,
    specialty: 'Beard Master',
    bio: 'Specialist in Royal Moroccan grooming and luxury beard styling. Known for meticulous attention to detail and traditional techniques.',
    skills: ['Beard Sculpting', 'Hot Towel', 'Skin Fade'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80',
    tagline: 'Top Rated Artisan',
  },
  {
    id: 'mehdi',
    name: 'Mehdi Benali',
    rating: 4.8,
    yearsExp: 8,
    specialty: 'Fade Specialist',
    bio: 'The master of precision fades and contemporary urban styles. Bringing modern architectural lines to traditional barbering.',
    skills: ['Taper Fade', 'Hair Tattoo', 'Scissor Cut'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80',
    tagline: 'Precision Expert',
  },
  {
    id: 'omar',
    name: 'Omar Tahiri',
    rating: 4.9,
    yearsExp: 15,
    specialty: 'Style Architect',
    bio: 'Expert in traditional straight-razor shaving and classic silhouette design. A guardian of the old-world grooming legacy.',
    skills: ['Straight Razor', 'Classic Cut', 'Head Massage'],
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&q=80',
    tagline: 'Legacy Artisan',
  },
];

interface BarberSelectorProps {
  locale: string;
  serviceId?: string;
}

export function BarberSelector({ locale, serviceId }: BarberSelectorProps) {
  const t = useTranslations('web.guest.booking');
  const [selectedId, setSelectedId] = useState('');

  const selectedBarber = BARBERS.find((b) => b.id === selectedId);

  const serviceParam = serviceId ? `&service=${serviceId}` : '';

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
          {BARBERS.map((barber) => {
            const isSelected = selectedId === barber.id;
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
                )}
              >
                {isSelected && (
                  <div className="absolute top-6 right-6 bg-bb-espresso-gold text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    SELECTED
                  </div>
                )}

                <div className="flex items-start gap-6 mb-4">
                  <img
                    src={barber.avatarUrl}
                    alt={barber.name}
                    className={cn(
                      'w-20 h-20 rounded-full object-cover ring-4 shadow-md transition',
                      isSelected ? 'ring-bb-espresso-gold/30' : 'ring-bb-cream-border grayscale group-hover:grayscale-0',
                    )}
                  />
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-bb-espresso text-xl leading-tight">{barber.name}</h3>
                      <div className="flex items-center gap-1 text-sm font-bold text-bb-espresso">
                        <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span>{barber.rating}</span>
                      </div>
                    </div>
                    <p className={cn(
                      'text-xs font-bold uppercase tracking-widest mt-1',
                      isSelected ? 'text-bb-espresso-gold' : 'text-bb-on-surface-muted',
                    )}>
                      {barber.yearsExp}+ {t('yearsExp')}
                    </p>
                    <div className="mt-2">
                      <span className={cn(
                        'text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider',
                        isSelected
                          ? 'bg-bb-gold-muted text-bb-espresso-gold'
                          : 'bg-bb-surface-elevated text-bb-on-surface-muted',
                      )}>
                        {barber.specialty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-bb-on-surface-muted leading-relaxed">{barber.bio}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {barber.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-semibold px-2 py-1 bg-bb-surface-variant text-bb-on-surface-muted rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
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
            ? { name: selectedBarber.name, avatarUrl: selectedBarber.avatarUrl, tagline: selectedBarber.tagline }
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
