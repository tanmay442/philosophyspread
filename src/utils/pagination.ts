export type PaginationUrls = {
  prev: string | null;
  next: string | null;
};

export type PaginationResult<T> = {
  items: T[];
  currentPage: number;
  lastPage: number;
  url: PaginationUrls;
};

type PaginateItemsOptions = {
  pageNumber: number;
  pageSize: number;
  basePath: string;
};

const pageUrl = (basePath: string, pageNumber: number): string =>
  pageNumber === 1 ? `${basePath}/` : `${basePath}/page/${pageNumber}/`;

function parsePageNumber(rawPageNumber: string | undefined): number | null {
  const pageToken = rawPageNumber ?? '1';
  if (!/^[1-9]\d*$/.test(pageToken)) {
    return null;
  }

  const pageNumber = Number(pageToken);

  if (!Number.isSafeInteger(pageNumber)) {
    return null;
  }

  return pageNumber;
}

export function buildPagePaths(itemCount: number, pageSize: number) {
  const lastPage = Math.max(1, Math.ceil(itemCount / pageSize));
  return Array.from({ length: lastPage }, (_, index) => ({
    params: { page: String(index + 1) },
  }));
}

export function resolvePage<T>(
  items: T[],
  rawPageNumber: string | undefined,
  pageSize: number,
  basePath: string,
): PaginationResult<T> | null {
  const pageNumber = parsePageNumber(rawPageNumber);
  if (!pageNumber) {
    return null;
  }
  return paginateItems(items, { pageNumber, pageSize, basePath });
}

function paginateItems<T>(
  items: T[],
  { pageNumber, pageSize, basePath }: PaginateItemsOptions,
): PaginationResult<T> | null {
  const lastPage = Math.max(1, Math.ceil(items.length / pageSize));
  if (pageNumber > lastPage) {
    return null;
  }

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: items.slice(startIndex, endIndex),
    currentPage: pageNumber,
    lastPage,
    url: {
      prev: pageNumber > 1 ? pageUrl(basePath, pageNumber - 1) : null,
      next: pageNumber < lastPage ? pageUrl(basePath, pageNumber + 1) : null,
    },
  };
}
