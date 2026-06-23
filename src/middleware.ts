import { clerkMiddleware } from '@clerk/astro/server';
import type { MiddlewareHandler } from 'astro';

const SKIP_PREFIXES = ['/_astro/'] as const;
const SKIP_EXACT = new Set(['/sitemap.xml', '/robots.txt', '/favicon.svg']);
const SKIP_EXTENSION = /\.(?:png|jpe?g|gif|svg|webp|avif|ico|css|js|map|woff2?|ttf|eot|mp4|webm|mp3|wav|pdf|json|txt)$/i;

const shouldSkipMiddleware = (pathname: string): boolean => {
  if (SKIP_EXACT.has(pathname)) {
    return true;
  }
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }
  return SKIP_EXTENSION.test(pathname);
};

// Astro middleware does not expose a Next.js-style `config.matcher` export,
// so we wrap clerkMiddleware with an inline skip for non-HTML/static routes.
// This keeps Clerk's auth checks off the hot path for the sitemap, robots,
// favicon, hashed `_astro/*` assets, and any directly-requested image/font.
const clerk = clerkMiddleware();

export const onRequest: MiddlewareHandler = async (context, next) => {
  if (shouldSkipMiddleware(context.url.pathname)) {
    return next();
  }
  // clerkMiddleware's handler can return void or Response; normalize to
  // a Response by falling through to next() if nothing was returned.
  const result = await clerk(context, next);
  if (result instanceof Response) {
    return result;
  }
  return next();
};