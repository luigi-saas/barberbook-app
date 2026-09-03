import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createMetadata } from "@repo/seo/metadata";
import { ContactForm } from "./components/contact-form";

interface ContactProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async ({ params }: ContactProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "web.contact.meta" });
  return createMetadata({ title: t("title"), description: t("description") });
};

const Contact = async ({ params }: ContactProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "web.contact" });

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-[1280px] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-xl">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-bb-espresso">
              {t("title")}
            </h1>
            <p className="mt-3 text-bb-on-surface-muted">{t("subtitle")}</p>
          </div>

          <div className="max-w-xl rounded-[1.75rem] border border-bb-cream-border bg-white p-8 shadow-[var(--bb-shadow-onboarding)] lg:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
