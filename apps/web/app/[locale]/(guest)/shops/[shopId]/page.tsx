import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { formatShopTime, getShop, listBarbers, listServices, todayInShopTz, weekdayOf } from '@/lib/booking';
import { BookingPanel } from './components/booking-panel';
import { ShopHero } from './components/shop-hero';
import { ShopInfoTabs } from './components/shop-info-tabs';

// Live shop/availability data — never bake into a static build.
export const dynamic = 'force-dynamic';

interface ShopPageProps {
  params: Promise<{ locale: string; shopId: string }>;
}

const ShopPage = async ({ params }: ShopPageProps) => {
  const { locale, shopId } = await params;
  setRequestLocale(locale);

  const logDbDown = (error: unknown) => {
    console.error("[shop] database unavailable:", error instanceof Error ? error.message : error);
    return null;
  };
  const shop = await getShop(shopId).catch(logDbDown);
  if (!shop) notFound();

  const services = (await listServices(shop.id).catch(logDbDown)) ?? [];
  const barbers = (await listBarbers(shop.id).catch(logDbDown)) ?? [];

  const today = todayInShopTz();
  const hoursToday = shop.openingHours.find((h) => h.dayOfWeek === weekdayOf(today));
  const isOpen = Boolean(hoursToday && !hoursToday.isClosed);
  const isOpenNow = Boolean(
    isOpen &&
      hoursToday &&
      formatShopTime(new Date()) >= hoursToday.openTime &&
      formatShopTime(new Date()) < hoursToday.closeTime,
  );

  const gallery = Array.from(
    new Set([
      shop.coverUrl,
      '/images/hero-royal.jpg',
      '/images/svc-royal-cut.jpg',
      '/images/svc-beard-grooming.jpg',
      '/images/svc-facial.jpg',
      '/images/svc-traditional-shave.jpg',
    ]),
  ).slice(0, 6);

  return (
    <main className="min-h-screen bg-bb-cream">
      <ShopHero
        shopName={shop.name}
        city={`${shop.address ? `${shop.address}, ` : ''}${shop.city}`}
        rating={shop.rating}
        reviewCount={shop.reviewCount}
        isOpen={isOpenNow}
        coverUrl={shop.coverUrl}
        locale={locale}
      />

      <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <ShopInfoTabs
              locale={locale}
              shopId={shop.id}
              services={services}
              barbers={barbers}
              gallery={gallery}
              openingHours={shop.openingHours}
            />
          </div>

          {/* Sticky booking panel */}
          <aside className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-24">
            <BookingPanel locale={locale} shopId={shop.id} services={services} />
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ShopPage;
