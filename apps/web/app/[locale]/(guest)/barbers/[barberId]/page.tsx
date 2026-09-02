import { setRequestLocale } from 'next-intl/server';
import { BarberProfileCard } from './components/barber-profile-card';

interface BarberPageProps {
  params: Promise<{ locale: string; barberId: string }>;
}

const PORTFOLIO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80',
    label: 'Style: Classic Taper',
  },
  {
    src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80',
    label: 'Style: Modern Skin Fade',
  },
  {
    src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80',
    label: 'Style: Textured Crop',
  },
];

const BarberPage = async ({ params }: BarberPageProps) => {
  const { locale, barberId: _barberId } = await params;
  setRequestLocale(locale);

  const barber = {
    name: 'Yassine',
    title: 'Master Artisan & Grooming Expert',
    shopName: "L'Artisan Moderne",
    shopId: '1',
    specialty: ['Beard Sculpting', 'Skin Fade', 'Hot Towel Ritual', 'Classic Taper'],
    rating: 4.9,
    reviewCount: 124,
    bio: "Specializing in Traditional Moroccan grooming infused with contemporary precision. Yassine curates an experience that honors heritage while delivering modern sharpness.",
    nextAvailability: 'Today, 4:30 PM',
    priceFrom: '120 MAD',
  };

  return (
    <main className="min-h-screen bg-bb-on-surface-muted/30 py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <BarberProfileCard
          name={barber.name}
          title={barber.title}
          shopName={barber.shopName}
          shopId={barber.shopId}
          specialty={barber.specialty}
          rating={barber.rating}
          reviewCount={barber.reviewCount}
          bio={barber.bio}
          nextAvailability={barber.nextAvailability}
          priceFrom={barber.priceFrom}
          portfolioImages={PORTFOLIO_IMAGES}
          locale={locale}
        />
      </div>
    </main>
  );
};

export default BarberPage;
