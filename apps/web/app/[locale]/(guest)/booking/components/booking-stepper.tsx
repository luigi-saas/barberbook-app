'use client';

import { cn } from '@repo/design-system/lib/utils';
import { useTranslations } from 'next-intl';

interface BookingStepperProps {
  currentStep: number;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  const t = useTranslations('web.guest.booking');

  const steps = [
    { number: 1, label: t('stepService') },
    { number: 2, label: t('stepBarber') },
    { number: 3, label: t('stepDateTime') },
    { number: 4, label: t('stepSummary') },
  ];

  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto relative">
      {/* Full-width connector baseline */}
      <div className="absolute top-5 left-0 w-full h-[2px] bg-bb-cream-border -z-0" />

      {steps.map((step) => (
        <div key={step.number} className="flex flex-col items-center gap-2 z-10">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition',
              step.number === currentStep
                ? 'bg-bb-espresso-gold text-white'
                : step.number < currentStep
                  ? 'bg-bb-espresso text-bb-cream'
                  : 'bg-bb-surface-elevated text-bb-on-surface-muted',
            )}
          >
            {step.number}
          </div>
          <span
            className={cn(
              'text-xs font-medium whitespace-nowrap',
              step.number === currentStep
                ? 'text-bb-espresso-gold font-semibold'
                : step.number < currentStep
                  ? 'text-bb-espresso/70'
                  : 'text-bb-on-surface-muted',
            )}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
