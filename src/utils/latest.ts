import { getCollection, type CollectionEntry } from 'astro:content';

const moduleNumberCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

export type LatestContent = {
  latestLogic?: CollectionEntry<'logicModules'>;
  latestBit?: CollectionEntry<'bits'>;
  latestEssay?: CollectionEntry<'essays'>;
};

const pickLatest = <T,>(items: T[], compareFn: (a: T, b: T) => number): T | undefined => {
  if (!items.length) {
    return undefined;
  }

  return items.reduce((best, curr) => (compareFn(curr, best) < 0 ? curr : best));
};

export async function getLatestContent(): Promise<LatestContent> {
  const [logicModules, bits, essays] = await Promise.all([
    getCollection('logicModules'),
    getCollection('bits'),
    getCollection('essays'),
  ]);

  const latestLogic = pickLatest(
    logicModules,
    (a: CollectionEntry<'logicModules'>, b: CollectionEntry<'logicModules'>) =>
      moduleNumberCollator.compare(b.data.moduleNumber, a.data.moduleNumber),
  );

  const latestBit = pickLatest(
    bits,
    (a: CollectionEntry<'bits'>, b: CollectionEntry<'bits'>) =>
      b.data.timestamp.valueOf() - a.data.timestamp.valueOf(),
  );

  const latestEssay = pickLatest(
    essays,
    (a: CollectionEntry<'essays'>, b: CollectionEntry<'essays'>) =>
      b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return { latestLogic, latestBit, latestEssay };
}

export async function getSortedLogicModules() {
  const modules = await getCollection('logicModules');
  return [...modules].sort((a, b) =>
    moduleNumberCollator.compare(a.data.moduleNumber, b.data.moduleNumber),
  );
}
