// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  Fetch,
  HttpCache,
  HttpCacheValue,
  RequestOptions,
  Response,
} from 'hyperview/src/services/cache/types';
import CachePolicy from 'http-cache-semantics';
import LRU from 'lru-cache';

const cachePolicyOptions = {
  shared: false,
};

const cachedFetch = (
  url: string,
  options: RequestOptions,
  cache: HttpCache,
  baseFetch: Fetch,
): Promise<Response> => {
  console.log(`HV cache size: ${cache.length}`);
  const cacheKey = url;

  const cacheValue: HttpCacheValue = cache.get(cacheKey);
  if (cacheValue !== undefined) {
    console.log('HV found in cache!');
    const oldResponse = cacheValue.response.clone();
    const oldPolicy = cacheValue.policy;

    if (!oldPolicy.satisfiesWithoutRevalidation(options)) {
      // The value in the cache needs to be revalidated before we use it.
      const newHeaders = oldPolicy.revalidationHeaders(options);
      const newOptions = {
        ...options,
        headers: newHeaders,
      };
      baseFetch(url, newOptions).then(newResponse => {
        const { policy, modified } = oldPolicy.revalidatedPolicy(
          options,
          newResponse,
        );
        const response = modified ? newResponse : oldResponse;
        const newCacheValue: HttpCacheValue = {
          response,
        };
        cache.set(cacheKey, newCacheValue, policy.timeToLive());
      });
    }

    // We can use the old response to respond to the request
    oldResponse.headers = oldPolicy.responseHeaders();
    return Promise.resolve(oldResponse);
  }

  console.log('HV not in cache, fetching...');
  return baseFetch(url, options).then(response => {
    const cachePolicy = new CachePolicy(options, response, cachePolicyOptions);
    if (!cachePolicy.storable()) {
      console.log('response not cacheable');
      return response;
    }

    const clonedResponse = response.clone();
    response.blob().then(blob => {
      const cacheValue: HttpCacheValue = {
        response: clonedResponse,
        size: blob.size,
        policy: cachePolicy,
      };

      const expiry = cachePolicy.timeToLive();
      console.log(`caching for ${expiry}ms...`);
      cache.set(cacheKey, cacheValue, expiry);
    });

    return clonedResponse;
  });
};

/**
 * Creates an HTTP cache to use with fetch(). The cache will be
 */
export const createCache = (size: number): HttpCache =>
  new LRU({
    length: (value: HttpCacheValue) => value.size,
    max: size,
    updateAgeOnGet: false,
  });

/**
 * Returns an implementation of fetch() that wraps the given implementation in an HTTP cache.
 */
export const wrapFetch = (cache: HttpCache, baseFetch: Fetch): Fetch => (
  url: string,
  options: RequestOptions,
): Promise<Response> => cachedFetch(url, options, cache, baseFetch);
