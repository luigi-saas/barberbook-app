'use client';

import { BBSearchInput, BBSelectInput } from '@/components/ui/bb-input';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';

/**
 * Real site search: submits to /search?q=… — city/service filters simply
 * refine the query ("barbe casablanca" matches names, cities and services).
 */
export function ExploreSearchBar() {
  const t = useTranslations('web.guest.explore');
  const params = useParams();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [service, setService] = useState('');

  const cityOptions = [
    { label: t('cityFilter'), value: '' },
    { label: 'Casablanca', value: 'Casablanca' },
    { label: 'Rabat', value: 'Rabat' },
    { label: 'Marrakech', value: 'Marrakech' },
    { label: 'Fès', value: 'Fes' },
    { label: 'Tanger', value: 'Tanger' },
    { label: 'Agadir', value: 'Agadir' },
  ];

  const serviceOptions = [
    { label: t('serviceFilter'), value: '' },
    { label: 'Coupe', value: 'coupe' },
    { label: 'Barbe', value: 'barbe' },
    { label: 'Soin', value: 'soin' },
    { label: 'Rituel', value: 'rituel' },
  ];

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const q = [search, city, service].map((x) => x.trim()).filter(Boolean).join(' ');
    window.location.href = `/${locale}/search${q ? `?q=${encodeURIComponent(q)}` : ''}`;
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 lg:flex-row lg:items-end">
      <div className="flex-1">
        <BBSearchInput
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          name="q"
        />
      </div>
      <div className="w-full lg:w-48">
        <BBSelectInput value={city} options={cityOptions} onChange={setCity} />
      </div>
      <div className="w-full lg:w-48">
        <BBSelectInput value={service} options={serviceOptions} onChange={setService} />
      </div>
      <button
        type="submit"
        className="whitespace-nowrap rounded-xl bg-bb-espresso px-8 py-[18px] font-sans text-base font-semibold text-bb-cream transition hover:bg-bb-espresso/90"
      >
        {t('search')}
      </button>
    </form>
  );
}
