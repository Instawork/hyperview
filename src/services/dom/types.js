// @flow

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
};

export const HTTP_METHODS = {
  GET: 'get',
  POST: 'post',
};

export type HttpMethod = $Values<typeof HTTP_METHODS>;

export const CONTENT_TYPE = {
  APPLICATION_VND_HYPERVIEW_FRAGMENT_XML:
    'application/vnd.hyperview_fragment+xml',
  APPLICATION_VND_HYPERVIEW_XML: 'application/vnd.hyperview+xml',
  APPLICATION_XML: 'application/xml',
  TEXT_HTML: 'text/html',
};

export type Fetch = (
  url: string,
  options: { headers: { [string]: any } },
) => Promise<Response>;

export type ErrorHandler = (error: Error) => void;

export type BeforeAfterParseHandler = (url: string) => void;
