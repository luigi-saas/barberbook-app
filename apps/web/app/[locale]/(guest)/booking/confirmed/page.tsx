import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { formatShopTime, getBookingByReference } from '@/lib/booking';
import { CopyReference } from './components/copy-reference';
import { BookingStepper } from '../components/booking-stepper';

interface ConfirmedPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string }>;
}

const ConfirmedPage = async ({ params, searchParams }: ConfirmedPageProps) => {
  const { locale } = await params;
  const { ref } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'web.guest.booking' });

  const booking = ref ? await getBookingByReference(ref) : null;

  if (!booking) {
    return (
      <main className="min-h-screen bg-bb-cream">
        <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-20">
          <BookingStepper currentStep={4} />
          <div className="max-w-xl mx-auto mt-16 p-10 rounded-[2.5rem] border-2 border-dashed border-bb-cream-border bg-white text-center">
            <h1 className="font-display text-2xl font-bold text-bb-espresso">
              {t('confirmed.notFoundTitle')}
            </h1>
            <p className="text-sm text-bb-on-surface-muted mt-2">{t('confirmed.notFoundText')}</p>
            <Link
              href={`/${locale}/booking`}
              className="inline-block mt-6 px-8 py-3.5 bg-bb-espresso-gold text-white rounded-2xl font-bold"
            >
              {t('confirmed.newBooking')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const dateLabel = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Africa/Casablanca',
  }).format(booking.scheduledAt);

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-20">
        <BookingStepper currentStep={4} />

        <div className="max-w-2xl mx-auto mt-12">
          {/* Success header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto rounded-full bg-bb-success/10 flex items-center justify-center mb-5">
              <span
                className="material-symbols-outlined text-bb-success text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-bb-espresso">
              {t('confirmed.title')}
            </h1>
            <p className="text-bb-on-surface-muted mt-2 text-sm max-w-md mx-auto">
              {t('confirmed.subtitle')}
            </p>
            <p className="mt-4 inline-block px-6 py-2 rounded-full bg-bb-espresso text-bb-cream font-display font-bold tracking-widest text-lg">
              #BB-{booking.reference}
            </p>
            <div className="flex justify-center">
              <CopyReference reference={booking.reference} />
            </div>
          </div>

          {/* Receipt */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-bb-cream-border">
            <div className="bg-bb-espresso px-8 py-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-bb-cream/50 mb-1">
                {t('summary.shopLabel')}
              </p>
              <p className="font-display text-2xl font-bold text-bb-cream">{booking.shopName}</p>
              <p className="mt-1 font-sans text-sm text-bb-cream/60">
                {booking.shopAddress}, {booking.shopCity}
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
                  <p className="font-bold text-bb-espresso">{booking.serviceName}</p>
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
                  <p className="font-bold text-bb-espresso capitalize">{dateLabel}</p>
                  <p className="text-sm text-bb-on-surface-muted">
                    {formatShopTime(booking.scheduledAt)} — {formatShopTime(booking.endsAt)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-bb-gold-muted flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-bb-espresso-gold text-xl">payments</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-bb-on-surface-muted uppercase tracking-widest">
                    {t('confirmed.paymentLabel')}
                  </p>
                  <p className="font-bold text-bb-espresso">
                    {booking.price} MAD · {t('confirmed.payAtShop')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/booking`}
              className="px-8 py-4 bg-bb-espresso-gold text-white rounded-2xl font-bold text-center hover:bg-bb-espresso-gold-deep transition-colors"
            >
              {t('confirmed.newBooking')}
            </Link>
            <Link
              href={`/${locale}/explore`}
              className="px-8 py-4 border-2 border-bb-cream-border text-bb-espresso rounded-2xl font-bold text-center hover:bg-bb-cream transition-colors"
            >
              {t('confirmed.backHome')}
            </Link>
          </div>

          {/* Calendar + directions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center text-sm">
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                `${booking.serviceName} — ${booking.shopName}`,
              )}&dates=${booking.scheduledAt.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${booking.endsAt
                .toISOString()
                .replace(/[-:]/g, "")
                .split(".")[0]}Z&location=${encodeURIComponent(`${booking.shopAddress}, ${booking.shopCity}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-bb-cream-border bg-white px-5 py-3 font-semibold text-bb-espresso transition hover:bg-bb-cream"
            >
              <span className="material-symbols-outlined text-[18px] text-bb-espresso-gold">event</span>
              {t('cal.google')}
            </a>
            <a
              href={`/api/bookings/${booking.reference}/ics`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-bb-cream-border bg-white px-5 py-3 font-semibold text-bb-espresso transition hover:bg-bb-cream"
            >
              <span className="material-symbols-outlined text-[18px] text-bb-espresso-gold">download</span>
              {t('cal.ics')}
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${booking.shopName} ${booking.shopAddress} ${booking.shopCity}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-bb-cream-border bg-white px-5 py-3 font-semibold text-bb-espresso transition hover:bg-bb-cream"
            >
              <span className="material-symbols-outlined text-[18px] text-bb-espresso-gold">near_me</span>
              {t('shop.map')}
            </a>
          </div>

          <p className="mt-8 text-center text-xs text-bb-on-surface-muted/60">
            {t('confirmed.referenceNote')}
          </p>
        </div>
      </div>
    </main>
  );
};

export default ConfirmedPage;
