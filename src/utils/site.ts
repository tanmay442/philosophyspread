export function getSiteUrl(site: URL | undefined): URL {
  if (!site) {
    throw new Error('Astro.site is not configured');
  }

  return site;
}
