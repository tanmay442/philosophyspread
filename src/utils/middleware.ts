const SKIP_PREFIXES = ['/_astro/', '/_image/'] as const;
const SKIP_EXACT = new Set(['/sitemap.xml', '/robots.txt', '/favicon.svg']);
const SKIP_EXTENSION = /\.(?:png|jpe?g|gif|svg|webp|avif|ico|css|js|map|woff2?|ttf|eot|mp4|webm|mp3|wav)$/i;

export const shouldSkipClerkMiddleware = (pathname: string): boolean => {
  if (SKIP_EXACT.has(pathname)) {
    return true;
  }
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }
  return SKIP_EXTENSION.test(pathname);
};
