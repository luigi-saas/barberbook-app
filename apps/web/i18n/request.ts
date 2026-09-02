import { getRequestConfig } from 'next-intl/server';

const defaultLocale = 'fr';
const locales = ['fr', 'en', 'ar'];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  // Only accept known locales: stray requests like /sw.js would otherwise
  // reach [locale] and crash the messages import (MODULE_NOT_FOUND).
  const locale = requested && locales.includes(requested) ? requested : defaultLocale;

  return {
    locale,
    timeZone: "Africa/Casablanca",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
