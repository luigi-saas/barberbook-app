import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import type { ReactNode } from "react";
import { keys } from "./keys";

interface AnalyticsProviderProps {
  readonly children: ReactNode;
}

const { NEXT_PUBLIC_GA_MEASUREMENT_ID } = keys();

// VercelAnalytics requests /_vercel/insights/script.js, which only exists on
// Vercel — on other hosts (Render, local) it just produces a 404. VERCEL is
// inlined at build time, so the component is dropped from non-Vercel builds.
const isVercel = process.env.VERCEL === "1";

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => (
  <>
    {children}
    {isVercel && <VercelAnalytics />}
    {NEXT_PUBLIC_GA_MEASUREMENT_ID && (
      <GoogleAnalytics gaId={NEXT_PUBLIC_GA_MEASUREMENT_ID} />
    )}
  </>
);
