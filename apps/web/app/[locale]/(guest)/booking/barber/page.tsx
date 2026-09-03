import { setRequestLocale } from 'next-intl/server';
import { getPrimaryShop, getShop, listBarbers } from '@/lib/booking';
import { BookingStepper } from '../components/booking-stepper';
import { BarberSelector } from './components/barber-selector';

// Live shop/availability data — never bake into a static build.
export const dynamic = 'force-dynamic';

interface BarberPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string; shop?: string }>;
}

const BarberPage = async ({ params, searchParams }: BarberPageProps) => {
  const { locale } = await params;
  const { service, shop: shopParam } = await searchParams;
  const shopQuery = shopParam ? `&shop=${shopParam}` : '';
  setRequestLocale(locale);

  const shop = shopParam ? (await getShop(shopParam)) ?? (await getPrimaryShop()) : await getPrimaryShop();
  const barbers = shop ? await listBarbers(shop.id) : [];

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-32 lg:pb-20">
        {/* Stepper */}
        <div className="mb-12">
          <BookingStepper
          currentStep={2}
          hrefs={[`/${locale}/booking${service ? `?service=${service}` : ''}${shopQuery}`]}
        />
        </div>

        {/* Two-column content */}
        <BarberSelector
          locale={locale}
          serviceId={service}
          barbers={barbers}
          shopId={shop?.id}
        />
      </div>
    </main>
  );
};

export default BarberPage;
