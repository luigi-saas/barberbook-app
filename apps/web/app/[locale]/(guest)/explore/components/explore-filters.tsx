'use client';

import { BBButton } from '@/components/ui/bb-button';
import { BBCheckbox } from '@/components/ui/bb-input';
import { cn } from '@repo/design-system/lib/utils';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function ExploreFilters() {
  const t = useTranslations('web.guest.explore');
  const [minRating, setMinRating] = useState<string | null>(null);
  const [distance, setDistance] = useState(10);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [availableToday, setAvailableToday] = useState(false);

  const handleReset = () => {
    setMinRating(null);
    setDistance(10);
    setMinPrice('');
    setMaxPrice('');
    setAvailableToday(false);
  };

  const ratingOptions = [
    { value: '4.5', label: '4.5+' },
    { value: '4.0', label: '4.0+' },
  ];

  return (
    <div className="rounded-[40px] bg-white p-6 shadow-[var(--bb-shadow-onboarding)] flex flex-col gap-6">
      <h3 className="font-display text-lg font-bold text-bb-espresso">
        {t('filters.title')}
      </h3>

      {/* Rating checkboxes */}
      <div className="flex flex-col gap-2">
        <span className="font-sans text-sm font-semibold text-bb-espresso/60 uppercase tracking-[0.1em]">
          {t('filters.rating')}
        </span>
        <div className="flex flex-col gap-2">
          {ratingOptions.map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-3 group">
              <input
                type="checkbox"
                checked={minRating === value}
                onChange={() => setMinRating(minRating === value ? null : value)}
                className="size-5 rounded border-bb-cream-border text-bb-espresso accent-bb-espresso transition"
              />
              <span className="flex items-center gap-1 font-sans text-sm text-bb-on-surface-muted group-hover:text-bb-espresso transition-colors">
                {label}
                <Star className="size-3.5 fill-bb-espresso-gold text-bb-espresso-gold" />
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Distance slider */}
      <div className="flex flex-col gap-2">
        <span className="font-sans text-sm font-semibold text-bb-espresso/60 uppercase tracking-[0.1em]">
          {t('filters.distance')}
        </span>
        <input
          type="range"
          min={1}
          max={20}
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="w-full cursor-pointer accent-bb-espresso"
        />
        <div className="flex justify-between font-sans text-xs text-bb-on-surface-muted">
          <span>{t('filters.distanceNear')}</span>
          <span className="font-semibold text-bb-espresso">{distance} km</span>
          <span>20+ km</span>
        </div>
      </div>

      {/* Price range */}
      <div className="flex flex-col gap-2">
        <span className="font-sans text-sm font-semibold text-bb-espresso/60 uppercase tracking-[0.1em]">
          {t('filters.price')}
        </span>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full rounded-xl bg-bb-surface-variant px-4 py-3 font-sans text-sm text-bb-espresso placeholder:text-bb-espresso/40 outline-none focus:ring-2 focus:ring-bb-espresso/20 transition"
          />
          <span className="text-bb-espresso/40 font-sans text-sm shrink-0">–</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full rounded-xl bg-bb-surface-variant px-4 py-3 font-sans text-sm text-bb-espresso placeholder:text-bb-espresso/40 outline-none focus:ring-2 focus:ring-bb-espresso/20 transition"
          />
        </div>
      </div>

      {/* Available today */}
      <BBCheckbox
        label={t('filters.availableToday')}
        checked={availableToday}
        onChange={setAvailableToday}
      />

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2">
        <BBButton variant="secondary" fullWidth>
          {t('filters.apply')}
        </BBButton>
        <BBButton variant="ghost" fullWidth onClick={handleReset}>
          {t('filters.reset')}
        </BBButton>
      </div>
    </div>
  );
}
