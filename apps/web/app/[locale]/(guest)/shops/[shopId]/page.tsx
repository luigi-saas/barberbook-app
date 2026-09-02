import { setRequestLocale } from 'next-intl/server';
import { BookingPanel } from './components/booking-panel';
import { ShopHero } from './components/shop-hero';
import { ShopInfoTabs } from './components/shop-info-tabs';

interface ShopPageProps {
  params: Promise<{ locale: string; shopId: string }>;
}

const ShopPage = async ({ params }: ShopPageProps) => {
  const { locale, shopId: _shopId } = await params;
  setRequestLocale(locale);

  // Mock shop data — in production this would be fetched from CMS/DB
  const shop = {
    name: 'Salon Alaoui',
    city: 'Casablanca, Maarif',
    rating: 4.9,
    isOpen: true,
  };

  return (
    <main className="min-h-screen bg-bb-cream">
      <ShopHero
        shopName={shop.name}
        city={shop.city}
        rating={shop.rating}
        isOpen={shop.isOpen}
        locale={locale}
      />

      <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <ShopInfoTabs />
          </div>

          {/* Sticky booking panel */}
          <aside className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-24">
            <BookingPanel />
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ShopPage;
