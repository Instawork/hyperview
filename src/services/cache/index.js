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

const revalidateCacheHit = (
  url: string,
  cacheValue: HttpCacheValue,
  options: RequestOptions,
  cache: HttpCache,
  baseFetch: Fetch,
): Promise<Response> => {
  const { response, policy } = cacheValue;

  const revalidationHeaders = policy.revalidationHeaders(options);
  const revalidationOptions = { ...options, headers: revalidationHeaders };

  console.log(`revalidating ${url}...`);

  return baseFetch(url, revalidationOptions).then(revalidationResponse => {
    const revalidation = policy.revalidatedPolicy(
      options,
      revalidationResponse,
    );
    const revalidatedPolicy = revalidation.policy;
    const modified: boolean = revalidation.modified;

    console.log(modified ? 'modified' : 'not modified');
    const newResponse = modified ? revalidationResponse : response.clone();
    const clonedResponse = newResponse.clone();

    newResponse.blob().then(blob => {
      const newCacheValue: HttpCacheValue = {
        response: clonedResponse,
        size: blob.size,
        policy: revalidatedPolicy,
      };
      const expiry = revalidatedPolicy.timeToLive();
      console.log(`caching ${url} for ${expiry}ms`);
      cache.set(url, newCacheValue, expiry);
    });

    return clonedResponse;
  });
};

const handleCacheHit = (
  url: string,
  cacheValue: HttpCacheValue,
  options: RequestOptions,
  cache: HttpCache,
  baseFetch: Fetch,
): Promise<Response> => {
  const { response, policy } = cacheValue;

  console.log(`cache hit for ${url}`);
  if (policy.satisfiesWithoutRevalidation(options)) {
    console.log(`cached response can be used without revalidation`);
    const newResponse = response.clone();
    newResponse.headers = policy.responseHeaders();
    return Promise.resolve(newResponse);
  }

  console.log(`cached response needs to be revalidated`);
  return revalidateCacheHit(url, cacheValue, options, cache, baseFetch);
};

const handleCacheMiss = (
  url: string,
  options: RequestOptions,
  cache: HttpCache,
  baseFetch: Fetch,
): Promise<Response> => {
  console.log(`cache miss for ${url}`);
  return baseFetch(url, options).then(response => {
    const cachePolicy = new CachePolicy(options, response, cachePolicyOptions);
    if (!cachePolicy.storable()) {
      console.log(`response for ${url} is not cacheable`);
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
      console.log(`caching ${url} for ${expiry}ms`);
      cache.set(url, cacheValue, expiry);
    });

    return clonedResponse;
  });
};

const cachedFetch = (
  url: string,
  options: RequestOptions,
  cache: HttpCache,
  baseFetch: Fetch,
): Promise<Response> => {
  console.log(`HV cache size: ${cache.length}`);

  const cacheValue: HttpCacheValue = cache.get(url);
  if (cacheValue !== undefined) {
    return handleCacheHit(url, cacheValue, options, cache, baseFetch);
  }
  return handleCacheMiss(url, options, cache, baseFetch);
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
