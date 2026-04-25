'use client';

import { cn } from '@repo/design-system/lib/utils';
import { ArrowRight, CalendarCheck, Star, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BarberProfileCardProps {
  name: string;
  title: string;
  shopName: string;
  shopId: string;
  specialty: string[];
  rating: number;
  reviewCount: number;
  bio: string;
  nextAvailability: string;
  priceFrom: string;
  portfolioImages: { src: string; label: string }[];
  locale: string;
}

export function BarberProfileCard({
  name,
  title,
  shopName,
  shopId,
  specialty,
  rating,
  reviewCount,
  bio,
  nextAvailability,
  priceFrom,
  portfolioImages,
  locale,
}: BarberProfileCardProps) {
  const t = useTranslations('web.guest.barber');
  const router = useRouter();

  return (
    <div className="relative w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-bb-surface shadow-[0_32px_80px_rgba(28,27,27,0.15)] flex flex-col md:flex-row border border-bb-cream-border mx-auto">
      {/* Close / back button */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="absolute right-6 top-6 z-30 flex size-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md border border-bb-cream-border transition hover:scale-110 hover:bg-white"
      >
        <X className="size-4 text-bb-charcoal" />
      </button>

      {/* ── Left column: visual ── */}
      <div
        className="relative flex w-full flex-col items-center justify-center gap-0 p-8 md:w-5/12 min-h-[420px] border-b border-bb-cream-border md:border-b-0 md:border-r"
        style={{
          background:
            'radial-gradient(at 0% 0%, rgba(119,90,25,0.07) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(119,90,25,0.07) 0px, transparent 50%), #fcf9f8',
        }}
      >
        {/* Avatar with glow */}
        <div className="group relative">
          <div className="absolute inset-0 scale-110 rounded-full bg-bb-gold/20 blur-3xl transition-all duration-700 group-hover:bg-bb-gold/30" />
          <div className="relative size-64 lg:size-72 rounded-full p-2 bg-white/50 shadow-2xl backdrop-blur">
            <div className="size-full overflow-hidden rounded-full border-2 border-white shadow-inner">
              {/* Placeholder avatar — swap for real image */}
              <div className="size-full bg-bb-surface-elevated" />
            </div>
          </div>
          {/* Premium badge */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-bb-espresso-gold px-5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white shadow-xl ring-4 ring-bb-surface">
            <Star className="size-3 fill-white text-white" />
            {shopName}
          </div>
        </div>

        {/* Name + subtitle */}
        <div className="mt-10 text-center">
          <h1 className="font-display text-5xl font-extrabold tracking-tighter text-bb-charcoal">
            {name}
          </h1>
          <p className="mt-1 font-sans text-xs font-medium uppercase tracking-[0.1em] text-bb-on-surface-muted/60">
            {title}
          </p>
        </div>
      </div>

      {/* ── Right column: details ── */}
      <div className="flex w-full flex-col gap-7 overflow-y-auto p-8 lg:p-10 md:w-7/12">
        {/* Stats row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="size-5 fill-bb-espresso-gold text-bb-espresso-gold" />
              <span className="font-display text-2xl font-extrabold text-bb-charcoal">
                {rating.toFixed(1)}
              </span>
            </div>
            <div className="h-5 w-px bg-bb-cream-border" />
            <span className="font-sans text-sm text-bb-on-surface-muted">
              {reviewCount} {t('reviews')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-bb-success-container/40 px-4 py-1.5 text-bb-success">
            <Star className="size-3.5 fill-bb-success text-bb-success" />
            <span className="font-sans text-xs font-bold uppercase tracking-wider">
              {t('topRated')}
            </span>
          </div>
        </div>

        {/* Vision / bio */}
        <section>
          <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-bb-espresso-gold">
            {t('vision')}
            <span className="ml-2 h-px flex-1 bg-bb-espresso-gold/10" />
          </h2>
          <p className="font-sans text-base font-light leading-[1.8] text-bb-on-surface-muted">
            {bio}
          </p>
        </section>

        {/* Expertise chips */}
        <section>
          <h2 className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-bb-charcoal/50">
            {t('expertise')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {specialty.map((s) => (
              <span
                key={s}
                className="rounded-2xl border border-bb-cream-border bg-bb-surface-variant px-5 py-2.5 font-sans text-sm font-medium text-bb-on-surface-muted transition hover:bg-bb-cream-border"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Portfolio */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-bb-charcoal/50">
              {t('portfolio')}
            </h2>
            <Link
              href={`/${locale}/shops/${shopId}`}
              className="font-sans text-xs font-bold uppercase tracking-wider text-bb-espresso-gold transition hover:underline underline-offset-4"
            >
              {t('viewAll')}
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {portfolioImages.map(({ src, label }) => (
              <div key={label} className="group flex cursor-pointer flex-col gap-2">
                <div className="aspect-square overflow-hidden rounded-[1.5rem] bg-bb-surface-elevated ring-1 ring-black/5 shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl">
                  <img
                    src={src}
                    alt={label}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <p className="text-center font-sans text-[10px] font-bold uppercase tracking-widest text-bb-on-surface-muted/60">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Booking bar — pinned to bottom of right column */}
        <div className="mt-auto flex flex-col gap-5 border-t border-bb-cream-border pt-6">
          <div className="flex items-end justify-between px-1">
            <div className="flex flex-col gap-1">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-bb-on-surface-muted/60">
                {t('nextAvailability')}
              </span>
              <div className="flex items-center gap-2">
                <CalendarCheck className="size-5 text-bb-success" />
                <span className="font-sans text-lg font-bold text-bb-success">
                  {nextAvailability}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-bb-on-surface-muted/60">
                {t('serviceFrom')}
              </span>
              <p className="font-display text-lg font-extrabold text-bb-charcoal">
                {priceFrom}
              </p>
            </div>
          </div>

          <Link
            href={`/${locale}/shops/${shopId}`}
            className={cn(
              'flex w-full items-center justify-center gap-3 rounded-2xl py-5',
              'bg-bb-gold-container font-display text-sm font-extrabold uppercase tracking-widest text-white',
              'shadow-[0_15px_30px_rgba(197,160,89,0.25)] transition-all duration-300',
              'hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(197,160,89,0.35)] active:translate-y-0',
            )}
          >
            {t('selectAndContinue')}
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
