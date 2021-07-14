// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Errors from './errors';
import * as UrlService from 'hyperview/src/services/url';
import type { BeforeAfterParseHandler, Fetch } from './types';
import { CONTENT_TYPE, HTTP_HEADERS } from './types';
import type { Document, HttpVerb } from 'hyperview/src/types';
import { HTTP_VERBS, LOCAL_NAME } from 'hyperview/src/types';
import { DOMParser } from 'xmldom-instawork';
import { Dimensions } from 'react-native';
import { getFirstTag } from './helpers';
import { version } from 'hyperview/package.json';

const { width, height } = Dimensions.get('window');
const headers = {
  [HTTP_HEADERS.ACCEPT]: CONTENT_TYPE.APPLICATION_XML,
  [HTTP_HEADERS.X_HYPERVIEW_VERSION]: version,
  [HTTP_HEADERS.X_HYPERVIEW_DIMENSIONS]: `${width}w ${height}h`,
};

const parser = new DOMParser({
  errorHandler: {
    error: (error: string) => {
      throw new Errors.XMLParserError(error);
    },
    fatalError: (error: string) => {
      throw new Errors.XMLParserFatalError(error);
    },
    warning: (error: string) => {
      throw new Errors.XMLParserWarning(error);
    },
  },
  locator: {},
});

export class Parser {
  fetch: Fetch;

  onBeforeParse: ?BeforeAfterParseHandler;

  onAfterParse: ?BeforeAfterParseHandler;

  constructor(
    fetch: Fetch,
    onBeforeParse: ?BeforeAfterParseHandler,
    onAfterParse: ?BeforeAfterParseHandler,
  ) {
    this.fetch = fetch;
    this.onBeforeParse = onBeforeParse;
    this.onAfterParse = onAfterParse;
  }

  load = async (
    baseUrl: string,
    data: ?FormData,
    verb: ?HttpVerb = HTTP_VERBS.GET,
  ): Promise<Document> => {
    // For GET requests, we can't include a body so we encode the form data as a query
    // string in the URL.
    const url =
      verb === HTTP_VERBS.GET && data
        ? UrlService.addFormDataToUrl(baseUrl, data)
        : baseUrl;

    const options = {
      // For non-GET requests, include the formdata as the body of the request.
      body: verb === HTTP_VERBS.GET ? undefined : data,
      headers,
      method: verb,
    };

    const response: Response = await this.fetch(url, options);
    const responseText: string = await response.text();

    if (response.status >= 500) {
      throw new Errors.ServerError(
        url,
        responseText,
        response.headers,
        response.status,
      );
    }

    if (this.onBeforeParse) {
      this.onBeforeParse(url);
    }
    const document = parser.parseFromString(responseText);
    if (this.onAfterParse) {
      this.onAfterParse(url);
    }
    return document;
  };

  loadDocument = async (baseUrl: string): Promise<Document> => {
    const doc = await this.load(baseUrl);
    const docElement = getFirstTag(doc, LOCAL_NAME.DOC);
    if (!docElement) {
      throw new Errors.XMLRequiredElementNotFound(LOCAL_NAME.DOC, baseUrl);
    }

    const screenElement = getFirstTag(docElement, LOCAL_NAME.SCREEN);
    if (!screenElement) {
      throw new Errors.XMLRequiredElementNotFound(LOCAL_NAME.SCREEN, baseUrl);
    }

    const bodyElement = getFirstTag(screenElement, LOCAL_NAME.BODY);
    if (!bodyElement) {
      throw new Errors.XMLRequiredElementNotFound(LOCAL_NAME.BODY, baseUrl);
    }
    return doc;
  };

  loadElement = async (
    baseUrl: string,
    data: ?FormData,
    verb: ?HttpVerb = HTTP_VERBS.GET,
  ): Promise<Document> => {
    const doc = await this.load(baseUrl, data, verb);
    const docElement = getFirstTag(doc, LOCAL_NAME.DOC);
    if (docElement) {
      throw new Errors.XMLRestrictedElementFound(LOCAL_NAME.DOC, baseUrl);
    }

    const screenElement = getFirstTag(doc, LOCAL_NAME.SCREEN);
    if (screenElement) {
      throw new Errors.XMLRestrictedElementFound(LOCAL_NAME.SCREEN, baseUrl);
    }

    const bodyElement = getFirstTag(doc, LOCAL_NAME.BODY);
    if (bodyElement) {
      throw new Errors.XMLRestrictedElementFound(LOCAL_NAME.BODY, baseUrl);
    }
    return doc;
  };
}
