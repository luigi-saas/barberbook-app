import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    client: {
      // Template placeholders ("phc_", "https://example.com", "") are treated
      // as unset so analytics gracefully disables itself instead of firing
      // requests at a dead host (CORS/404 console spam in dev).
      NEXT_PUBLIC_POSTHOG_KEY: z
        .string()
        .startsWith("phc_")
        .refine((key) => key.length > 4)
        .optional()
        .catch(undefined),
      NEXT_PUBLIC_POSTHOG_HOST: z
        .url()
        .refine((host) => host !== "https://example.com")
        .optional()
        .catch(undefined),
      NEXT_PUBLIC_GA_MEASUREMENT_ID: z
        .string()
        .startsWith("G-")
        .refine((id) => id.length > 2)
        .optional()
        .catch(undefined),
    },
    runtimeEnv: {
      NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    },
  });
