import { cn } from '@repo/design-system/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

function PathCard({
  icon,
  title,
  description,
  features,
  ctaLabel,
  ctaHref,
  variant,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  variant: 'primary' | 'outline';
}) {
  return (
    <div className="flex flex-col rounded-[48px] border border-[rgba(229,222,214,0.5)] bg-white p-[49px] shadow-[var(--bb-shadow-onboarding)]">
      {/* Icon */}
      <div className="mb-10 flex size-20 items-center justify-center rounded-full bg-[rgba(153,99,33,0.1)]">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mb-6 font-sans text-[30px] font-bold leading-9 text-bb-espresso">
        {title}
      </h3>

      {/* Description */}
      <p className="mb-10 font-sans text-lg leading-relaxed text-bb-espresso/60">
        {description}
      </p>

      {/* Features */}
      <ul className="mb-12 flex flex-col gap-5">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-4">
            <CheckCircle2 className="size-5 shrink-0 text-bb-espresso-gold" />
            <span className="font-sans text-base text-bb-espresso/80">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={ctaHref}
        className={cn(
          'w-full rounded-full py-5 text-center font-sans text-lg font-bold transition',
          variant === 'primary'
            ? 'bg-bb-espresso text-bb-cream hover:opacity-90'
            : 'border-2 border-bb-espresso text-bb-espresso hover:bg-bb-cream',
        )}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

export function OnboardingSplitPaths() {
  const t = useTranslations('web.home.onboarding.splitPaths');
  const customerFeatures = t.raw('customer.features') as string[];
  const ownerFeatures = t.raw('owner.features') as string[];

  return (
    <section className="w-full bg-bb-cream py-32">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-24 px-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-sans text-5xl font-bold tracking-tight text-bb-espresso">
            {t('title')}
          </h2>
          <p className="max-w-[672px] font-sans text-lg leading-7 text-bb-espresso/60">
            {t('description')}
          </p>
        </div>

        {/* Cards */}
        <div className="grid w-full max-w-[1152px] grid-cols-2 gap-12">
          <PathCard
            icon={
              <svg width="29" height="26" viewBox="0 0 29 26" fill="none" aria-hidden="true">
                <path d="M14.5 2C14.5 2 6 8 6 15a8.5 8.5 0 0017 0C23 8 14.5 2 14.5 2z" stroke="#996321" strokeWidth="2" strokeLinejoin="round" />
                <path d="M14.5 10v6M11.5 13h6" stroke="#996321" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            title={t('customer.title')}
            description={t('customer.description')}
            features={customerFeatures}
            ctaLabel={t('customer.cta')}
            ctaHref="/find-barber"
            variant="primary"
          />
          <PathCard
            icon={
              <svg width="30" height="27" viewBox="0 0 30 27" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="24" height="21" rx="3" stroke="#2b140f" strokeWidth="2" />
                <path d="M3 9h24M9 3v6M21 3v6" stroke="#2b140f" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            title={t('owner.title')}
            description={t('owner.description')}
            features={ownerFeatures}
            ctaLabel={t('owner.cta')}
            ctaHref="/register-shop"
            variant="outline"
          />
        </div>
      </div>
    </section>
  );
}
