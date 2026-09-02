import { setRequestLocale } from 'next-intl/server';
import { BookingStepper } from './components/booking-stepper';
import { ServiceSelector } from './components/service-selector';

interface BookingPageProps {
  params: Promise<{ locale: string }>;
}

const BookingPage = async ({ params }: BookingPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-20">
        {/* Stepper */}
        <div className="mb-12">
          <BookingStepper currentStep={1} />
        </div>

        <ServiceSelector locale={locale} />
      </div>
    </main>
  );
};

export default BookingPage;
