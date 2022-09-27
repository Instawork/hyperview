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
  import { Cache } from 'react-native-cache';
//   import { AsyncStorage } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  const cachedFetch = (
    url: string,
    options: RequestOptions,
    cache: HttpCache,
    baseFetch: Fetch,
  ): Promise<Response> => {
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
      if (!response.ok) {
        return response;
      }
  
      const clonedResponse = response.clone();
      response.blob().then(blob => {
        const cacheValue: HttpCacheValue = {
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
  
  /**
   * Creates an HTTP cache to use with fetch(). The cache will be
   */
  export const createCache = (): HttpCache =>  {
  return new Cache({
    namespace: "hyperview",
    policy: {
        maxEntries: 50000, // if unspecified, it can have unlimited entries
        stdTTL: 0 // the standard ttl as number in seconds, default: 0 (unlimited)
    },
    backend: AsyncStorage,
    });
  }  
  /**
   * Returns an implementation of fetch() that wraps the given implementation in an HTTP cache.
   */
  export const wrapFetch = (cache: HttpCache, baseFetch: Fetch): Fetch => (
    url: string,
    options: RequestOptions,
  ): Promise<Response> => cachedFetch(url, options, cache, baseFetch);