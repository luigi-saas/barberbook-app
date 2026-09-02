'use client';

import { cn } from '@repo/design-system/lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type SortKey = 'relevance' | 'distance' | 'rating' | 'price';

export function SearchSortBar() {
  const t = useTranslations('web.guest.search');
  const [activeSort, setActiveSort] = useState<SortKey>('relevance');

  const sorts: { key: SortKey; label: string }[] = [
    { key: 'relevance', label: t('relevance') },
    { key: 'distance', label: t('distance') },
    { key: 'rating', label: t('rating') },
    { key: 'price', label: t('price') },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-sans text-sm text-bb-espresso/50 mr-1">
        {t('sortBy')}
      </span>
      {sorts.map((sort) => (
        <button
          key={sort.key}
          type="button"
          onClick={() => setActiveSort(sort.key)}
          className={cn(
            'rounded-full px-5 py-2 font-sans text-sm font-medium transition',
            activeSort === sort.key
              ? 'bg-bb-espresso text-bb-cream'
              : 'border border-bb-espresso/20 text-bb-espresso hover:bg-bb-espresso/5',
          )}
        >
          {sort.label}
        </button>
      ))}
    </div>
  );
}
