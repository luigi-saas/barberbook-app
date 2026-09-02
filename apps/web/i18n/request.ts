import { getRequestConfig } from 'next-intl/server';

const defaultLocale = 'fr';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? defaultLocale;

  return {
    locale,
    timeZone: "Africa/Casablanca",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
