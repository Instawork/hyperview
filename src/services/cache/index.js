// @flow

import LRU from 'lru-cache';

const cachedFetch = (url, options, cache, baseFetch) => {
  console.log(`HV cache size: ${cache.length}`);
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  if (cached !== undefined) {
    console.log('HV found in cache!');
    const response = cached.response.clone();

    // TODO: remove!
    response.headers.set('warning', '110 hyperview "Response is stale"');
    if (options.onRevalidate) {
      setTimeout(options.onRevalidate, 2000);
    }

    return Promise.resolve(response);
  }

  console.log('HV not in cache, fetching...');
  return baseFetch(url, options).then(response => {
    // todo: check here if cacheable
    if (!response.ok) {
      return response;
    }

    const clonedResponse = response.clone();
    response.blob().then(blob => {
      const cacheValue = {
        response: clonedResponse,
        size: blob.size,
      };

      const expiry = 1 * 60 * 1000; // 5 min default
      console.log('caching...');
      cache.set(cacheKey, cacheValue, expiry);
    });

    return clonedResponse;
  });
};

export const createCache = (size: number) =>
  new LRU({
    length: (n, key) => {
      return n.size;
    },
    max: size,
    updateAgeOnGet: false,
  });

export const wrapFetch = (cache, baseFetch) => (url, options) =>
  cachedFetch(url, options, cache, baseFetch);
