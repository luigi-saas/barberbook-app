import { cn } from "@repo/design-system/lib/utils";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { createMetadata } from "@repo/seo/metadata";

interface PricingProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async ({ params }: PricingProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "web.pricing.meta" });
  return createMetadata({ title: t("title"), description: t("description") });
};

const Pricing = async ({ params }: PricingProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "web.pricing" });

  const plans = [
    { key: "free", price: "0", popular: false },
    { key: "starter", price: "99", popular: false },
    { key: "pro", price: "199", popular: true },
    { key: "elite", price: "349", popular: false },
  ] as const;

  return (
    <main className="min-h-screen bg-bb-cream">
      <section className="px-6 pb-20 pt-16 lg:pt-24">
        <div className="mx-auto max-w-[1280px]">
          {/* Heading */}
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-bb-espresso lg:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-bb-on-surface-muted">{t("subtitle")}</p>
          </div>

          {/* Plans */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.key}
                className={cn(
                  "relative flex flex-col rounded-[1.75rem] border-2 bg-white p-8 transition-shadow",
                  plan.popular
                    ? "border-bb-espresso-gold shadow-[0_20px_50px_-24px_rgba(119,90,25,0.35)]"
                    : "border-bb-cream-border hover:shadow-[var(--bb-shadow-onboarding)]",
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-bb-espresso-gold px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                    {t("popular")}
                  </span>
                )}

                <h2 className="font-display text-xl font-bold text-bb-espresso">
                  {t(`plans.${plan.key}.name`)}
                </h2>
                <p className="mt-1.5 min-h-[40px] text-sm text-bb-on-surface-muted">
                  {t(`plans.${plan.key}.tagline`)}
                </p>

                <p className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-black text-bb-espresso-gold">
                    {plan.price}
                  </span>
                  <span className="text-sm font-semibold text-bb-espresso/70">MAD</span>
                  <span className="text-sm text-bb-on-surface-muted">{t("perMonth")}</span>
                </p>

                <ul className="mt-7 flex flex-1 flex-col gap-3">
                  {(t.raw(`plans.${plan.key}.features`) as string[]).map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-bb-success" strokeWidth={3} />
                      <span className="text-bb-espresso/85">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.key === "elite" ? `/${locale}/contact` : `/${locale}/sign-up`}
                  className={cn(
                    "mt-8 rounded-2xl py-3.5 text-center font-bold transition",
                    plan.popular
                      ? "bg-bb-espresso-gold text-white shadow-[0_8px_20px_-8px_rgba(119,90,25,0.45)] hover:bg-bb-espresso-gold-deep"
                      : "border-2 border-bb-cream-border text-bb-espresso hover:border-bb-espresso-gold/40 hover:bg-bb-gold-muted/20",
                  )}
                >
                  {plan.key === "elite"
                    ? t("contactCta")
                    : plan.key === "free"
                      ? t("ctaFree")
                      : t("cta")}
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-bb-on-surface-muted">{t("note")}</p>
        </div>
      </section>
    </main>
  );
};

export default Pricing;
