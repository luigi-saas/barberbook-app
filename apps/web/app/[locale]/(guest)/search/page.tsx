import { BBShopCard } from '@/components/ui/bb-shop-card';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { listShops } from '@/lib/booking';
import { SearchSortBar } from './components/search-sort-bar';

// Live shop/availability data — never bake into a static build.
export const dynamic = 'force-dynamic';

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}

const SearchPage = async ({ params, searchParams }: SearchPageProps) => {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('web.guest.search');

  const query = (q ?? '').trim().toLowerCase();
  const all = (await listShops().catch((error: unknown) => {
    console.error("[search] database unavailable:", error instanceof Error ? error.message : error);
    return [];
  })) ?? [];
  const results = query
    ? all.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.city.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query),
      )
    : all;

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <SearchSortBar />
        <p className="font-sans text-sm text-bb-espresso/60 mt-6 mb-6">
          {results.length} {results.length === 1 ? 'résultat' : 'résultats'}
          {query ? ` pour « ${q} »` : ''}
        </p>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-display text-xl font-semibold text-bb-espresso/40">
              {t('noResults')}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((shop) => (
              <BBShopCard
                key={shop.id}
                name={shop.name}
                location={shop.city}
                rating={shop.rating}
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
