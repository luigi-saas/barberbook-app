import { cn } from '@repo/design-system/lib/utils';
import { MapPin, Star } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

interface ShopHeroProps {
  shopName: string;
  city: string;
  rating: number;
  isOpen: boolean;
  locale: string;
}

export async function ShopHero({ shopName, city, rating, isOpen, locale }: ShopHeroProps) {
  const t = await getTranslations({ locale, namespace: 'web.guest.shop' });

  return (
    <div className="relative h-[480px] w-full overflow-hidden bg-bb-espresso">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bb-espresso via-bb-espresso/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          {/* Status + city row */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className={cn(
                'rounded-full px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.1em]',
                isOpen
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30',
              )}
            >
              {isOpen ? t('openNow') : t('closedNow')}
            </span>

            <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <MapPin className="size-3.5 text-bb-cream/70" />
              <span className="font-sans text-sm text-bb-cream/70">{city}</span>
            </span>
          </div>

          {/* Shop name */}
          <h1 className="font-display text-4xl font-bold text-bb-cream lg:text-5xl">
            {shopName}
          </h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <Star className="size-4 fill-bb-espresso-gold text-bb-espresso-gold" />
              <span className="font-sans text-sm font-semibold text-bb-cream">
                {rating.toFixed(1)}
              </span>
              <span className="font-sans text-xs text-bb-cream/60">
                ({t('reviews_count', { count: 128 })})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
