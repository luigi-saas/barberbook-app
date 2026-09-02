'use client';

import { cn } from '@repo/design-system/lib/utils';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface GuestFormProps {
  locale: string;
  shopId: string;
  serviceId: string;
  barberId?: string;
  date: string;
  time: string;
  shopName: string;
  serviceName: string;
  serviceDuration: string;
  price: string;
  dayLabel: string;
}

export function GuestForm(props: GuestFormProps) {
  const {
    locale,
    shopId,
    serviceId,
    barberId,
    date,
    time,
    shopName,
    serviceName,
    serviceDuration,
    price,
    dayLabel,
  } = props;
  const t = useTranslations('web.guest.booking');
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = firstName.trim().length >= 2 && phone.replace(/\D/g, '').length >= 9;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId,
          serviceId,
          barberId,
          date,
          time,
          firstName,
          lastName,
          phone,
          notes,
        }),
      });
      const data = (await response.json()) as { reference?: string; error?: string };
      if (!response.ok || !data.reference) {
        setError(
          data.error === 'slot_taken'
            ? t('errors.slotTaken')
            : t('errors.generic'),
        );
        setSubmitting(false);
        return;
      }
      router.push(`/${locale}/booking/confirmed?ref=${data.reference}`);
    } catch {
      setError(t('errors.generic'));
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3.5 rounded-2xl border-2 border-bb-cream-border bg-white font-sans text-sm text-bb-espresso placeholder:text-bb-on-surface-muted/50 focus:border-bb-espresso-gold focus:outline-none transition';

  return (
    <aside className="w-full lg:w-[400px]">
      <div className="sticky top-28 space-y-6">
        <form
          onSubmit={submit}
          className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-bb-cream-border"
        >
          <h3 className="font-display text-2xl font-black uppercase tracking-tight text-bb-espresso mb-2">
            {t('form.title')}
          </h3>
          <p className="text-xs text-bb-on-surface-muted mb-6">{t('form.subtitle')}</p>

          {/* Recap */}
          <div className="mb-6 p-4 rounded-2xl bg-bb-gold-muted/20 border border-bb-espresso-gold/10 text-sm space-y-1">
            <p className="font-bold text-bb-espresso">{serviceName}</p>
            <p className="text-bb-on-surface-muted">
              {dayLabel} · {time} · {serviceDuration}
            </p>
            <p className="text-bb-on-surface-muted">{shopName}</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                className={inputClass}
                placeholder={t('form.firstName')}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                minLength={2}
                autoComplete="given-name"
              />
              <input
                className={inputClass}
                placeholder={t('form.lastName')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </div>
            <input
              className={inputClass}
              placeholder={t('form.phone')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
            />
            <textarea
              className={cn(inputClass, 'min-h-[80px] resize-none')}
              placeholder={t('form.notes')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
            />
          </div>

          {error && (
            <p className="mt-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* Total + CTA */}
          <div className="flex justify-between items-center my-6">
            <div>
              <p className="text-sm font-semibold text-bb-on-surface-muted">{t('sidebar.total')}</p>
              <p className="text-[11px] text-bb-on-surface-muted/60">{t('form.payAtShop')}</p>
            </div>
            <span className="text-2xl font-black text-bb-espresso-gold">{price}</span>
          </div>

          <button
            type="submit"
            disabled={!valid || submitting}
            className={cn(
              'w-full py-4 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-2',
              valid && !submitting
                ? 'bg-bb-espresso-gold text-white shadow-[0_8px_20px_rgba(119,90,25,0.25)] hover:scale-[0.98]'
                : 'bg-bb-cream-border text-bb-on-surface-muted cursor-not-allowed',
            )}
          >
            <span className="material-symbols-outlined text-xl">
              {submitting ? 'hourglass_top' : 'event_available'}
            </span>
            {submitting ? t('form.submitting') : t('form.confirm')}
          </button>

          <p className="mt-4 text-[10px] text-center text-bb-on-surface-muted/60 leading-relaxed">
            {t('termsPrefix')}{' '}
            <a href="#" className="underline">
              {t('termsLink')}
            </a>{' '}
            {t('cancellationSuffix')}
          </p>
        </form>

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
            <h5 className="font-bold text-sm text-bb-success">{t('flexibilityPolicyTitle')}</h5>
            <p className="text-xs text-bb-on-surface-muted mt-1 leading-relaxed">
              {t('flexibilityPolicyText')}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
