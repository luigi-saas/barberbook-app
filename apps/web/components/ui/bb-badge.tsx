import { cn } from '@repo/design-system/lib/utils';
import type { ReactNode } from 'react';

/* -------------------------------------------------------------------------------------------------
 * BBBadge — small status/label pill.
 * variants: gold | espresso | success | muted | outline
 * -------------------------------------------------------------------------------------------------*/

type Variant = 'gold' | 'espresso' | 'success' | 'muted' | 'outline';

const variants: Record<Variant, string> = {
  gold: 'bg-bb-gold-muted text-bb-espresso-gold',
  espresso: 'bg-bb-espresso text-bb-cream',
  success: 'bg-bb-success/10 text-bb-success',
  muted: 'bg-bb-surface-elevated text-bb-on-surface-muted',
  outline: 'border border-bb-cream-border bg-white text-bb-espresso',
};

interface BBBadgeProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function BBBadge({ variant = 'gold', className, children }: BBBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
