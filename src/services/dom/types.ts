/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const HTTP_HEADERS = {
  ACCEPT: 'Accept',
  CONTENT_TYPE: 'Content-Type',
  X_HYPERVIEW_DIMENSIONS: 'X-Hyperview-Dimensions',
  X_HYPERVIEW_VERSION: 'X-Hyperview-Version',
  X_RESPONSE_STALE_REASON: 'X-Response-Stale-Reason',
} as const;

export const HTTP_METHODS = {
  GET: 'get',
  POST: 'post',
} as const;

export type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];

export const CONTENT_TYPE = {
  APPLICATION_VND_HYPERVIEW_FRAGMENT_XML:
    'application/vnd.hyperview_fragment+xml',
  APPLICATION_VND_HYPERVIEW_XML: 'application/vnd.hyperview+xml',
  APPLICATION_XML: 'application/xml',
  TEXT_HTML: 'text/html',
} as const;

export const X_RESPONSE_STALE_REASON = {
  STALE_IF_ERROR: 'stale-if-error',
} as const;

// eslint-disable-next-line max-len
export type XResponseStaleReason = typeof X_RESPONSE_STALE_REASON[keyof typeof X_RESPONSE_STALE_REASON];

export type Fetch = (
  url: string,
  options: {
    headers: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
  },
) => Promise<Response>;

export type ErrorHandler = (error: Error) => void;

export type BeforeAfterParseHandler = (url: string) => void;
