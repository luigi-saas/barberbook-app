'use client';

import { cn } from '@repo/design-system/lib/utils';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { BBLanguageSwitcher } from '../(home)/components/bb-language-switcher';

export function GuestNav() {
  const t = useTranslations('web.guest.nav');
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: t('findBarbers'), href: `/${locale}/explore` },
    { label: t('services'), href: '#services' },
    { label: t('packages'), href: '#packages' },
    { label: t('about'), href: '#about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-bb-cream/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(28,27,27,0.06)]">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-6 lg:px-8">
        {/* Logo + desktop nav */}
        <div className="flex items-center gap-10">
          <Link
            href={`/${locale}`}
            className="font-display text-2xl font-bold tracking-tighter text-bb-espresso-gold"
          >
            BarberBook.ma
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-display text-sm font-semibold tracking-tight transition-all duration-200',
                    isActive
                      ? 'border-b-2 border-bb-espresso-gold pb-0.5 text-bb-espresso'
                      : 'text-bb-espresso/60 hover:text-bb-espresso',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: language + auth CTAs + mobile toggle */}
        <div className="flex items-center gap-3">
          <BBLanguageSwitcher />

          <Link
            href={`/${locale}/login`}
            className="hidden rounded-xl px-5 py-2.5 font-sans text-sm font-medium text-bb-espresso/70 transition-all duration-200 hover:bg-bb-espresso/5 lg:block"
          >
            {t('login')}
          </Link>

          <Link
            href={`/${locale}/sign-up`}
            className="hidden rounded-xl bg-bb-espresso px-5 py-2.5 font-sans text-sm font-semibold text-bb-cream shadow-lg shadow-bb-espresso/20 transition-all duration-200 hover:opacity-90 active:scale-95 lg:block"
          >
            {t('signUp')}
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
        <div className="border-t border-bb-cream-border bg-bb-cream/95 px-6 pb-6 lg:hidden">
          <nav className="mt-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-sans text-sm font-medium text-bb-espresso/70 transition hover:bg-bb-espresso/5 hover:text-bb-espresso"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href={`/${locale}/login`}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl border border-bb-cream-border py-3 text-center font-sans text-sm font-medium text-bb-espresso transition hover:bg-bb-espresso/5"
            >
              {t('login')}
            </Link>
            <Link
              href={`/${locale}/sign-up`}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl bg-bb-espresso py-3 text-center font-sans text-sm font-semibold text-bb-cream"
            >
              {t('signUp')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
