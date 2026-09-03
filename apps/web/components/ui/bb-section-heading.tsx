import { cn } from '@repo/design-system/lib/utils';
import type { ReactNode } from 'react';

/* -------------------------------------------------------------------------------------------------
 * BBSectionHeading — standard page/section title block.
 * -------------------------------------------------------------------------------------------------*/

interface BBSectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  children?: ReactNode;
}

export function BBSectionHeading({ title, subtitle, align = 'center', className, children }: BBSectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-10 max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-bb-espresso lg:text-5xl">
        {title}
      </h1>
      {subtitle && <p className="mt-4 text-bb-on-surface-muted">{subtitle}</p>}
      {children}
    </div>
  );
}
