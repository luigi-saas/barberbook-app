'use client';

import { cn } from '@repo/design-system/lib/utils';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

const BARBERS = [
  { id: '1', name: 'Hassan' },
  { id: '2', name: 'Youssef' },
  { id: '3', name: 'Karim' },
];

const DATE_CHIPS = [
  { label: 'Lun', date: '27' },
  { label: 'Mar', date: '28' },
  { label: 'Mer', date: '29' },
  { label: 'Jeu', date: '30' },
  { label: 'Ven', date: '31' },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30',
];

export function BookingPanel() {
  const t = useTranslations('web.guest.shop');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  return (
    <div className="rounded-[40px] bg-white p-8 shadow-[var(--bb-shadow-onboarding)] flex flex-col gap-6">
      <h2 className="font-display text-xl font-bold text-bb-espresso">
        {t('bookSlot')}
      </h2>

      {/* Select barber */}
      <div>
        <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-[0.1em] text-bb-espresso/50">
          {t('selectBarber')}
        </p>
        <div className="flex gap-3">
          {BARBERS.map((barber) => (
            <button
              key={barber.id}
              type="button"
              onClick={() => setSelectedBarber(barber.id)}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={cn(
                  'size-12 rounded-full bg-bb-cream-border border-2 transition',
                  selectedBarber === barber.id
                    ? 'border-bb-espresso'
                    : 'border-transparent',
                )}
              />
              <span
                className={cn(
                  'font-sans text-xs font-medium transition',
                  selectedBarber === barber.id
                    ? 'text-bb-espresso font-semibold'
                    : 'text-bb-espresso/50',
                )}
              >
                {barber.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Select date */}
      <div>
        <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-[0.1em] text-bb-espresso/50">
          {t('selectDate')}
        </p>
        <div className="flex gap-2">
          {DATE_CHIPS.map((chip) => (
            <button
              key={chip.date}
              type="button"
              onClick={() => setSelectedDate(chip.date)}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-2xl px-3 py-2.5 transition',
                selectedDate === chip.date
                  ? 'bg-bb-espresso text-bb-cream'
                  : 'bg-bb-cream text-bb-espresso hover:bg-bb-cream-border',
              )}
            >
              <span className="font-sans text-xs font-medium">{chip.label}</span>
              <span className="font-sans text-sm font-bold">{chip.date}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Select time */}
      <div>
        <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-[0.1em] text-bb-espresso/50">
          {t('selectTime')}
        </p>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setSelectedTime(slot)}
              className={cn(
                'rounded-xl px-2 py-2 font-sans text-xs font-medium transition',
                selectedTime === slot
                  ? 'bg-bb-espresso text-bb-cream'
                  : 'bg-bb-cream text-bb-espresso hover:bg-bb-cream-border',
              )}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      {(selectedDate || selectedTime) && (
        <div className="rounded-2xl bg-bb-cream p-4">
          <p className="font-sans text-sm text-bb-espresso/60">
            Coupe Classique — 80 MAD
          </p>
          {selectedDate && selectedTime && (
            <p className="mt-1 font-sans text-sm font-semibold text-bb-espresso">
              {selectedDate} Avr · {selectedTime}
            </p>
          )}
        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        className="w-full rounded-full bg-bb-espresso py-4 font-sans text-base font-semibold text-bb-cream transition hover:opacity-90"
      >
        {t('confirmBooking')}
      </button>

      <Link
        href="/sign-in"
        className="text-center font-sans text-sm text-bb-espresso/50 hover:text-bb-espresso transition"
      >
        {t('loginToContinue')}
      </Link>
    </div>
  );
}
