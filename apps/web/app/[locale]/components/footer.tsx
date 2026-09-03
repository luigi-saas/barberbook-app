import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const Footer = async () => {
  const t = await getTranslations("web.marketing.footer");

  const columns = [
    {
      title: t("product"),
      links: [
        { label: t("exploreLabel"), href: "/explore" },
        { label: t("bookingLabel"), href: "/booking" },
        { label: t("bookingsLabel"), href: "/bookings" },
        { label: t("pricingLabel"), href: "/pricing" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("blogLabel"), href: "/blog" },
        { label: t("contactLabel"), href: "/contact" },
      ],
    },
    {
      title: t("legal"),
      links: [
        { label: t("privacy"), href: "/legal/privacy" },
        { label: t("terms"), href: "/legal/terms" },
      ],
    },
  ];

  return (
    <footer className="border-t border-bb-cream-border bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="font-display text-xl font-extrabold tracking-tight text-bb-espresso"
            >
              BarberBook<span className="text-bb-espresso-gold">.ma</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-bb-on-surface-muted">
              {t("tagline")}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-bb-espresso/60">
                {column.title}
              </p>
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-bb-on-surface-muted transition-colors hover:text-bb-espresso-gold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-bb-cream-border pt-6">
          <p className="text-xs text-bb-on-surface-muted/70">{t("rights")}</p>
        </div>
      </div>
    </footer>
  );
};
