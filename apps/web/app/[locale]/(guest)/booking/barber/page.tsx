import { setRequestLocale } from 'next-intl/server';
import { BookingStepper } from '../components/booking-stepper';
import { BarberSelector } from './components/barber-selector';

interface BarberPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string }>;
}

const BarberPage = async ({ params, searchParams }: BarberPageProps) => {
  const { locale } = await params;
  const { service } = await searchParams;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-20">
        {/* Stepper */}
        <div className="mb-12">
          <BookingStepper currentStep={2} />
        </div>

        {/* Two-column content */}
        <BarberSelector locale={locale} serviceId={service} />
      </div>
    </main>
  );
};

export default BarberPage;
