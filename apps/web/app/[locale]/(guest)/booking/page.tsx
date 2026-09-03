import { setRequestLocale } from 'next-intl/server';
import { getPrimaryShop, listServices } from '@/lib/booking';
import { BookingStepper } from './components/booking-stepper';
import { ServiceSelector } from './components/service-selector';

// Live shop/availability data — never bake into a static build.
export const dynamic = 'force-dynamic';

interface BookingPageProps {
  params: Promise<{ locale: string }>;
}

const BookingPage = async ({ params }: BookingPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const shop = await getPrimaryShop();
  const services = shop ? await listServices(shop.id) : [];

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-32 lg:pb-20">
        {/* Stepper */}
        <div className="mb-12">
          <BookingStepper currentStep={1} />
        </div>

        {shop && services.length > 0 ? (
          <ServiceSelector locale={locale} services={services} shopId={shop.id} />
        ) : (
          <div className="max-w-xl mx-auto mt-16 p-10 rounded-[2.5rem] border-2 border-dashed border-bb-cream-border bg-white text-center">
            <h1 className="font-display text-2xl font-bold text-bb-espresso">
              Aucun salon disponible pour le moment
            </h1>
            <p className="text-sm text-bb-on-surface-muted mt-2">
              Les salons partenaires arrivent très bientôt sur BarberBook.ma.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default BookingPage;
