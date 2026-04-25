import { showBetaFeature } from "@repo/feature-flags";
import type { Dictionary } from "@repo/internationalization";
import { getMessages, setRequestLocale } from 'next-intl/server';
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { Cases } from "./components/cases";
import { CTA } from "./components/cta";
import { FAQ } from "./components/faq";
import { Features } from "./components/features";
import { Hero } from "./components/hero";
import { Stats } from "./components/stats";
import { Testimonials } from "./components/testimonials";

interface HomeProps {
  params: Promise<{
    locale: string;
  }>;
}

export const generateMetadata = async ({ params }: HomeProps): Promise<Metadata> => {
  const { locale } = await params;
  const messages = await getMessages({ locale }) as unknown as Dictionary;
  return createMetadata(messages.web.home.meta);
};

const Home = async ({ params }: HomeProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale }) as unknown as Dictionary;
  const betaFeature = await showBetaFeature();

  return (
    <>
      {betaFeature && (
        <div className="w-full bg-black py-2 text-center text-white">
          Beta feature now available
        </div>
      )}
      <Hero dictionary={messages} />
      <Cases dictionary={messages} />
      <Features dictionary={messages} />
      <Stats dictionary={messages} />
      <Testimonials dictionary={messages} />
      <FAQ dictionary={messages} />
      <CTA dictionary={messages} />
    </>
  );
};

export default Home;
