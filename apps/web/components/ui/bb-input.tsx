'use client';

import { cn } from '@repo/design-system/lib/utils';
import { Search } from 'lucide-react';
import { type InputHTMLAttributes, forwardRef } from 'react';

interface BBSearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const BBSearchInput = forwardRef<HTMLInputElement, BBSearchInputProps>(
  ({ label, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="px-1 text-xs font-semibold uppercase tracking-[0.1em] text-bb-charcoal/50">
          {label}
        </span>
      )}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-[18px] text-bb-on-surface-muted/60" />
        <input
          ref={ref}
          className={cn(
            'w-full rounded-bb-button bg-bb-surface-variant py-[18px] pl-12 pr-4',
            'font-sans text-base text-bb-charcoal placeholder:text-bb-on-surface-muted/60',
            'outline-none focus:ring-2 focus:ring-bb-gold/40 transition',
            className,
          )}
          {...props}
        />
      </div>
    </div>
  ),
);

BBSearchInput.displayName = 'BBSearchInput';

interface BBSelectInputProps {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  className?: string;
}

export function BBSelectInput({ label, value, options, onChange, className }: BBSelectInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="px-1 text-xs font-semibold uppercase tracking-[0.1em] text-bb-charcoal/50">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full appearance-none rounded-bb-button bg-bb-surface-variant py-4 pl-4 pr-10',
            'font-sans text-base text-bb-charcoal',
            'outline-none focus:ring-2 focus:ring-bb-gold/40 transition',
            className,
          )}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* chevron */}
        <svg
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 size-5 text-bb-charcoal"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

interface BBCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function BBCheckbox({ label, checked, onChange, className }: BBCheckboxProps) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-3', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-lg border transition',
          checked
            ? 'border-bb-gold bg-bb-gold'
            : 'border-bb-outline bg-white',
        )}
      >
        {checked && (
          <svg className="size-3.5 text-white" viewBox="0 0 14 14" fill="none">
            <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="font-sans text-sm font-medium text-bb-charcoal">{label}</span>
    </label>
  );
}
