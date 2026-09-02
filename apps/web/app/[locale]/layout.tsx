import "./styles.css";
import { AnalyticsProvider } from "@repo/analytics/provider";
import { Toolbar as CMSToolbar } from "@repo/cms/components/toolbar";
import { DesignSystemProvider } from "@repo/design-system";
import "@fontsource-variable/manrope";
import "@fontsource-variable/cairo";
import { fonts } from "@repo/design-system/lib/fonts";
import { cn } from "@repo/design-system/lib/utils";
import { Toolbar } from "@repo/feature-flags/components/toolbar";
import type { Dictionary } from "@repo/internationalization";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import NextIntlProvider from "./NextIntlProvider";

const locales = ['fr', 'en', 'ar'];

export const generateStaticParams = () =>
  locales.map((locale) => ({ locale }));

interface RootLayoutProperties {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
}

const RootLayout = async ({ children, params }: RootLayoutProperties) => {
  const { locale } = await params;

  // Stray paths (e.g. /favicon.ico before its route existed, scanner probes)
  // fall into [locale]; only known locales may render, everything else 404s
  // cleanly instead of crashing the message loader with MODULE_NOT_FOUND.
  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = (await import(`../../messages/${locale}.json`)).default as Dictionary;

  return (
    <html
      className={cn(fonts, "scroll-smooth")}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>
        <AnalyticsProvider>
          <DesignSystemProvider>
            <NextIntlProvider locale={locale} messages={messages as unknown as Record<string, unknown>}>
              {children}
            </NextIntlProvider>
          </DesignSystemProvider>
          <Toolbar />
          {process.env.BASEHUB_TOKEN ? <CMSToolbar /> : null}
        </AnalyticsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
