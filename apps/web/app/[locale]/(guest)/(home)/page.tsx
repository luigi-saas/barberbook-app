import { showBetaFeature } from "@repo/feature-flags";
import { getMessages, setRequestLocale } from 'next-intl/server';
import { createMetadata } from "@repo/seo/metadata";
import type { Dictionary } from "@repo/internationalization";
import type { Metadata } from "next";
import { OnboardingHero } from "./components/onboarding-hero";
import { OnboardingSplitPaths } from "./components/onboarding-split-paths";
import { OnboardingWhyChoose } from "./components/onboarding-why-choose";
import { OnboardingFunctionality } from "./components/onboarding-functionality";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async ({ params }: HomeProps): Promise<Metadata> => {
  const { locale } = await params;
  const messages = await getMessages({ locale }) as unknown as Dictionary;
  return createMetadata(messages.web.home.meta);
};

const Home = async ({ params }: HomeProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const betaFeature = await showBetaFeature();

  return (
    <>
      {betaFeature && (
        <div className="w-full bg-black py-2 text-center text-white">
          Beta feature now available
        </div>
      )}
      <OnboardingHero />
      <OnboardingSplitPaths />
      <OnboardingWhyChoose />
      <OnboardingFunctionality />
    </>
  );
};

export default Home;
