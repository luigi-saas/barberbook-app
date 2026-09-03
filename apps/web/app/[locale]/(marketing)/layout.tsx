import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

interface MarketingLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}

const MarketingLayout = async ({ children, params }: MarketingLayoutProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default MarketingLayout;
