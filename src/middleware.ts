import { clerkMiddleware } from '@clerk/astro/server';
import type { MiddlewareHandler } from 'astro';
import { shouldSkipClerkMiddleware } from './utils/middleware';

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const addSecurityHeaders = (response: Response): Response => {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(name)) {
      headers.set(name, value);
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const isLocalHost = (hostname: string): boolean =>
  hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';

const redirectHttpToHttps = (context: Parameters<MiddlewareHandler>[0]): Response | undefined => {
  // Cloudflare forwards the original protocol in this header. Only redirect
  // explicit production HTTP requests; absent headers and local development
  // must remain usable over plain HTTP.
  if (context.isPrerendered) {
    return undefined;
  }

  const forwardedProto = context.request.headers.get('x-forwarded-proto');
  if (forwardedProto !== 'http' || isLocalHost(context.url.hostname)) {
    return undefined;
  }

  const location = new URL(context.request.url);
  location.protocol = 'https:';
  return Response.redirect(location, 308);
};

// Astro middleware does not expose a Next.js-style `config.matcher` export,
// so we wrap clerkMiddleware with an inline skip for non-HTML/static routes.
// This keeps Clerk's auth checks off the hot path for the sitemap, robots,
// favicon, hashed `_astro/*` assets, Astro's `/_image/*` transform endpoint,
// and any directly-requested image/font.
const clerk = clerkMiddleware();

export const onRequest: MiddlewareHandler = async (context, next) => {
  const httpsRedirect = redirectHttpToHttps(context);
  if (httpsRedirect) {
    return addSecurityHeaders(httpsRedirect);
  }

  let nextResponse: Response | undefined;
  const runNext = async (): Promise<Response> => {
    nextResponse ??= await next();
    return nextResponse;
  };

  if (shouldSkipClerkMiddleware(context.url.pathname)) {
    return addSecurityHeaders(await runNext());
  }

  // Clerk may either return the response from its handler or invoke `next`
  // and return void. Cache the latter response so route rendering cannot run
  // twice, which is especially important for request-scoped side effects.
  const result = await clerk(context, runNext);
  if (result instanceof Response) {
    return addSecurityHeaders(result);
  }
  return addSecurityHeaders(await runNext());
};
