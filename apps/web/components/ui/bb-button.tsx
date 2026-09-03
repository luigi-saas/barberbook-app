import { cn } from '@repo/design-system/lib/utils';
import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

/* -------------------------------------------------------------------------------------------------
 * BBButton — the single button primitive for the whole site (design system).
 *
 * variants:
 *   primary    gold fill, white text — the main CTA (Réserver, Confirmer)
 *   espresso   dark fill — secondary emphasis
 *   secondary  outline on cream (alias: outline) — cancel / low emphasis
 *   ghost      transparent, gold text on hover
 * sizes: sm | md | lg; `fullWidth` stretches to the container.
 *
 * Pass `href` to BBLinkButton for navigation actions; BBButton is a <button>.
 * -------------------------------------------------------------------------------------------------*/

type Variant = 'primary' | 'espresso' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bb-espresso-gold disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary:
    'bg-bb-espresso-gold text-white shadow-[0_8px_20px_-8px_rgba(119,90,25,0.45)] hover:bg-bb-espresso-gold-deep',
  espresso: 'bg-bb-espresso text-bb-cream hover:bg-bb-espresso/90',
  secondary:
    'border-2 border-bb-cream-border bg-white text-bb-espresso hover:border-bb-espresso-gold/40 hover:bg-bb-gold-muted/20',
  outline:
    'border-2 border-bb-outline bg-transparent text-bb-charcoal hover:bg-bb-surface-variant',
  ghost: 'bg-transparent text-bb-espresso-gold hover:bg-bb-gold-muted',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function BBButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function BBLinkButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  href,
  ...props
}: LinkProps) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {children}
    </Link>
  );
}
