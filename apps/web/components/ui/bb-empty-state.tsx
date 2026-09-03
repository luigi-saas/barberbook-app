import { cn } from '@repo/design-system/lib/utils';
import type { ReactNode } from 'react';

/* -------------------------------------------------------------------------------------------------
 * BBEmptyState — the standard "nothing here" panel (Design.md §6 Empty state).
 * Used by search results, bookings lookup, blog, shop lists.
 * -------------------------------------------------------------------------------------------------*/

interface BBEmptyStateProps {
  /** Material Symbols icon name, e.g. "search_off". */
  icon?: string;
  title: string;
  text?: string;
  /** Optional CTA (usually a BBLinkButton). */
  action?: ReactNode;
  className?: string;
}

export function BBEmptyState({ icon = 'search_off', title, text, action, className }: BBEmptyStateProps) {
  return (
    <div
      className={cn(
        'mx-auto flex max-w-lg flex-col items-center gap-4 rounded-[1.75rem] border-2 border-dashed border-bb-cream-border bg-white p-12 text-center',
        className,
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-bb-gold-muted">
        <span className="material-symbols-outlined text-3xl text-bb-espresso-gold">{icon}</span>
      </div>
      <h2 className="font-display text-2xl font-bold text-bb-espresso">{title}</h2>
      {text && <p className="text-sm leading-relaxed text-bb-on-surface-muted">{text}</p>}
      {action}
    </div>
  );
}
