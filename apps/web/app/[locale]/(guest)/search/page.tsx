import { BBShopCard } from '@/components/ui/bb-shop-card';
import { cn } from '@repo/design-system/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { SearchSortBar } from './components/search-sort-bar';

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}

const MOCK_RESULTS = [
  {
    id: '1',
    name: 'Salon Alaoui',
    location: 'Casablanca, Maarif',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
  },
  {
    id: '2',
    name: 'Le Barbier Royal',
    location: 'Rabat, Agdal',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
  },
  {
    id: '3',
    name: 'Riad Barbershop',
    location: 'Marrakech, Guéliz',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
  },
  {
    id: '4',
    name: 'Baraka Grooming',
    location: 'Fès, Ville Nouvelle',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80',
  },
];

const SearchPage = async ({ params, searchParams }: SearchPageProps) => {
  const { locale } = await params;
  const { q = '' } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('web.guest.search');

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12">
        {/* Back link */}
        <Link
          href={`/${locale}/explore`}
          className="mb-6 inline-flex items-center gap-2 font-sans text-sm text-bb-espresso/60 hover:text-bb-espresso transition"
        >
          <ChevronLeft className="size-4" />
          Explorer
        </Link>

        {/* Heading */}
        <h1 className="font-display text-3xl font-bold text-bb-espresso mb-2 lg:text-4xl">
          {t('resultsFor')}{' '}
          {q && (
            <span className="text-bb-espresso-gold">&ldquo;{q}&rdquo;</span>
          )}
        </h1>
        <p className="font-sans text-sm text-bb-espresso/50 mb-8">
          {t('showingCount', { count: MOCK_RESULTS.length })}
        </p>

        {/* Sort bar */}
        <div className="mb-8">
          <SearchSortBar />
        </div>

        {/* Results */}
        {MOCK_RESULTS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-display text-xl font-semibold text-bb-espresso/40">
              {t('noResults')}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MOCK_RESULTS.map((shop) => (
              <BBShopCard
                key={shop.id}
                name={shop.name}
                location={shop.location}
                rating={shop.rating}
                imageUrl={shop.imageUrl}
                imageAlt={shop.name}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <button
            type="button"
            className={cn(
              'flex items-center gap-2 rounded-full border border-bb-espresso/20 px-6 py-2.5',
              'font-sans text-sm font-medium text-bb-espresso transition hover:bg-bb-espresso/5',
            )}
          >
            <ChevronLeft className="size-4" />
            {t('previous')}
          </button>
          <button
            type="button"
            className={cn(
              'flex items-center gap-2 rounded-full border border-bb-espresso/20 px-6 py-2.5',
              'font-sans text-sm font-medium text-bb-espresso transition hover:bg-bb-espresso/5',
            )}
          >
            {t('next')}
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
