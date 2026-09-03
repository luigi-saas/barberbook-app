"use client";

import { cn } from "@repo/design-system/lib/utils";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { BBLanguageSwitcher } from "../../(guest)/(home)/components/bb-language-switcher";

export function Header() {
  const t = useTranslations("web.marketing.nav");
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: t("explore"), href: `/${locale}/explore` },
    { label: t("pricing"), href: `/${locale}/pricing` },
    { label: t("blog"), href: `/${locale}/blog` },
    { label: t("contact"), href: `/${locale}/contact` },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-bb-cream-border/70 bg-bb-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-8">
        {/* Logo + desktop nav */}
        <div className="flex items-center gap-10">
          <Link
            href={`/${locale}`}
            className="font-display text-xl font-extrabold tracking-tight text-bb-espresso"
          >
            BarberBook<span className="text-bb-espresso-gold">.ma</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "font-semibold text-bb-espresso-gold"
                    : "text-bb-espresso/70 hover:text-bb-espresso",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <BBLanguageSwitcher />
          <Link
            href={`/${locale}/login`}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-bb-espresso/80 transition hover:bg-bb-cream-border/50 hover:text-bb-espresso"
          >
            {t("login")}
          </Link>
          <Link
            href={`/${locale}/booking`}
            className="rounded-xl bg-bb-espresso-gold px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(119,90,25,0.45)] transition hover:bg-bb-espresso-gold-deep"
          >
            {t("booking")}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center rounded-xl p-2 text-bb-espresso transition hover:bg-bb-cream-border/50 lg:hidden"
        >
          <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-bb-cream-border bg-bb-cream lg:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-1 px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium transition",
                  isActive(link.href)
                    ? "bg-bb-gold-muted/40 font-semibold text-bb-espresso-gold"
                    : "text-bb-espresso/80 hover:bg-bb-cream-border/40",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-3 border-t border-bb-cream-border pt-4">
              <Link
                href={`/${locale}/login`}
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-xl border border-bb-cream-border px-4 py-3 text-center text-sm font-semibold text-bb-espresso"
              >
                {t("login")}
              </Link>
              <Link
                href={`/${locale}/booking`}
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-xl bg-bb-espresso-gold px-4 py-3 text-center text-sm font-bold text-white"
              >
                {t("booking")}
              </Link>
            </div>
            <div className="mt-3 flex justify-center">
              <BBLanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
