/* eslint-disable max-classes-per-file */

import * as ErrorService from 'hyperview/src/services/error';
import { XMLSerializer } from '@instawork/xmldom';

export class UnsupportedContentTypeError extends ErrorService.HvBaseError {
  name = 'UnsupportedContentTypeError';
}

/**
 * XML parser errors
 */

export class XMLParserWarning extends ErrorService.HvBaseError {
  name = 'ParserWarning';

  constructor(
    message: string,
    url?: string,
    content?: string,
    status?: number,
  ) {
    super(message);
    this.setExtraContext('url', url);
    this.setExtraContext('content', content);
    this.setExtraContext('status', status);
  }
}

export class XMLParserError extends ErrorService.HvBaseError {
  name = 'ParserError';

  constructor(
    message: string,
    url?: string,
    content?: string,
    status?: number,
  ) {
    super(message);
    this.setExtraContext('url', url);
    this.setExtraContext('content', content);
    this.setExtraContext('status', status);
  }
}

export class XMLParserFatalError extends ErrorService.HvBaseError {
  name = 'ParserFatalError';

  constructor(
    message: string,
    url?: string,
    content?: string,
    status?: number,
  ) {
    super(message);
    this.setExtraContext('url', url);
    this.setExtraContext('content', content);
    this.setExtraContext('status', status);
  }
}

/**
 * XML validation errors
 */
export class XMLRequiredElementNotFound extends ErrorService.HvBaseError {
  name = 'XMLRequiredElementNotFound';

  constructor(tag: string, url: string, content: string) {
    super(`Required <${tag}> tag not found in the response from ${url}`);
    this.setExtraContext('tag', tag);
    this.setExtraContext('url', url);
    this.setExtraContext('content', content);
  }
}

export class XMLRestrictedElementFound extends ErrorService.HvBaseError {
  name = 'XMLRestrictedElementFound';

  constructor(tag: string, url: string, content: string) {
    super(`Restricted <${tag}> tag found in the response from ${url}`);
    this.setExtraContext('tag', tag);
    this.setExtraContext('url', url);
    this.setExtraContext('content', content);
  }
}

/**
 * Fetch errors
 */
export class ServerError extends ErrorService.HvBaseError {
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
    this.setExtraContext('url', url);
    this.setExtraContext('responseText', responseText);
    this.setExtraContext('responseHeaders', responseHeaders);
    this.setExtraContext('status', status);
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
