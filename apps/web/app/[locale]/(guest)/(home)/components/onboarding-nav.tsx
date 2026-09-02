'use client';

import { cn } from '@repo/design-system/lib/utils';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BBLanguageSwitcher } from './bb-language-switcher';

export function OnboardingNav() {
  const t = useTranslations('web.home.onboarding.nav');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: t('story'), href: '#story' },
    { label: t('services'), href: '#services' },
    { label: t('gallery'), href: '#gallery' },
    { label: t('locations'), href: '#locations' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-bb-cream-border bg-bb-cream">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-sans text-2xl font-bold uppercase tracking-[-0.05em] text-bb-espresso"
        >
          BarberBook.ma
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => {
            const isActive = pathname.endsWith(link.href.replace('#', ''));
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'font-sans text-base font-medium tracking-[-0.025em] transition-colors',
                  isActive
                    ? 'border-b-2 border-bb-espresso pb-1.5 text-bb-espresso'
                    : 'text-bb-espresso/60 hover:text-bb-espresso',
                )}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right: language switcher + CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <BBLanguageSwitcher />

          <Link
            href="/booking"
            className="hidden rounded-full bg-bb-espresso px-8 py-2.5 font-sans text-base font-semibold text-bb-cream transition hover:opacity-90 lg:block"
          >
            {t('cta')}
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-full text-bb-espresso/70 transition hover:bg-bb-espresso/5 lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-bb-cream-border bg-bb-cream px-6 pb-6 lg:hidden">
          <nav className="mt-4 flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-sans text-base font-medium text-bb-espresso/70 transition hover:bg-bb-espresso/5 hover:text-bb-espresso"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <Link
            href="/booking"
            onClick={() => setMenuOpen(false)}
            className="mt-4 block rounded-full bg-bb-espresso py-3 text-center font-sans text-base font-semibold text-bb-cream"
          >
            {t('cta')}
          </Link>
        </div>
      )}
    </header>
  );
}
