import { BBShopCard } from '@/components/ui/bb-shop-card';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ExploreFilters } from './components/explore-filters';
import { ExploreSearchBar } from './components/explore-search-bar';
import { ExploreServiceChips } from './components/explore-service-chips';
import { ExplorePagination } from './components/explore-pagination';

interface ExplorePageProps {
  params: Promise<{ locale: string }>;
}

const MOCK_SHOPS = [
  {
    id: '1',
    name: 'The Royal Cut',
    location: 'Gauthier, Casablanca',
    rating: 4.9,
    reviewCount: 124,
    price: '150 MAD',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
  },
  {
    id: '2',
    name: 'Heritage Grooming',
    location: 'Maarif, Casablanca',
    rating: 4.8,
    reviewCount: 89,
    price: '120 MAD',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
  },
  {
    id: '3',
    name: 'Atlas Barbering',
    location: 'Hivernage, Marrakech',
    rating: 4.7,
    reviewCount: 210,
    price: '100 MAD',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
  },
  {
    id: '4',
    name: 'Elite Lounge',
    location: 'Agdal, Rabat',
    rating: 5.0,
    reviewCount: 45,
    price: '200 MAD',
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80',
  },
  {
    id: '5',
    name: 'Andalucia Barbier',
    location: 'Centre, Tanger',
    rating: 4.8,
    reviewCount: 67,
    price: '90 MAD',
    imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
  },
  {
    id: '6',
    name: 'Souss Elite Cut',
    location: 'Talborjt, Agadir',
    rating: 4.5,
    reviewCount: 38,
    price: '80 MAD',
    imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&q=80',
  },
];

const ExplorePage = async ({ params }: ExplorePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('web.guest.explore');

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
                  {t('shopCount', { count: MOCK_SHOPS.length })}
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
                {t('shopCount', { count: MOCK_SHOPS.length })}
              </p>

              {MOCK_SHOPS.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <p className="font-display text-xl font-semibold text-bb-espresso/40">
                    {t('noResults')}
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {MOCK_SHOPS.map((shop) => (
                    <BBShopCard
                      key={shop.id}
                      name={shop.name}
                      location={shop.location}
                      rating={shop.rating}
                      reviewCount={shop.reviewCount}
                      price={shop.price}
                      priceLabel={t('startingFrom')}
                      imageUrl={shop.imageUrl}
                      imageAlt={shop.name}
                      viewProfileLabel={t('viewProfile')}
                      viewProfileHref={`/${locale}/shops/${shop.id}`}
                    />
                  ))}
                </div>
              )}

              <ExplorePagination totalPages={12} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ExplorePage;
