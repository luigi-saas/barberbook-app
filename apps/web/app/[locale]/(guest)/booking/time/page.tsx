import { setRequestLocale } from 'next-intl/server';
import { BookingStepper } from '../components/booking-stepper';
import { TimePicker } from './components/time-picker';

interface TimePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ barber?: string; service?: string }>;
}

const TimePage = async ({ params, searchParams }: TimePageProps) => {
  const { locale } = await params;
  const { barber, service } = await searchParams;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-20">
        {/* Stepper */}
        <div className="mb-12">
          <BookingStepper currentStep={3} />
        </div>

        {/* Two-column content */}
        <TimePicker locale={locale} barberId={barber} serviceId={service} />
      </div>
    </main>
  );
};

export default TimePage;
