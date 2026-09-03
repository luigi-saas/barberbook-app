'use client';

import { BBButton } from '@/components/ui/bb-button';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';

/**
 * Real filters (Design.md — Filter / sort modal): rating + price navigate to
 * /search with query params the server applies. Distance / "available today"
 * need geo + live slots and arrive with the marketplace phase.
 */
export function ExploreFilters() {
  const t = useTranslations('web.guest.explore');
  const params = useParams();
  const locale = params.locale as string;
  const [minRating, setMinRating] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState('');

  const ratingOptions = [
    { value: '4.5', label: '4.5+' },
    { value: '4', label: '4.0+' },
  ];

  const apply = (event: React.FormEvent) => {
    event.preventDefault();
    const query = new URLSearchParams();
    if (minRating) query.set('minRating', minRating);
    if (maxPrice) query.set('maxPrice', maxPrice);
    query.set('sort', 'rating');
    window.location.href = `/${locale}/search?${query.toString()}`;
  };

  const reset = () => {
    setMinRating(null);
    setMaxPrice('');
    window.location.href = `/${locale}/search`;
  };

  return (
    <form
      onSubmit={apply}
      className="flex flex-col gap-6 rounded-[1.75rem] border border-bb-cream-border bg-white p-6 shadow-[var(--bb-shadow-onboarding)]"
    >
      <h3 className="font-display text-lg font-bold text-bb-espresso">
        {t('filters.title')}
      </h3>

      {/* Rating checkboxes */}
      <div className="flex flex-col gap-2">
        <span className="font-sans text-sm font-semibold uppercase tracking-[0.1em] text-bb-espresso/60">
          {t('filters.rating')}
        </span>
        <div className="flex flex-col gap-2">
          {ratingOptions.map(({ value, label }) => (
            <label key={value} className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={minRating === value}
                onChange={() => setMinRating(minRating === value ? null : value)}
                className="size-5 rounded border-bb-cream-border accent-bb-espresso-gold transition"
              />
              <span className="flex items-center gap-1 font-sans text-sm text-bb-on-surface-muted transition-colors group-hover:text-bb-espresso">
                {label}
                <span className="material-symbols-outlined text-[14px] text-bb-espresso-gold" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Max price */}
      <div className="flex flex-col gap-2">
        <span className="font-sans text-sm font-semibold uppercase tracking-[0.1em] text-bb-espresso/60">
          {t('filters.price')}
        </span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="250"
            className="w-full rounded-xl bg-bb-surface-variant px-4 py-3 font-sans text-sm text-bb-espresso outline-none transition placeholder:text-bb-espresso/40 focus:ring-2 focus:ring-bb-espresso-gold/20"
            aria-label="Prix maximum (MAD)"
          />
          <span className="shrink-0 font-sans text-sm text-bb-espresso/60">MAD</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2">
        <BBButton type="submit" variant="primary" fullWidth>
          {t('filters.apply')}
        </BBButton>
        <BBButton type="button" variant="ghost" fullWidth onClick={reset}>
          {t('filters.reset')}
        </BBButton>
      </div>
    </form>
  );
}
