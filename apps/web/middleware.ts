import createMiddleware from 'next-intl/middleware';
import {nextIntlConfig} from './next-intl.config.js';

export default createMiddleware(nextIntlConfig);

export const config = {
  // Match all pathnames except for
  // - ... (static files)
  // - api (API routes)
  // - _next (Next.js internals)
  // - trpc (tRPC)
  matcher: ['/((?!api|_next|_vercel|.*\\..*|trpc|ingest).*)']
};
