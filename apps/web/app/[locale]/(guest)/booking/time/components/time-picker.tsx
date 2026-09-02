'use client';

import { cn } from '@repo/design-system/lib/utils';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { DayOption, ServiceCard, SlotOption } from '@/lib/booking';
import { BookingSessionSidebar } from '../../components/booking-session-sidebar';

interface TimePickerProps {
  locale: string;
  serviceId: string;
  barberId?: string;
  shopId?: string;
  days: DayOption[];
  activeDate: string;
  slots: SlotOption[];
  service?: ServiceCard;
}

export function TimePicker({
  locale,
  serviceId,
  barberId,
  shopId,
  days,
  activeDate,
  slots,
  service,
}: TimePickerProps) {
  const t = useTranslations('web.guest.booking');

  const base = new URLSearchParams();
  base.set('service', serviceId);
  if (barberId) base.set('barber', barberId);
  if (shopId) base.set('shop', shopId);
  const baseQuery = base.toString();

  const dayHref = (date: string) => `/${locale}/booking/time?${baseQuery}&date=${date}`;
  const activeDay = days.find((d) => d.date === activeDate);

  const slotHref = (time: string) =>
    `/${locale}/booking/summary?${baseQuery}&date=${activeDate}&time=${time}`;
  const openSlots = slots.filter((s) => !s.booked);

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
          {/* Day strip — next 14 days */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_12px_40px_rgba(28,27,27,0.04)] border border-bb-cream-border h-fit">
            <h4 className="font-bold font-display text-lg text-bb-espresso mb-6">
              {activeDay?.label}
            </h4>
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((day) => (
                <Link
                  key={day.date}
                  href={dayHref(day.date)}
                  scroll={false}
                  aria-disabled={day.isClosed}
                  className={cn(
                    'p-1.5 py-2.5 text-center rounded-xl transition text-xs',
                    day.date === activeDate
                      ? 'bg-bb-espresso-gold text-white font-bold shadow-md ring-2 ring-bb-espresso-gold ring-offset-2 ring-offset-white'
                      : day.isClosed
                        ? 'text-bb-cream-border line-through hover:bg-bb-surface-elevated'
                        : 'text-bb-espresso hover:bg-bb-surface-elevated',
                  )}
                >
                  <span className="block text-[9px] font-medium opacity-70">
                    {day.label.split(' ')[0]}
                  </span>
                  <span className="block font-bold text-sm">{day.label.split(' ')[1]}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Slots */}
          {activeDay?.isClosed || openSlots.length === 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-bb-espresso">{t('availableSlots')}</h3>
                <span className="text-bb-on-surface-muted text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">event_busy</span>
                  {t('fullyBooked')}
                </span>
              </div>

              <div className="bg-bb-surface-variant/30 border-2 border-dashed border-bb-cream-border rounded-[2.5rem] p-10 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-bb-surface-elevated flex items-center justify-center">
                  <span className="material-symbols-outlined text-bb-on-surface-muted text-3xl">sentiment_dissatisfied</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-bb-espresso">{t('noSlotsTitle')}</h4>
                  <p className="text-sm text-bb-on-surface-muted max-w-[240px] mx-auto">
                    {t('noSlotsDesc', { day: activeDay?.label ?? '' })}
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4 pt-2">
                <p className="text-xs font-bold text-bb-on-surface-muted uppercase tracking-widest">
                  {t('orExploreAlternatives')}
                </p>
                <Link
                  href={`/${locale}/booking/barber?${baseQuery}`}
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
                    <Link
                      key={slot.time}
                      href={slotHref(slot.time)}
                      className="py-4 px-2 rounded-2xl font-bold text-center transition bg-bb-surface-elevated text-bb-espresso hover:bg-bb-espresso-gold hover:text-white"
                    >
                      <span className="block text-sm">{slot.time}</span>
                      <span className="text-[9px] uppercase tracking-widest font-medium mt-1 block text-bb-on-surface-muted">
                        {t(`periods.${slot.period.toLowerCase()}` as Parameters<typeof t>[0])}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {openSlots.length > 0 && (
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
        service={service ? { name: service.name, duration: service.duration, tier: service.tier } : undefined}
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
