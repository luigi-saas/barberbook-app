import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

interface GuestLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}

/**
 * Unified chrome: every public page — home, booking flow, explore, shops,
 * auth — shares the same Header/Footer (see docs/Design.md).
 */
const GuestLayout = async ({ children, params }: GuestLayoutProps) => {
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

export default GuestLayout;
