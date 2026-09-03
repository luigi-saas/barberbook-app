import { database } from '@repo/database';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPrimaryShop, listServices } from '@/lib/booking';
import { BarberProfileCard } from './components/barber-profile-card';

// Live shop/availability data — never bake into a static build.
export const dynamic = 'force-dynamic';

interface BarberPageProps {
  params: Promise<{ locale: string; barberId: string }>;
}

const PORTFOLIO_IMAGES = [
  { src: '/images/svc-royal-cut.jpg', label: 'Style: Signature Royal Cut' },
  { src: '/images/svc-beard-grooming.jpg', label: 'Style: Beard Sculpting' },
  { src: '/images/svc-traditional-shave.jpg', label: 'Style: Traditional Shave' },
];

const BarberPage = async ({ params }: BarberPageProps) => {
  const { locale, barberId } = await params;
  setRequestLocale(locale);

  const logDbDown = (error: unknown) => {
    console.error("[barber] database unavailable:", error instanceof Error ? error.message : error);
    return null;
  };
  const row = await database.barber
    .findUnique({
      where: { id: barberId },
      include: { user: true, shops: { include: { shop: true } } },
    })
    .catch(logDbDown);
  if (!row || !row.isActive) notFound();

  const shop = row.shops[0]?.shop ?? (await getPrimaryShop().catch(logDbDown));
  if (!shop) notFound();

  const services = (await listServices(shop.id).catch(logDbDown)) ?? [];
  const priceFrom = services.length ? Math.min(...services.map((s) => s.priceValue)) : 0;

  const now = new Date();
  const nextSlot = new Date(Math.ceil(now.getTime() / (30 * 60_000)) * 30 * 60_000 + 60 * 60_000);
  const nextAvailability = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : locale, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Casablanca',
  }).format(nextSlot);

  return (
    <main className="min-h-screen bg-bb-on-surface-muted/30 py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <BarberProfileCard
          name={`${row.user.firstName} ${row.user.lastName}`}
          title={row.bio?.split('·')[0]?.trim() || 'Master Artisan'}
          shopName={shop.name}
          shopId={shop.slug}
          specialty={row.bio?.split('·')[0]?.split(',').map((s) => s.trim()).filter(Boolean) ?? ['Barbering']}
          rating={4.9}
          reviewCount={0}
          bio={row.bio ?? ''}
          nextAvailability={nextAvailability}
          priceFrom={`${priceFrom} MAD`}
          portfolioImages={PORTFOLIO_IMAGES}
          locale={locale}
        />
      </div>
    </main>
  );
};

export default BarberPage;
