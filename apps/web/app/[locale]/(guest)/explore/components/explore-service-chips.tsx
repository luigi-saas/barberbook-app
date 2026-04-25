'use client';

import { cn } from '@repo/design-system/lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function ExploreServiceChips() {
  const t = useTranslations('web.guest.explore');
  const [active, setActive] = useState('all');

  const services = [
    { key: 'all', label: t('services.all') },
    { key: 'haircut', label: t('services.haircut') },
    { key: 'beard', label: t('services.beard') },
    { key: 'shave', label: t('services.shave') },
    { key: 'facial', label: t('services.facial') },
    { key: 'combo', label: t('services.combo') },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto py-4 no-scrollbar">
      {services.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => setActive(key)}
          className={cn(
            'whitespace-nowrap rounded-xl px-6 py-2.5 font-sans text-sm font-semibold transition-colors',
            active === key
              ? 'bg-bb-gold-muted text-[#4e3700] shadow-sm'
              : 'bg-bb-surface-variant text-bb-on-surface-muted hover:bg-bb-cream-border',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
