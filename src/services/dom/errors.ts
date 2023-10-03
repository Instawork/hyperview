/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// eslint-disable-next-line max-classes-per-file
import type { LocalName } from 'hyperview/src/types';

export class UnsupportedContentTypeError extends Error {
  name = 'UnsupportedContentTypeError';
}

/**
 * XML parser errors
 */
export class XMLParserWarning extends Error {
  name = 'ParserWarning';
}

export class XMLParserError extends Error {
  name = 'ParserError';
}

export class XMLParserFatalError extends Error {
  name = 'ParserFatalError';
}

/**
 * XML validation errors
 */
export class XMLRequiredElementNotFound extends Error {
  name = 'XMLRequiredElementNotFound';

  constructor(tag: LocalName, url: string) {
    super(`Required <${tag}> tag not found in the response from ${url}`);
  }
}

export class XMLRestrictedElementFound extends Error {
  name = 'XMLRestrictedElementFound';

  constructor(tag: LocalName, url: string) {
    super(`Restricted <${tag}> tag found in the response from ${url}`);
  }
}

/**
 * Fetch errors
 */
export class ServerError extends Error {
  name = 'ServerError';

  responseHeaders: Headers;

  responseText: string;

  status: number;

  constructor(
    url: string,
    responseText: string,
    responseHeaders: Headers,
    status: number,
  ) {
    super(url);
    this.responseText = responseText;
    this.responseHeaders = responseHeaders;
    this.status = status;
  }
}
