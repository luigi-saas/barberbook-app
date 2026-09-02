'use client';

import { cn } from '@repo/design-system/lib/utils';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface BookingStepperProps {
  currentStep: number;
  /** Routes for completed steps — when provided, completed steps become links. */
  hrefs?: string[];
}

export function BookingStepper({ currentStep, hrefs }: BookingStepperProps) {
  const t = useTranslations('web.guest.booking');

  const steps = [
    { number: 1, label: t('stepService') },
    { number: 2, label: t('stepBarber') },
    { number: 3, label: t('stepDateTime') },
    { number: 4, label: t('stepSummary') },
  ];

  return (
    <nav
      aria-label="Progress"
      className="mx-auto flex max-w-2xl items-start justify-between relative"
    >
      {/* Connector baseline + progress fill */}
      <div className="absolute top-5 left-5 right-5 h-[2px] bg-bb-cream-border -z-0" aria-hidden />
      <div
        className="absolute top-5 left-5 h-[2px] bg-bb-espresso-gold -z-0 transition-all duration-500"
        style={{ width: `calc((100% - 2.5rem) * ${(currentStep - 1) / (steps.length - 1)})` }}
        aria-hidden
      />

      {steps.map((step) => {
        const isDone = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const href = isDone ? hrefs?.[step.number - 1] : undefined;
        const content = (
          <>
            <span
              className={cn(
                'flex size-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all',
                isCurrent &&
                  'border-bb-espresso-gold bg-bb-espresso-gold text-white shadow-[0_4px_12px_-2px_rgba(119,90,25,0.4)]',
                isDone && 'border-bb-espresso-gold bg-bb-cream text-bb-espresso-gold',
                !isDone && !isCurrent && 'border-bb-cream-border bg-white text-bb-on-surface-muted',
              )}
              style={isDone ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {isDone ? (
                <span className="material-symbols-outlined text-[18px]">check</span>
              ) : (
                step.number
              )}
            </span>
            <span
              className={cn(
                'text-xs font-medium whitespace-nowrap',
                isCurrent && 'text-bb-espresso-gold font-bold',
                isDone && 'text-bb-espresso/70',
                !isDone && !isCurrent && 'text-bb-on-surface-muted',
                'hidden sm:block',
              )}
            >
              {step.label}
            </span>
            {/* Mobile: only current step label */}
            <span
              className={cn(
                'text-[11px] font-bold text-bb-espresso-gold sm:hidden',
                !isCurrent && 'invisible absolute',
              )}
            >
              {step.label}
            </span>
          </>
        );

        return (
          <div key={step.number} className="relative z-10 flex flex-col items-center gap-2">
            {href ? (
              <Link
                href={href}
                aria-label={`${step.label} (${t('back')})`}
                className="flex flex-col items-center gap-2 rounded-xl hover:opacity-80 transition-opacity"
              >
                {content}
              </Link>
            ) : (
              <div
                aria-current={isCurrent ? 'step' : undefined}
                className="flex flex-col items-center gap-2"
              >
                {content}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
