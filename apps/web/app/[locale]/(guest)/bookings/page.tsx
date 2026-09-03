import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BBEmptyState } from '@/components/ui/bb-empty-state';
import { BBLinkButton } from '@/components/ui/bb-button';
import { BBCard } from '@/components/ui/bb-card';
import { BBBadge } from '@/components/ui/bb-badge';
import { formatShopTime, listBookingsByPhone } from '@/lib/booking';
import { cancelBookingAction } from './actions';

// Live booking data — never bake into a static build.
export const dynamic = 'force-dynamic';

interface BookingsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ phone?: string; cancel?: string }>;
}

const dateFmt = (locale: string, date: Date) =>
  new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Africa/Casablanca',
  }).format(date);

const statusVariant: Record<string, 'gold' | 'success' | 'muted' | 'outline'> = {
  PENDING: 'gold',
  CONFIRMED: 'success',
  IN_PROGRESS: 'gold',
  COMPLETED: 'muted',
  CANCELLED: 'outline',
  NO_SHOW: 'outline',
  RESCHEDULED: 'gold',
};

const BookingsPage = async ({ params, searchParams }: BookingsPageProps) => {
  const { locale } = await params;
  const { phone, cancel } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'web.guest.bookings' });

  const inputClass =
    'w-full rounded-2xl border-2 border-bb-cream-border bg-white px-4 py-3.5 font-sans text-sm text-bb-espresso placeholder:text-bb-on-surface-muted/50 transition focus:border-bb-espresso-gold focus:outline-none';

  const lookedUp = phone?.trim() ?? '';
  let upcoming: Awaited<ReturnType<typeof listBookingsByPhone>>['upcoming'] = [];
  let past: Awaited<ReturnType<typeof listBookingsByPhone>>['past'] = [];
  if (lookedUp) {
    try {
      const result = await listBookingsByPhone(lookedUp);
      upcoming = result.upcoming;
      past = result.past;
    } catch (error) {
      console.error('[bookings] database unavailable:', error instanceof Error ? error.message : error);
    }
  }

  const bookingCard = (booking: (typeof upcoming)[number], isUpcoming: boolean) => (
    <BBCard key={booking.reference} className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-lg font-bold text-bb-espresso">{booking.serviceName}</p>
          <p className="mt-1 text-sm text-bb-on-surface-muted">
            {booking.shopName} · {t('with')} {booking.barberName}
          </p>
          <p className="mt-2 text-sm font-semibold text-bb-espresso">
            {dateFmt(locale, booking.scheduledAt)} · {formatShopTime(booking.scheduledAt)}–
            {formatShopTime(booking.endsAt)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <BBBadge variant={statusVariant[booking.status] ?? 'muted'}>{booking.status}</BBBadge>
          <span className="font-display font-black text-bb-espresso-gold">
            {booking.price} MAD
          </span>
          <span className="font-mono text-[11px] text-bb-on-surface-muted">
            #BB-{booking.reference}
          </span>
        </div>
      </div>

      {isUpcoming && booking.canCancel && (
        <form action={cancelBookingAction} className="mt-4 border-t border-bb-cream-border pt-4">
          <input type="hidden" name="ref" value={booking.reference} />
          <input type="hidden" name="phone" value={lookedUp} />
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="text-xs font-semibold text-bb-error transition hover:underline"
          >
            {t('cancel')}
          </button>
        </form>
      )}
    </BBCard>
  );

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-[1280px] px-6 py-12 lg:py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-bb-espresso">
            {t('title')}
          </h1>
          <p className="mt-3 text-bb-on-surface-muted">{t('subtitle')}</p>
        </div>

        {/* Lookup form */}
        <form
          method="GET"
          className="mx-auto mb-12 flex max-w-xl flex-col gap-3 rounded-[1.75rem] border border-bb-cream-border bg-white p-6 shadow-[var(--bb-shadow-onboarding)] sm:flex-row sm:items-end"
        >
          <label className="flex-1">
            <span className="mb-1.5 block text-xs font-semibold text-bb-espresso">
              {t('phoneLabel')}
            </span>
            <input
              className={inputClass}
              type="tel"
              name="phone"
              inputMode="tel"
              required
              placeholder={t('phonePlaceholder')}
              defaultValue={lookedUp}
              autoComplete="tel"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-bb-espresso-gold px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(119,90,25,0.45)] transition hover:bg-bb-espresso-gold-deep"
          >
            {t('lookup')}
          </button>
        </form>

        {cancel && cancel !== 'ok' && cancel !== 'not_found' && (
          <p className="mx-auto mb-6 max-w-xl rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-600">
            {t('cancelError')}
          </p>
        )}
        {cancel === 'ok' && (
          <p className="mx-auto mb-6 max-w-xl rounded-xl border border-bb-success/20 bg-bb-success/5 px-4 py-3 text-center text-xs font-bold text-bb-success">
            {t('cancelled')}
          </p>
        )}

        {lookedUp && upcoming.length === 0 && past.length === 0 ? (
          <BBEmptyState
            icon="calendar_off"
            title={t('none')}
            text={t('noneHint')}
            action={<BBLinkButton href={`/${locale}/booking`}>{t('bookNow')}</BBLinkButton>}
          />
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="mx-auto max-w-3xl space-y-4">
                <h2 className="font-display text-xl font-bold text-bb-espresso">{t('upcoming')}</h2>
                {upcoming.map((booking) => bookingCard(booking, true))}
              </section>
            )}
            {past.length > 0 && (
              <section className="mx-auto mt-10 max-w-3xl space-y-4">
                <h2 className="font-display text-xl font-bold text-bb-espresso">{t('past')}</h2>
                {past.slice(0, 10).map((booking) => bookingCard(booking, false))}
              </section>
            )}
          </>
        )}

        <p className="mt-10 text-center text-[11px] text-bb-on-surface-muted/60">{t('phoneHint')}</p>
      </div>
    </main>
  );
};

export default BookingsPage;
