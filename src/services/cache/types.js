// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { fetch as Fetch, Request, Response } from 'whatwg-fetch';

export type { Fetch, Request, Response };

export type RequestOptions = {
  method?: string,
  onRevalidate?: () => void,
};

type Cache<K, V> = {
  set: (key: K, value: V, maxAge?: number) => void,
  get: (key: K) => V,
  peek: (key: K) => V,
  del: (key: K) => void,
  reset: () => void,
  has: (key: K) => boolean,
  prune: () => void,
  length: number,
};

type CacheOptions<K, V> = {
  max?: number,
  maxAge?: number,
  length?: (value: V, key: K) => number,
  dispose?: (key: K, value: V) => void,
  stale?: boolean,
};

export type HttpCacheValue = {
  size: number,
  response: Response,
};

export type HttpCache = Cache<string, HttpCacheValue>;
export type HttpCacheOptions = CacheOptions<string, HttpCacheValue>;
