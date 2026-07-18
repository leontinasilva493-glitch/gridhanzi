import createMiddleware from 'next-intl/middleware';
import { routing } from '@/core/i18n/config';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except API routes, static files, etc.
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
