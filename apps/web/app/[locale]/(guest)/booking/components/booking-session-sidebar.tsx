'use client';

import { cn } from '@repo/design-system/lib/utils';
import { useTranslations } from 'next-intl';

interface SessionService {
  name: string;
  duration: string;
  tier: string;
}

interface SessionBarber {
  name: string;
  avatarUrl?: string;
  tagline?: string;
}

interface SessionTime {
  label: string;
}

interface BookingSessionSidebarProps {
  service?: SessionService;
  barber?: SessionBarber;
  time?: SessionTime;
  totalAmount?: string;
  totalLabel?: string;
  vatLabel?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  policyTitle?: string;
  policyText?: string;
  termsText?: React.ReactNode;
  className?: string;
}

export function BookingSessionSidebar({
  service,
  barber,
  time,
  totalAmount,
  totalLabel,
  vatLabel,
  primaryAction,
  secondaryAction,
  policyTitle,
  policyText,
  termsText,
  className,
}: BookingSessionSidebarProps) {
  const t = useTranslations('web.guest.booking.sidebar');

  return (
    <aside className={cn('w-full lg:w-[400px]', className)}>
      <div className="sticky top-28 space-y-6">
        {/* Session card */}
        <div className="rounded-[2.5rem] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-bb-cream-border">
          <h3 className="font-display text-2xl font-black uppercase tracking-tight text-bb-espresso mb-6">
            {t('title')}
          </h3>

          <div className="space-y-6">
            {/* Service row */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-bb-gold-muted flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-bb-gold">spa</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-bb-on-surface-muted uppercase tracking-widest">
                  {t('serviceLabel')}
                </p>
                {service ? (
                  <>
                    <h4 className="font-bold text-bb-espresso">{service.name}</h4>
                    <p className="text-xs text-bb-on-surface-muted">
                      {service.duration} · {service.tier}
                    </p>
                  </>
                ) : (
                  <h4 className="font-bold text-bb-on-surface-muted/50 italic text-sm">
                    {t('selectService')}
                  </h4>
                )}
              </div>
            </div>

            {/* Barber row */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-bb-gold-muted flex items-center justify-center shrink-0 overflow-hidden">
                {barber?.avatarUrl ? (
                  <img
                    src={barber.avatarUrl}
                    alt={barber.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-bb-gold">person</span>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold text-bb-on-surface-muted uppercase tracking-widest">
                  {t('barberLabel')}
                </p>
                {barber ? (
                  <>
                    <h4 className="font-bold text-bb-espresso">{barber.name}</h4>
                    {barber.tagline && (
                      <p className="text-xs text-bb-success font-medium">{barber.tagline}</p>
                    )}
                  </>
                ) : (
                  <h4 className="font-bold text-bb-on-surface-muted/50 italic text-sm">
                    {t('selectBarber')}
                  </h4>
                )}
              </div>
            </div>

            {/* Time row */}
            <div
              className={cn(
                'flex gap-4 p-4 rounded-2xl border',
                time
                  ? 'bg-bb-gold-muted/30 border-bb-espresso-gold/20'
                  : 'bg-bb-surface-variant border-bb-cream-border italic',
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  time ? 'bg-bb-espresso-gold' : 'bg-bb-outline/30',
                )}
              >
                <span
                  className={cn(
                    'material-symbols-outlined text-xl',
                    time ? 'text-white' : 'text-bb-on-surface-muted',
                  )}
                >
                  schedule
                </span>
              </div>
              <div>
                <p
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-widest',
                    time ? 'text-bb-espresso-gold' : 'text-bb-on-surface-muted',
                  )}
                >
                  {t('timeLabel')}
                </p>
                <h4
                  className={cn(
                    'font-bold',
                    time ? 'text-bb-espresso-gold' : 'text-bb-on-surface-muted',
                  )}
                >
                  {time ? time.label : t('selectTime')}
                </h4>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-[2px] bg-bb-surface-elevated" />

          {/* Total */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-sm font-semibold text-bb-on-surface-muted">
                {totalLabel ?? t('total')}
              </p>
              <p className="text-xs text-bb-on-surface-muted/60 italic">
                {vatLabel ?? t('vat')}
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-bb-espresso-gold">
                {totalAmount ?? '— MAD'}
              </span>
            </div>
          </div>

          {/* Actions */}
          {primaryAction && <div className="space-y-3">{primaryAction}</div>}
          {secondaryAction && <div className="mt-3">{secondaryAction}</div>}

          {termsText && (
            <p className="mt-6 text-[10px] text-center text-bb-on-surface-muted/60 leading-relaxed px-4">
              {termsText}
            </p>
          )}
        </div>

        {/* Policy badge */}
        {(policyTitle || policyText) && (
          <div className="p-6 bg-bb-success/5 rounded-3xl border border-bb-success/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-bb-success/10 flex items-center justify-center shrink-0 mt-0.5">
              <span
                className="material-symbols-outlined text-bb-success text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                info
              </span>
            </div>
            <div>
              {policyTitle && (
                <h5 className="font-bold text-sm text-bb-success">{policyTitle}</h5>
              )}
              {policyText && (
                <p className="text-xs text-bb-on-surface-muted mt-1 leading-relaxed">
                  {policyText}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
