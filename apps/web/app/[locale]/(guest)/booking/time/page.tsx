import { setRequestLocale } from 'next-intl/server';
import {
  buildDayOptions,
  computeSlots,
  getPrimaryShop,
  getService,
  getShop,
  todayInShopTz,
} from '@/lib/booking';
import { BookingStepper } from '../components/booking-stepper';
import { TimePicker } from './components/time-picker';

interface TimePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ barber?: string; service?: string; shop?: string; date?: string }>;
}

const TimePage = async ({ params, searchParams }: TimePageProps) => {
  const { locale } = await params;
  const { barber, service: serviceId, shop: shopParam, date } = await searchParams;
  setRequestLocale(locale);

  const shop = shopParam
    ? (await getShop(shopParam)) ?? (await getPrimaryShop())
    : await getPrimaryShop();

  if (!shop || !serviceId) {
    return (
      <main className="min-h-screen bg-bb-cream">
        <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-20">
          <BookingStepper
          currentStep={3}
          hrefs={[
            `/${locale}/booking?service=${serviceId}`,
            `/${locale}/booking/barber?service=${serviceId}${barber ? `&barber=${barber}` : ''}`,
          ]}
        />
          <p className="mt-12 text-center text-sm text-bb-on-surface-muted">
            Choisissez d&apos;abord un service.
          </p>
        </div>
      </main>
    );
  }

  const [service, days] = await Promise.all([getService(serviceId), buildDayOptions(shop.id)]);
  const activeDate =
    date && days.some((d) => d.date === date && !d.isClosed)
      ? date
      : (days.find((d) => !d.isClosed)?.date ?? days[0]?.date ?? todayInShopTz());
  const slots = await computeSlots(shop.id, barber, serviceId, activeDate);

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-20">
        {/* Stepper */}
        <div className="mb-12">
          <BookingStepper
          currentStep={3}
          hrefs={[
            `/${locale}/booking?service=${serviceId}`,
            `/${locale}/booking/barber?service=${serviceId}${barber ? `&barber=${barber}` : ''}`,
          ]}
        />
        </div>

        {/* Two-column content */}
        <TimePicker
          locale={locale}
          serviceId={serviceId}
          barberId={barber}
          shopId={shop.id}
          days={days}
          activeDate={activeDate}
          slots={slots}
          service={service ?? undefined}
        />
      </div>
    </main>
  );
};

export default TimePage;
