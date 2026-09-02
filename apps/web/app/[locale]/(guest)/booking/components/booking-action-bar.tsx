'use client';

import { cn } from '@repo/design-system/lib/utils';
import { useTranslations } from 'next-intl';

interface BookingActionBarProps {
  /** Whether a selection exists (drives CTA state). */
  enabled: boolean;
  /** Route for the CTA. */
  ctaHref: string;
  /** i18n key of the CTA label, e.g. 'continueToBarber'. */
  ctaLabel: string;
  /** One-line summary of the current selection. */
  summary?: string;
}

/**
 * Fixed bottom action bar — mobile only. Keeps the primary action one tap
 * away while the user scrolls long lists (desktop uses the sidebar).
 */
export function BookingActionBar({ enabled, ctaHref, ctaLabel, summary }: BookingActionBarProps) {
  const t = useTranslations('web.guest.booking');

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-bb-cream-border bg-white/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-screen-xl items-center gap-4 px-4 py-3">
        <div className="min-w-0 flex-1">
          {summary ? (
            <p className="truncate text-sm font-semibold text-bb-espresso">{summary}</p>
          ) : (
            <p className="truncate text-xs text-bb-on-surface-muted">{t('sidebar.selectService')}</p>
          )}
        </div>
        {enabled ? (
          <a
            href={ctaHref}
            className="shrink-0 rounded-xl bg-bb-espresso-gold px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(119,90,25,0.45)] transition hover:bg-bb-espresso-gold-deep"
          >
            {t(ctaLabel as Parameters<typeof t>[0])}
            <span aria-hidden className="ml-1.5">→</span>
          </a>
        ) : (
          <span
            aria-disabled
            className="shrink-0 cursor-not-allowed rounded-xl bg-bb-cream-border px-6 py-3 text-sm font-bold text-bb-on-surface-muted"
          >
            {t(ctaLabel as Parameters<typeof t>[0])}
          </span>
        )}
      </div>
    </div>
  );
}
