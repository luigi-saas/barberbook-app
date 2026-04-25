'use client';

import { cn } from '@repo/design-system/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

type BBButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface BBButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BBButtonVariant;
  fullWidth?: boolean;
}

const variantClasses: Record<BBButtonVariant, string> = {
  primary:
    'bg-bb-gold text-white hover:opacity-90 shadow-[var(--bb-shadow-button)]',
  secondary:
    'bg-bb-charcoal text-bb-surface hover:opacity-90',
  outline:
    'border-2 border-bb-outline text-bb-charcoal bg-transparent hover:bg-bb-surface-variant',
  ghost:
    'bg-transparent text-bb-gold hover:bg-bb-gold-muted',
};

export const BBButton = forwardRef<HTMLButtonElement, BBButtonProps>(
  ({ variant = 'primary', fullWidth = false, className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-bb-button px-6 py-4',
        'font-sans text-base font-semibold leading-6 transition-opacity',
        'disabled:pointer-events-none disabled:opacity-50',
        fullWidth && 'w-full',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

BBButton.displayName = 'BBButton';
