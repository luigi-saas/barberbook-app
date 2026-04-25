import "./styles.css";
import { AnalyticsProvider } from "@repo/analytics/provider";
import { Toolbar as CMSToolbar } from "@repo/cms/components/toolbar";
import { DesignSystemProvider } from "@repo/design-system";
import { fonts } from "@repo/design-system/lib/fonts";
import { cn } from "@repo/design-system/lib/utils";
import { Toolbar } from "@repo/feature-flags/components/toolbar";
import type { Dictionary } from "@repo/internationalization";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import NextIntlProvider from "./NextIntlProvider";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const locales = ['en', 'fr', 'es', 'de', 'pt', 'zh', 'ar'];

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
  setRequestLocale(locale);
  const messages = (await import(`../../messages/${locale}.json`)).default as Dictionary;

  return (
    <html
      className={cn(fonts, manrope.variable, "scroll-smooth")}
      lang={locale}
      suppressHydrationWarning
    >
      <body>
        <AnalyticsProvider>
          <DesignSystemProvider>
            <NextIntlProvider locale={locale} messages={messages as unknown as Record<string, unknown>}>
              <Header dictionary={messages} />
              {children}
              <Footer />
            </NextIntlProvider>
          </DesignSystemProvider>
          <Toolbar />
          <CMSToolbar />
        </AnalyticsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
