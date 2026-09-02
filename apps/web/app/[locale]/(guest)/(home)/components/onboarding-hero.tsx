import { cn } from '@repo/design-system/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const HERO_IMAGE = 'https://www.figma.com/api/mcp/asset/b384f12c-fa7f-40e4-ae27-277458872ef2';

export function OnboardingHero() {
  const t = useTranslations('web.home.onboarding.hero');

  return (
    <section className="relative flex h-[1070px] w-full items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Premium barbershop interior"
          className="size-full object-cover object-center"
        />
      </div>

      {/* Gradient overlay — cream fade from left */}
      <div className="absolute inset-0 bg-gradient-to-r from-bb-cream via-bb-cream/90 to-transparent" />

      {/* Content */}
      <div className="relative z-10 grid w-full max-w-[1280px] grid-cols-2 gap-12 px-8">
        <div className="flex flex-col gap-8 self-center">
          {/* Badge */}
          <div className="inline-flex w-fit items-center rounded-full bg-[rgba(74,90,62,0.1)] px-4 py-1.5">
            <span className="font-sans text-[10px] font-bold uppercase tracking-[2px] text-[#4a5a3e]">
              {t('badge')}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-[72px] font-bold leading-[1] tracking-[-0.025em] text-bb-espresso">
            {t('title1')}
            <br />
            <span className="italic text-bb-espresso-gold">{t('title2')}</span>
            <br />
            {t('title3')}
          </h1>

          {/* Body */}
          <p className="max-w-[512px] font-sans text-xl leading-relaxed text-bb-espresso/70">
            {t('description')}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/booking"
              className={cn(
                'flex items-center gap-2 rounded-full bg-bb-espresso px-10 py-4',
                'font-sans text-lg font-bold text-bb-cream',
                'shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]',
                'transition hover:opacity-90',
              )}
            >
              {t('primaryCta')}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/services"
              className={cn(
                'rounded-full border border-bb-espresso/10 bg-white/50 px-[41px] py-4',
                'font-sans text-lg font-bold text-bb-espresso backdrop-blur-[6px]',
                'transition hover:bg-white/70',
              )}
            >
              {t('secondaryCta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
