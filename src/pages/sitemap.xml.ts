import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIContext } from 'astro';
import { BITS_PAGE_SIZE, ESSAYS_PAGE_SIZE, MODULES_PAGE_SIZE } from '../constants/pagination';
import { getSiteUrl } from '../utils/site';

type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

type EssayEntry = CollectionEntry<'essays'>;
type BitEntry = CollectionEntry<'bits'>;
type LogicModuleEntry = CollectionEntry<'logicModules'>;
type PageEntry = CollectionEntry<'pages'>;

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const toAbsolute = (pathname: string, siteUrl: URL) => new URL(pathname, siteUrl).toString();

const parseDate = (value: unknown): string | undefined => {
  if (!value) {
    return undefined;
  }

  const parsedDate = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(parsedDate.valueOf()) ? undefined : parsedDate.toISOString();
};

const buildUrlTag = ({ loc, lastmod }: SitemapEntry) => {
  const lines = ['  <url>', `    <loc>${escapeXml(loc)}</loc>`];
  if (lastmod) {
    lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  }
  lines.push('  </url>');

  return lines.join('\n');
};

const latestDate = (values: string[]): string | undefined => {
  if (!values.length) {
    return undefined;
  }

  return values.reduce((latest, current) =>
    new Date(current).valueOf() > new Date(latest).valueOf() ? current : latest,
  );
};

const buildPaginationEntries = (
  basePath: string,
  totalItems: number,
  pageSize: number,
  siteUrl: URL,
  lastmod?: string,
): SitemapEntry[] => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return Array.from({ length: totalPages }, (_, index) => ({
    loc: toAbsolute(`${basePath}/page/${index + 1}`, siteUrl),
    lastmod,
  }));
};

export async function GET({ site }: APIContext) {
  const siteUrl = getSiteUrl(site);
  const [essays, bits, modules, pages] = await Promise.all([
    getCollection('essays'),
    getCollection('bits'),
    getCollection('logicModules'),
    getCollection('pages'),
  ]);

  const essayDates = essays
    .map((entry: EssayEntry) => parseDate(entry.data.pubDate))
    .filter((date: string | undefined): date is string => Boolean(date));

  const bitDates = bits
    .map((entry: BitEntry) => parseDate(entry.data.timestamp))
    .filter((date: string | undefined): date is string => Boolean(date));

  const entries: SitemapEntry[] = [
    // 1. The Home Page
    { loc: toAbsolute('/', siteUrl) },
    
    // 2. All Static Pages (Dynamic mapping instead of hardcoding terms/authors/etc)
    ...pages.map((entry: PageEntry) => ({
      loc: toAbsolute(`/${entry.id}`, siteUrl),
      lastmod: parseDate(entry.data.lastUpdated),
    })),

    // 3. Pagination Roots
    ...buildPaginationEntries('/essays', essays.length, ESSAYS_PAGE_SIZE, siteUrl, latestDate(essayDates)),
    ...buildPaginationEntries('/bits', bits.length, BITS_PAGE_SIZE, siteUrl, latestDate(bitDates)),
    ...buildPaginationEntries('/logic-modules', modules.length, MODULES_PAGE_SIZE, siteUrl),
    
    // 4. Individual Content Entries
    ...essays.map((entry: EssayEntry) => ({
      loc: toAbsolute(`/essays/${entry.id}`, siteUrl),
      lastmod: parseDate(entry.data.pubDate),
    })),
    ...bits.map((entry: BitEntry) => ({
      loc: toAbsolute(`/bits/${entry.id}`, siteUrl),
      lastmod: parseDate(entry.data.timestamp),
    })),
    ...modules.map((entry: LogicModuleEntry) => ({
      loc: toAbsolute(`/logic-modules/${entry.id}`, siteUrl),
    })),
  ];

  const xml =[
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(buildUrlTag),
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
