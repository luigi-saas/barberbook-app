'use client';

import { cn } from '@repo/design-system/lib/utils';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';

type SortKey = 'relevance' | 'rating' | 'price';

/** Working sort (Design.md — Search results): updates the ?sort= param. */
export function SearchSortBar() {
  const t = useTranslations('web.guest.search');
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const activeSort = (searchParams.get('sort') ?? 'relevance') as SortKey;
  const q = searchParams.get('q') ?? '';

  const sorts: { key: SortKey; label: string }[] = [
    { key: 'relevance', label: t('relevance') },
    { key: 'rating', label: t('rating') },
    { key: 'price', label: t('price') },
  ];

  const href = (key: SortKey) => {
    const query = new URLSearchParams();
    if (q) query.set('q', q);
    if (key !== 'relevance') query.set('sort', key);
    const qs = query.toString();
    return `/${locale}/search${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-sans text-sm text-bb-espresso/50">{t('sortBy')}</span>
      {sorts.map((sort) => (
        <a
          key={sort.key}
          href={href(sort.key)}
          className={cn(
            'rounded-full px-5 py-2 font-sans text-sm font-medium transition',
            activeSort === sort.key
              ? 'bg-bb-espresso text-bb-cream'
              : 'border border-bb-espresso/20 text-bb-espresso hover:bg-bb-espresso/5',
          )}
        >
          {sort.label}
        </a>
      ))}
    </div>
  );
}
