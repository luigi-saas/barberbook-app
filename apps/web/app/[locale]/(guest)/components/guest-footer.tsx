'use client';

import { Globe, Mail, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export function GuestFooter() {
  const t = useTranslations('web.guest.footer');
  const params = useParams();
  const locale = params.locale as string;
  const [email, setEmail] = useState('');

  const companyLinks = [
    { label: t('company.terms'), href: `/${locale}/legal/terms` },
    { label: t('company.privacy'), href: `/${locale}/legal/privacy` },
    { label: t('company.contact'), href: `/${locale}/contact` },
  ];

  const barberLinks = [
    { label: t('forBarbers.partner'), href: '#partner' },
    { label: t('forBarbers.academy'), href: '#academy' },
    { label: t('forBarbers.software'), href: '#software' },
  ];

  return (
    <footer className="w-full border-t border-white/10 bg-bb-charcoal font-sans">
      <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-display text-xl font-bold text-white">
              BarberBook.ma
            </span>
            <p className="text-sm leading-relaxed text-zinc-400">
              {t('tagline')}
            </p>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              {t('company.title')}
            </h4>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Barbers */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              {t('forBarbers.title')}
            </h4>
            <ul className="flex flex-col gap-3">
              {barberLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              {t('newsletter.title')}
            </h4>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                className="rounded-xl bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:ring-1 focus:ring-bb-espresso-gold transition"
              />
              <button
                type="button"
                className="rounded-xl bg-bb-espresso-gold py-2.5 font-sans text-sm font-bold text-white transition hover:opacity-90 active:scale-95"
              >
                {t('newsletter.cta')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-zinc-500">
            {t('copyright')}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              aria-label="Website"
              className="text-zinc-500 transition-colors hover:text-bb-espresso-gold"
            >
              <Globe className="size-5" />
            </a>
            <a
              href="#"
              aria-label="Share"
              className="text-zinc-500 transition-colors hover:text-bb-espresso-gold"
            >
              <Share2 className="size-5" />
            </a>
            <a
              href="#"
              aria-label="Email"
              className="text-zinc-500 transition-colors hover:text-bb-espresso-gold"
            >
              <Mail className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
