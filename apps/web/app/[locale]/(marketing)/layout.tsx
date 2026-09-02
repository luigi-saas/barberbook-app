import type { Dictionary } from "@repo/internationalization";
import { getMessages } from "next-intl/server";
import type { ReactNode } from "react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

interface MarketingLayoutProps {
  readonly children: ReactNode;
}

const MarketingLayout = async ({ children }: MarketingLayoutProps) => {
  const messages = await getMessages() as unknown as Dictionary;

  return (
    <>
      <Header dictionary={messages} />
      {children}
      <Footer />
    </>
  );
};

export default MarketingLayout;
