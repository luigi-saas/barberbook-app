import { cn } from '@repo/design-system/lib/utils';
import type { ReactNode } from 'react';

/* -------------------------------------------------------------------------------------------------
 * BBCard — the standard white surface (rounded 1.75rem, soft border/shadow).
 * -------------------------------------------------------------------------------------------------*/

interface BBCardProps {
  className?: string;
  children: ReactNode;
}

export function BBCard({ className, children }: BBCardProps) {
  return (
    <div
      className={cn(
        'rounded-[1.75rem] border border-bb-cream-border bg-white shadow-[var(--bb-shadow-onboarding)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
