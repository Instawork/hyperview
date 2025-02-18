/* eslint-disable max-classes-per-file */

import * as ErrorService from 'hyperview/src/services/error';
import type { LocalName } from 'hyperview/src/types';
import { XMLSerializer } from '@instawork/xmldom';

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

export class DocumentGetElementByIdError extends ErrorService.HvBaseError {
  name = 'DocumentGetElementByIdError';

  constructor(id: string, doc: Document, error: Error) {
    super(`Document.getElementById failed for id: ${id}`);
    this.stack = error.stack;
    this.setExtraContext('error', error);
    this.setExtraContext('doc', docToString(doc));
    this.setExtraContext('id', id);
  }
}

const docToString = (doc: Document): string => {
  try {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  } catch (e) {
    const error = e as Error;
    return error ? `serializing error: ${error.message}` : 'serializing error';
  }
};
