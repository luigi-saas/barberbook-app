import { cn } from '@repo/design-system/lib/utils';
import { MapPin, Star } from 'lucide-react';
import Link from 'next/link';

type BookingStatus = 'confirmed' | 'pending';

interface BBShopCardProps {
  name: string;
  location: string;
  rating: number;
  imageUrl: string;
  imageAlt?: string;
  reviewCount?: number;
  price?: string;
  priceLabel?: string;
  viewProfileLabel?: string;
  viewProfileHref?: string;
  status?: BookingStatus;
  className?: string;
}

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  confirmed: {
    label: 'CONFIRMÉ',
    className: 'bg-bb-success-container text-bb-success',
  },
  pending: {
    label: 'EN ATTENTE',
    className: 'bg-bb-surface-elevated text-bb-on-surface-muted',
  },
};

export function BBShopCard({
  name,
  location,
  rating,
  imageUrl,
  imageAlt = '',
  reviewCount,
  price,
  priceLabel,
  viewProfileLabel,
  viewProfileHref,
  status,
  className,
}: BBShopCardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-bb-card bg-white shadow-[var(--bb-shadow-card)]',
        className,
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="size-full object-cover"
        />
        {/* Rating badge */}
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
          <Star className="size-3 fill-bb-gold-container text-bb-gold-container" />
          <span className="font-sans text-xs font-semibold text-bb-charcoal">
            {rating.toFixed(1)}
          </span>
          {reviewCount !== undefined && (
            <span className="font-sans text-xs text-bb-on-surface-muted">
              ({reviewCount})
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 p-6">
        {/* Name + location + price */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-sans text-lg font-semibold text-bb-charcoal leading-7">
              {name}
            </h4>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="size-3 text-bb-on-surface-muted shrink-0" />
              <span className="font-sans text-sm text-bb-on-surface-muted leading-5">
                {location}
              </span>
            </div>
          </div>
          {price && (
            <div className="shrink-0 text-right">
              {priceLabel && (
                <span className="block font-sans text-[10px] font-bold uppercase tracking-widest text-bb-on-surface-muted">
                  {priceLabel}
                </span>
              )}
              <span className="font-sans text-base font-extrabold text-bb-espresso-gold">
                {price}
              </span>
            </div>
          )}
        </div>

        {/* Status chips */}
        {status && (
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[-0.03em] leading-[16.5px]',
                statusConfig[status].className,
              )}
            >
              {statusConfig[status].label}
            </span>
          </div>
        )}

        {/* CTA */}
        {viewProfileHref && (
          <Link
            href={viewProfileHref}
            className="block w-full rounded-xl bg-bb-gold-muted py-3 font-sans text-sm font-semibold text-[#4e3700] text-center transition hover:opacity-80"
          >
            {viewProfileLabel ?? 'View Profile'}
          </Link>
        )}
      </div>
    </div>
  );
}
