'use client';

import { cn } from '@repo/design-system/lib/utils';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { BookingSessionSidebar } from '../../components/booking-session-sidebar';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// November 2024 starts on Friday (offset = 4 for Mon-start grid)
const CALENDAR_OFFSET = 4;
const DAYS_IN_MONTH = 30;
const MONTH_LABEL = 'November 2024';

interface TimeSlot {
  time: string;
  period: string;
  booked?: boolean;
}

// Slots available for selected date 12
const SLOTS_FOR_12: TimeSlot[] = [
  { time: '09:00', period: 'Morning' },
  { time: '10:30', period: 'Midday' },
  { time: '11:15', period: 'Midday' },
  { time: '14:00', period: 'Afternoon' },
  { time: '15:30', period: 'Afternoon' },
  { time: '16:45', period: 'Evening' },
  { time: '18:00', period: 'Booked', booked: true },
];

// Dates that are fully booked (no slots)
const FULLY_BOOKED_DATES = [15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27];

interface TimePickerProps {
  locale: string;
  barberId?: string;
  serviceId?: string;
}

export function TimePicker({ locale, barberId, serviceId }: TimePickerProps) {
  const t = useTranslations('web.guest.booking');
  const [selectedDay, setSelectedDay] = useState(12);
  const [selectedTime, setSelectedTime] = useState('');
  const [calendarOffset] = useState(0); // month navigation placeholder

  const isFullyBooked = FULLY_BOOKED_DATES.includes(selectedDay);
  const slots = selectedDay === 12 ? SLOTS_FOR_12 : [];

  const params = new URLSearchParams();
  if (barberId) params.set('barber', barberId);
  if (serviceId) params.set('service', serviceId);
  const backQuery = params.toString() ? `?${params.toString()}` : '';

  const continueQuery = new URLSearchParams(params);
  if (selectedTime) continueQuery.set('time', `Nov ${selectedDay} ${selectedTime}`);

  return (
    <div className="flex flex-col lg:flex-row gap-8 flex-1">
      {/* Left column */}
      <div className="flex-1 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-bb-espresso">
            {t('selectDateTime')}
          </h1>
          <p className="text-bb-on-surface-muted max-w-xl font-sans text-sm">
            {t('selectDateTimeSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_12px_40px_rgba(28,27,27,0.04)] border border-bb-cream-border h-fit">
            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                className="p-2 hover:bg-bb-surface-elevated rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <h4 className="font-bold font-display text-lg text-bb-espresso">{MONTH_LABEL}</h4>
              <button
                type="button"
                className="p-2 hover:bg-bb-surface-elevated rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-bb-on-surface-muted uppercase tracking-widest mb-4">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-y-2 text-center">
              {/* Offset cells for previous month */}
              {Array.from({ length: CALENDAR_OFFSET }).map((_, i) => (
                <div
                  key={`prev-${i}`}
                  className="p-2 text-bb-cream-border text-sm"
                >
                  {28 + i}
                </div>
              ))}

              {/* Current month days */}
              {Array.from({ length: DAYS_IN_MONTH }).map((_, i) => {
                const day = i + 1;
                const isSelected = day === selectedDay;
                const isBooked = FULLY_BOOKED_DATES.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => { setSelectedDay(day); setSelectedTime(''); }}
                    className={cn(
                      'p-2 text-sm rounded-xl transition',
                      isSelected
                        ? 'bg-bb-espresso-gold text-white font-bold shadow-md ring-2 ring-bb-espresso-gold ring-offset-2 ring-offset-white'
                        : isBooked
                          ? 'text-bb-cream-border cursor-not-allowed line-through'
                          : 'hover:bg-bb-surface-elevated cursor-pointer text-bb-espresso',
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots / No-availability */}
          {isFullyBooked ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-bb-espresso">{t('availableSlots')}</h3>
                <span className="text-bb-on-surface-muted text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">event_busy</span>
                  {t('fullyBooked')}
                </span>
              </div>

              {/* Empty state */}
              <div className="bg-bb-surface-variant/30 border-2 border-dashed border-bb-cream-border rounded-[2.5rem] p-10 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-bb-surface-elevated flex items-center justify-center">
                  <span className="material-symbols-outlined text-bb-on-surface-muted text-3xl">sentiment_dissatisfied</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-bb-espresso">{t('noSlotsTitle')}</h4>
                  <p className="text-sm text-bb-on-surface-muted max-w-[240px] mx-auto">
                    {t('noSlotsDesc', { day: selectedDay })}
                  </p>
                </div>
              </div>

              {/* Waitlist card */}
              <div className="bg-bb-gold-muted/10 border border-bb-espresso-gold/20 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-bb-gold-muted flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-bb-espresso-gold">notifications_active</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-bb-espresso-gold">{t('waitlistTitle')}</h4>
                    <p className="text-sm text-bb-on-surface-muted leading-relaxed mt-1">
                      {t('waitlistDesc')}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-4 bg-bb-espresso-gold text-white rounded-2xl font-bold shadow-lg shadow-bb-gold/20 hover:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">person_add</span>
                  {t('joinWaitlist')}
                </button>
              </div>

              {/* Change barber */}
              <div className="text-center space-y-4 pt-2">
                <p className="text-xs font-bold text-bb-on-surface-muted uppercase tracking-widest">
                  {t('orExploreAlternatives')}
                </p>
                <Link
                  href={`/${locale}/booking/barber${backQuery}`}
                  className="w-full py-4 border-2 border-bb-espresso-gold/20 text-bb-espresso-gold rounded-2xl font-bold hover:bg-bb-gold-muted/20 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">hail</span>
                  {t('changeBarber')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-bb-espresso">{t('availableSlots')}</h3>
                <span className="text-bb-success text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  {t('liveAvailability')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {slots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  if (slot.booked) {
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled
                        className="py-4 px-2 rounded-2xl bg-bb-surface-elevated text-bb-on-surface-muted/40 cursor-not-allowed text-center"
                      >
                        <span className="block line-through text-sm font-bold">{slot.time}</span>
                        <span className="text-[9px] uppercase tracking-widest text-bb-on-surface-muted/40 font-medium mt-1 block">
                          {t('slotBooked')}
                        </span>
                      </button>
                    );
                  }
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setSelectedTime(slot.time)}
                      className={cn(
                        'py-4 px-2 rounded-2xl font-bold text-center transition',
                        isSelected
                          ? 'bg-bb-espresso-gold text-white shadow-lg ring-2 ring-bb-espresso-gold ring-offset-2 ring-offset-white'
                          : 'bg-bb-surface-elevated text-bb-espresso hover:bg-bb-cream-border/50',
                      )}
                    >
                      <span className="block text-sm">{slot.time}</span>
                      <span
                        className={cn(
                          'text-[9px] uppercase tracking-widest font-medium mt-1 block',
                          isSelected ? 'text-white/80' : 'text-bb-on-surface-muted',
                        )}
                      >
                        {slot.period}
                      </span>
                    </button>
                  );
                })}
              </div>

              {slots.length > 0 && (
                <div className="p-4 bg-bb-success/5 border border-bb-success/10 rounded-[1.5rem] flex gap-3">
                  <span className="material-symbols-outlined text-bb-success">info</span>
                  <p className="text-xs text-bb-success leading-snug font-medium">
                    {t('arrivalNote')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <BookingSessionSidebar
        time={selectedTime ? { label: `Tue, Nov ${selectedDay} · ${selectedTime}` } : undefined}
        primaryAction={
          !isFullyBooked && selectedTime ? (
            <Link
              href={`/${locale}/booking/summary?${continueQuery.toString()}`}
              className="w-full py-4 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-2 bg-bb-espresso-gold text-white shadow-[0_8px_20px_rgba(119,90,25,0.25)] hover:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-xl">login</span>
              <span>{t('confirmAppointment')}</span>
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-4 rounded-2xl font-bold text-lg bg-bb-cream-border text-bb-on-surface-muted cursor-not-allowed opacity-50 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">login</span>
              <span>{t('confirmAppointment')}</span>
            </button>
          )
        }
        secondaryAction={
          <p className="text-[11px] text-center text-bb-on-surface-muted font-medium">
            {t('selectTimeToConfirm')}
          </p>
        }
        policyTitle={t('flexibilityPolicyTitle')}
        policyText={t('flexibilityPolicyText')}
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
