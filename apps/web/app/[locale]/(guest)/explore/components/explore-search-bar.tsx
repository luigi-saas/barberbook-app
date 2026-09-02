'use client';

import { BBSearchInput, BBSelectInput } from '@/components/ui/bb-input';
import { cn } from '@repo/design-system/lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function ExploreSearchBar() {
  const t = useTranslations('web.guest.explore');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [service, setService] = useState('');

  const cityOptions = [
    { label: t('cityFilter'), value: '' },
    { label: 'Casablanca', value: 'casablanca' },
    { label: 'Rabat', value: 'rabat' },
    { label: 'Marrakech', value: 'marrakech' },
    { label: 'Fès', value: 'fes' },
    { label: 'Tanger', value: 'tanger' },
    { label: 'Agadir', value: 'agadir' },
  ];

  const serviceOptions = [
    { label: t('serviceFilter'), value: '' },
    { label: 'Coupe', value: 'coupe' },
    { label: 'Barbe', value: 'barbe' },
    { label: 'Soin', value: 'soin' },
    { label: 'Pack', value: 'pack' },
  ];

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
      <div className="flex-1">
        <BBSearchInput
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="w-full lg:w-48">
        <BBSelectInput
          value={city}
          options={cityOptions}
          onChange={setCity}
        />
      </div>
      <div className="w-full lg:w-48">
        <BBSelectInput
          value={service}
          options={serviceOptions}
          onChange={setService}
        />
      </div>
      <button
        type="button"
        className={cn(
          'rounded-full bg-bb-espresso px-8 py-[18px]',
          'font-sans text-base font-semibold text-bb-cream',
          'transition hover:opacity-90 whitespace-nowrap',
        )}
      >
        {t('search')}
      </button>
    </div>
  );
}
