import { setRequestLocale } from 'next-intl/server';
import { getPrimaryShop, getShop, listBarbers } from '@/lib/booking';
import { BookingStepper } from '../components/booking-stepper';
import { BarberSelector } from './components/barber-selector';

interface BarberPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string; shop?: string }>;
}

const BarberPage = async ({ params, searchParams }: BarberPageProps) => {
  const { locale } = await params;
  const { service, shop: shopParam } = await searchParams;
  setRequestLocale(locale);

  const shop = shopParam ? (await getShop(shopParam)) ?? (await getPrimaryShop()) : await getPrimaryShop();
  const barbers = shop ? await listBarbers(shop.id) : [];

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-20">
        {/* Stepper */}
        <div className="mb-12">
          <BookingStepper currentStep={2} />
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
