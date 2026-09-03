import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BBEmptyState } from '@/components/ui/bb-empty-state';
import { BBLinkButton } from '@/components/ui/bb-button';
import { BBShopCard } from '@/components/ui/bb-shop-card';
import { searchShops } from '@/lib/booking';
import { SearchSortBar } from './components/search-sort-bar';

// Live shop/availability data — never bake into a static build.
export const dynamic = 'force-dynamic';

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; sort?: string; minRating?: string; maxPrice?: string }>;
}

const SearchPage = async ({ params, searchParams }: SearchPageProps) => {
  const { locale } = await params;
  const { q, sort, minRating, maxPrice } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('web.guest.search');

  let dbDown = false;
  let results = await searchShops(q ?? '').catch((error: unknown) => {
    console.error('[search] database unavailable:', error instanceof Error ? error.message : error);
    dbDown = true;
    return [];
  });

  // Filters (Design.md — Filter / sort modal)
  if (!dbDown) {
    if (minRating) {
      const min = Number.parseFloat(minRating);
      if (Number.isFinite(min)) results = results.filter((shop) => shop.rating >= min);
    }
    if (maxPrice) {
      const max = Number.parseFloat(maxPrice);
      if (Number.isFinite(max)) results = results.filter((shop) => shop.minPriceValue <= max);
    }
    // Sort (Design.md — Search results)
    if (sort === 'rating') {
      results = [...results].sort((a, b) => b.rating - a.rating);
    } else if (sort === 'price') {
      results = [...results].sort((a, b) => a.minPriceValue - b.minPriceValue);
    }
  }

  const activeFilters = [
    minRating ? `≥ ${minRating}★` : null,
    maxPrice ? `≤ ${maxPrice} MAD` : null,
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <SearchSortBar />
        <p className="mt-6 mb-6 font-sans text-sm text-bb-espresso/60">
          {dbDown
            ? ''
            : `${results.length} ${results.length === 1 ? 'résultat' : 'résultats'}${
                q?.trim() ? ` pour « ${q.trim()} »` : ''
              }${activeFilters.length ? ` · ${activeFilters.join(' · ')}` : ''}`}
        </p>

        {dbDown ? (
          <BBEmptyState
            icon="cloud_off"
            title={t('dbDownTitle')}
            text={t('dbDownText')}
            action={<BBLinkButton href={`/${locale}/search`}>{t('retry')}</BBLinkButton>}
          />
        ) : results.length === 0 ? (
          <BBEmptyState
            icon="search_off"
            title={t('noResults')}
            text={t('noResultsHint')}
            action={
              <BBLinkButton href={`/${locale}/explore`} variant="primary" size="md">
                {t('browseAll')}
              </BBLinkButton>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((shop) => (
              <BBShopCard
                key={shop.id}
                name={shop.name}
                location={shop.city}
                rating={shop.rating}
                reviewCount={shop.reviewCount}
                imageUrl={shop.coverUrl}
                imageAlt={shop.name}
                price={shop.minPrice}
                viewProfileHref={`/${locale}/shops/${shop.slug}`}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchPage;
