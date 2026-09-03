'use client';

import { cn } from '@repo/design-system/lib/utils';
import { Scissors, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { BarberCard, ServiceCard, ShopReview } from '@/lib/booking';

type TabKey = 'services' | 'team' | 'gallery' | 'reviews' | 'hours';

interface ShopInfoTabsProps {
  locale: string;
  shopId: string;
  services: ServiceCard[];
  barbers: BarberCard[];
  gallery: string[];
  openingHours: {
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
  reviews: ShopReview[];
}

export function ShopInfoTabs({
  locale,
  shopId,
  services,
  barbers,
  gallery,
  openingHours,
  reviews,
}: ShopInfoTabsProps) {
  const t = useTranslations('web.guest.shop');
  const [activeTab, setActiveTab] = useState<TabKey>('services');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'services', label: t('services') },
    { key: 'team', label: t('team') },
    { key: 'gallery', label: t('gallery') },
    { key: 'reviews', label: `${t('reviews')} (${reviews.length})` },
    { key: 'hours', label: t('hours') },
  ];

  const dayOrder = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];
  const dayLabels: Record<string, string> = {
    MONDAY: locale === 'ar' ? 'الاثنين' : locale === 'en' ? 'Monday' : 'Lundi',
    TUESDAY: locale === 'ar' ? 'الثلاثاء' : locale === 'en' ? 'Tuesday' : 'Mardi',
    WEDNESDAY: locale === 'ar' ? 'الأربعاء' : locale === 'en' ? 'Wednesday' : 'Mercredi',
    THURSDAY: locale === 'ar' ? 'الخميس' : locale === 'en' ? 'Thursday' : 'Jeudi',
    FRIDAY: locale === 'ar' ? 'الجمعة' : locale === 'en' ? 'Friday' : 'Vendredi',
    SATURDAY: locale === 'ar' ? 'السبت' : locale === 'en' ? 'Saturday' : 'Samedi',
    SUNDAY: locale === 'ar' ? 'الأحد' : locale === 'en' ? 'Sunday' : 'Dimanche',
  };

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 rounded-2xl bg-bb-cream p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex-1 rounded-xl px-4 py-2.5 font-sans text-sm font-semibold transition',
              activeTab === tab.key
                ? 'bg-bb-espresso text-bb-cream shadow-sm'
                : 'text-bb-espresso/60 hover:text-bb-espresso',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Services tab */}
      {activeTab === 'services' && (
        <div className="flex flex-col gap-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-bb-cream">
                  <Scissors className="size-4 text-bb-espresso" />
                </div>
                <div>
                  <p className="font-sans text-base font-semibold text-bb-espresso">
                    {service.name}
                  </p>
                  <p className="font-sans text-sm text-bb-espresso/50">{service.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-display text-lg font-bold text-bb-espresso">
                  {service.price}
                </span>
                <Link
                  href={`/${locale}/booking/barber?service=${service.id}&shop=${shopId}`}
                  className="rounded-full bg-bb-espresso px-5 py-2 font-sans text-sm font-semibold text-bb-cream transition hover:opacity-90"
                >
                  Réserver
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Team tab */}
      {activeTab === 'team' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-sm"
            >
              {barber.avatarUrl ? (
                <Image
                  src={barber.avatarUrl}
                  alt={barber.name}
                  width={80}
                  height={80}
                  className="size-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-20 items-center justify-center rounded-full bg-bb-gold-muted font-display text-xl font-black text-bb-espresso-gold">
                  {barber.initials}
                </div>
              )}
              <div>
                <p className="font-sans text-base font-semibold text-bb-espresso">
                  {barber.name}
                </p>
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  {barber.skills.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-bb-cream px-3 py-1 font-sans text-xs font-medium text-bb-espresso/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery tab */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {gallery.map((src, i) => (
            <div key={src + i} className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={src}
                alt={`Gallery ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Reviews tab (Design.md — Reviews list) */}
      {activeTab === 'reviews' && (
        <div className="flex flex-col gap-4">
          {reviews.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="font-sans text-sm text-bb-espresso/50">
                {t('noReviews')}
              </p>
            </div>
          )}
          {reviews.map((review, i) => (
            <div key={`${review.author}-${i}`} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-bb-gold-muted font-display text-sm font-black text-bb-espresso-gold">
                    {review.author.charAt(0)}
                  </div>
                  <span className="font-sans text-sm font-semibold text-bb-espresso">
                    {review.author}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, star) => (
                    <span
                      key={star}
                      className="material-symbols-outlined text-[14px] text-bb-espresso-gold"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                  <span className="ml-2 font-sans text-xs text-bb-espresso/50">
                    {new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : locale, {
                      month: 'short',
                      year: 'numeric',
                      timeZone: 'UTC',
                    }).format(review.createdAt)}
                  </span>
                </div>
              </div>
              <p className="font-sans text-sm leading-relaxed text-bb-espresso/70">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Hours tab */}
      {activeTab === 'hours' && (
        <div className="flex flex-col gap-2">
          {dayOrder.map((day) => {
            const hours = openingHours.find((h) => h.dayOfWeek === day);
            return (
              <div
                key={day}
                className="flex items-center justify-between rounded-2xl bg-white px-5 py-3.5 shadow-sm"
              >
                <span className="font-sans text-sm font-semibold text-bb-espresso">
                  {dayLabels[day]}
                </span>
                <span
                  className={cn(
                    'font-sans text-sm',
                    !hours || hours.isClosed
                      ? 'text-bb-espresso/40'
                      : 'font-medium text-bb-espresso',
                  )}
                >
                  {!hours || hours.isClosed
                    ? t('closedDay')
                    : `${hours.openTime} – ${hours.closeTime}`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
