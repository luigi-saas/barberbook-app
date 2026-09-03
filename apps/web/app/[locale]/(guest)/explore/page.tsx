import { BBShopCard } from '@/components/ui/bb-shop-card';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { listShops } from '@/lib/booking';
import { ExploreFilters } from './components/explore-filters';
import { ExplorePagination } from './components/explore-pagination';
import { ExploreSearchBar } from './components/explore-search-bar';
import { ExploreServiceChips } from './components/explore-service-chips';

// Live shop/availability data — never bake into a static build.
export const dynamic = 'force-dynamic';

interface ExplorePageProps {
  params: Promise<{ locale: string }>;
}

const ExplorePage = async ({ params }: ExplorePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('web.guest.explore');

  const shops = (await listShops().catch((error: unknown) => {
    console.error("[explore] database unavailable:", error instanceof Error ? error.message : error);
    return [];
  })) ?? [];
  const totalPages = Math.max(1, Math.ceil(shops.length / 9));

  return (
    <main className="min-h-screen bg-bb-cream">
      {/* Header */}
      <section className="bg-bb-espresso px-6 py-16">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.15em] text-bb-cream/60 mb-3">
            {t('subtitle')}
          </p>
          <h1 className="font-display text-4xl font-bold text-bb-cream mb-8 lg:text-5xl">
            {t('title')}
          </h1>
          <ExploreSearchBar />
        </div>
      </section>

      {/* Service chips */}
      <div className="border-b border-bb-cream-border bg-white">
        <div className="mx-auto max-w-[1280px] px-6">
          <ExploreServiceChips />
        </div>
      </div>

      {/* Content */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar filters — desktop */}
            <aside className="hidden lg:block w-72 shrink-0">
              <ExploreFilters />
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Mobile filter button */}
              <div className="mb-6 flex items-center justify-between lg:hidden">
                <p className="font-sans text-sm text-bb-espresso/60">
                  {t('shopCount', { count: shops.length })}
                </p>
                <button
                  type="button"
                  className="rounded-full border border-bb-espresso/20 px-5 py-2 font-sans text-sm font-medium text-bb-espresso transition hover:bg-bb-espresso/5"
                >
                  {t('filters.title')}
                </button>
              </div>

              {/* Desktop shop count */}
              <p className="hidden lg:block font-sans text-sm text-bb-espresso/60 mb-6">
                {t('shopCount', { count: shops.length })}
              </p>

              {shops.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <p className="font-display text-xl font-semibold text-bb-espresso/40">
                    {t('noResults')}
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {shops.map((shop) => (
                    <BBShopCard
                      key={shop.id}
                      name={shop.name}
                      location={shop.city}
                      rating={shop.rating}
                      reviewCount={shop.reviewCount}
                      price={shop.minPrice}
                      priceLabel={t('startingFrom')}
                      imageUrl={shop.coverUrl}
                      imageAlt={shop.name}
                      viewProfileLabel={t('viewProfile')}
                      viewProfileHref={`/${locale}/shops/${shop.slug}`}
                    />
                  ))}
                </div>
              )}

              <ExplorePagination totalPages={totalPages} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ExplorePage;
