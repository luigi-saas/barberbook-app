'use client';

import { cn } from '@repo/design-system/lib/utils';
import { useState } from 'react';

interface ExplorePaginationProps {
  totalPages: number;
}

export function ExplorePagination({ totalPages }: ExplorePaginationProps) {
  const [current, setCurrent] = useState(1);

  const pages: (number | '...')[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, '...', totalPages);
  }

  return (
    <div className="mt-16 flex justify-center gap-2">
      {pages.map((page, i) =>
        page === '...' ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: static ellipsis marker
          <span key={i} className="flex size-12 items-center justify-center font-sans text-sm text-bb-on-surface-muted">
            …
          </span>
        ) : (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: page number list is stable
            key={i}
            type="button"
            onClick={() => setCurrent(page as number)}
            className={cn(
              'flex size-12 items-center justify-center rounded-xl font-sans text-sm font-semibold transition-colors',
              current === page
                ? 'bg-bb-espresso text-bb-cream'
                : 'bg-bb-surface-variant text-bb-on-surface-muted hover:bg-bb-espresso hover:text-bb-cream',
            )}
          >
            {page}
          </button>
        ),
      )}
    </div>
  );
}
