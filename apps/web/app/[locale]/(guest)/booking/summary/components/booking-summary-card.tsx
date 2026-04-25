import { cn } from '@repo/design-system/lib/utils';
import { CalendarDays, Clock, CreditCard, Scissors, User } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

interface BookingSummaryCardProps {
  shopName: string;
  barberName: string;
  service: string;
  date: string;
  time: string;
  price: number;
  locale: string;
}

export async function BookingSummaryCard({
  shopName,
  barberName,
  service,
  date,
  time,
  price,
  locale,
}: BookingSummaryCardProps) {
  const t = await getTranslations({ locale, namespace: 'web.guest.booking.summary' });

  const rows = [
    { icon: CalendarDays, label: t('dateLabel'), value: date },
    { icon: Clock, label: t('timeLabel'), value: time },
    { icon: User, label: t('barberLabel'), value: barberName },
    { icon: Scissors, label: t('serviceLabel'), value: service },
    { icon: CreditCard, label: t('priceLabel'), value: `${price} MAD` },
  ];

  return (
    <div className="overflow-hidden rounded-[40px] bg-white shadow-[var(--bb-shadow-onboarding)]">
      {/* Espresso header strip */}
      <div className="bg-bb-espresso px-8 py-6">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-bb-cream/50 mb-1">
          {t('title')}
        </p>
        <p className="font-display text-2xl font-bold text-bb-cream">
          {shopName}
        </p>
        <p className="mt-1 font-sans text-sm text-bb-cream/60">
          #BB-{Math.floor(Math.random() * 90000) + 10000}
        </p>
      </div>

      {/* Info rows */}
      <div className="px-8 py-6 flex flex-col gap-4">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-bb-cream">
              <Icon className="size-4 text-bb-espresso" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-xs text-bb-espresso/50">{label}</p>
              <p className="font-sans text-sm font-semibold text-bb-espresso">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-bb-cream-border px-8 py-6">
        <div className="flex items-center justify-between">
          <span className="font-sans text-base font-semibold text-bb-espresso">
            {t('total')}
          </span>
          <span className="font-display text-2xl font-bold text-bb-espresso">
            {price} MAD
          </span>
        </div>
      </div>
    </div>
  );
}
