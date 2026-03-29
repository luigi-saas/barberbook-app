import { log } from "./log";

let Sentry: typeof import("@sentry/nextjs") | null = null;

// Only load Sentry in real app environments (not Storybook)
if (process.env.NODE_ENV !== "test" && process.env.STORYBOOK !== "true") {
  try {
    Sentry = require("@sentry/nextjs");
  } catch {
    Sentry = null;
  }
}

export const parseError = (error: unknown): string => {
  let message = "An error occurred";

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = error.message as string;
  } else {
    message = String(error);
  }

  try {
    Sentry?.captureException(error);
    log.error(`Parsing error: ${message}`);
  } catch (newError) {
    console.error("Error parsing error:", newError);
  }

  return message;
};