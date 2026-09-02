import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  formatShopTime,
  getPrimaryShop,
  getService,
  getShop,
  shopTimeToDate,
} from '@/lib/booking';
import { BookingStepper } from '../components/booking-stepper';
import { GuestForm } from './components/guest-form';

interface SummaryPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    barber?: string;
    service?: string;
    shop?: string;
    date?: string;
    time?: string;
  }>;
}

const SummaryPage = async ({ params, searchParams }: SummaryPageProps) => {
  const { locale } = await params;
  const { barber, service: serviceId, shop: shopParam, date, time } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'web.guest.booking' });

  const shop = shopParam
    ? (await getShop(shopParam)) ?? (await getPrimaryShop())
    : await getPrimaryShop();
  const service = serviceId ? await getService(serviceId) : null;

  if (!shop || !service || !date || !time) {
    return (
      <main className="min-h-screen bg-bb-cream">
        <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-20">
          <BookingStepper currentStep={4} />
          <p className="mt-12 text-center text-sm text-bb-on-surface-muted">
            {t('selectTimeToConfirm')}
          </p>
        </div>
      </main>
    );
  }

  const dayLabel = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00+01:00`));

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-20">
        {/* Stepper */}
        <div className="mb-12">
          <BookingStepper currentStep={4} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: receipt */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-col gap-1">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-bb-espresso">
                {t('summary.title')}
              </h1>
              <p className="text-bb-on-surface-muted max-w-xl font-sans text-sm">
                {t('summary.subtitle')}
              </p>
            </div>

            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-bb-cream-border">
              <div className="bg-bb-espresso px-8 py-6">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-bb-cream/50 mb-1">
                  {t('summary.receiptLabel')}
                </p>
                <p className="font-display text-2xl font-bold text-bb-cream">{shop.name}</p>
                <p className="mt-1 font-sans text-sm text-bb-cream/60">
                  {shop.address}, {shop.city}
                </p>
              </div>

              <div className="px-8 py-6 flex flex-col gap-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-bb-gold-muted flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-bb-espresso-gold text-xl">spa</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-bb-on-surface-muted uppercase tracking-widest">
                      {t('sidebar.serviceLabel')}
                    </p>
                    <p className="font-bold text-bb-espresso">{service.name}</p>
                    <p className="text-xs text-bb-on-surface-muted">
                      {service.duration} · {service.tier}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-bb-gold-muted flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-bb-espresso-gold text-xl">event</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-bb-on-surface-muted uppercase tracking-widest">
                      {t('summary.dateLabel')}
                    </p>
                    <p className="font-bold text-bb-espresso capitalize">{dayLabel}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-bb-espresso-gold flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-xl">schedule</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-bb-espresso-gold uppercase tracking-widest">
                      {t('sidebar.timeLabel')}
                    </p>
                    <p className="font-bold text-bb-espresso-gold">
                      {time} —{' '}
                      {formatShopTime(
                        new Date(
                          shopTimeToDate(date, time).getTime() + service.durationMinutes * 60_000,
                        ),
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-bb-cream-border px-8 py-6 flex items-center justify-between">
                <div>
                  <p className="font-sans text-sm font-semibold text-bb-on-surface-muted">
                    {t('sidebar.total')}
                  </p>
                  <p className="text-xs text-bb-on-surface-muted/60 italic">{t('sidebar.vat')}</p>
                </div>
                <span className="font-display text-3xl font-black text-bb-espresso-gold">
                  {service.price}
                </span>
              </div>
            </div>
          </div>

          {/* Right: guest checkout */}
          <GuestForm
            locale={locale}
            shopId={shop.id}
            serviceId={service.id}
            barberId={barber}
            date={date}
            time={time}
            shopName={shop.name}
            serviceName={service.name}
            serviceDuration={service.duration}
            price={service.price}
            dayLabel={dayLabel}
          />
        </div>
      </div>
    </main>
  );
};

export default SummaryPage;
