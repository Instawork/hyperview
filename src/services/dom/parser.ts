/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Errors from './errors';
import * as UrlService from 'hyperview/src/services/url';
import type {
  BeforeAfterParseHandler,
  Fetch,
  HttpMethod,
  XResponseStaleReason,
} from './types';
import {
  CONTENT_TYPE,
  HTTP_HEADERS,
  HTTP_METHODS,
  X_RESPONSE_STALE_REASON,
} from './types';
import { DOMParser } from '@instawork/xmldom';
import { Dimensions } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import { getFirstTag } from './helpers';
import { version } from 'hyperview/package.json';

const { width, height } = Dimensions.get('window');

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

  onBeforeParse: BeforeAfterParseHandler | null | undefined;

  onAfterParse: BeforeAfterParseHandler | null | undefined;

  constructor(
    fetch: Fetch,
    onBeforeParse?: BeforeAfterParseHandler | null,
    onAfterParse?: BeforeAfterParseHandler | null,
  ) {
    this.fetch = fetch;
    this.onBeforeParse = onBeforeParse;
    this.onAfterParse = onAfterParse;
  }

  load = async (
    baseUrl: string,
    data?: any | null,
    httpMethod?: HttpMethod | null,
    acceptContentType: string = CONTENT_TYPE.APPLICATION_VND_HYPERVIEW_XML,
  ): Promise<{
    doc: Document;
    staleHeaderType: XResponseStaleReason | null | undefined;
  }> => {
    // HTTP method can either be POST when explicitly set
    // Any other value and we'll default to GET
    const method =
      httpMethod === HTTP_METHODS.POST ? HTTP_METHODS.POST : HTTP_METHODS.GET;

    // For GET requests, we can't include a body so we encode the form data as a query
    // string in the URL.
    const url =
      method === HTTP_METHODS.GET && data
        ? UrlService.addFormDataToUrl(baseUrl, data)
        : baseUrl;

    const options = {
      // For non-GET requests, include the formdata as the body of the request.
      body: method === HTTP_METHODS.GET ? undefined : data,
      headers: {
        [HTTP_HEADERS.ACCEPT]: `${CONTENT_TYPE.APPLICATION_XML}, ${acceptContentType}`,
        [HTTP_HEADERS.X_HYPERVIEW_VERSION]: version,
        [HTTP_HEADERS.X_HYPERVIEW_DIMENSIONS]: `${width}w ${height}h`,
      },
      method,
    } as const;

    const response: Response = await this.fetch(url, options);
    const responseText: string = await response.text();
    const contentType: string | null = response.headers?.get(
      HTTP_HEADERS.CONTENT_TYPE,
    );
    const staleHeaderType: XResponseStaleReason = response.headers?.get(
      HTTP_HEADERS.X_RESPONSE_STALE_REASON,
    ) as XResponseStaleReason;
    if (
      response.status >= 500 &&
      staleHeaderType !== X_RESPONSE_STALE_REASON.STALE_IF_ERROR &&
      contentType !== CONTENT_TYPE.APPLICATION_XML
    ) {
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
    const doc = parser.parseFromString(responseText);
    if (this.onAfterParse) {
      this.onAfterParse(url);
    }
    return { doc, staleHeaderType: staleHeaderType || null };
  };

  loadDocument = async (
    baseUrl: string,
  ): Promise<{
    doc: Document;
    staleHeaderType: XResponseStaleReason | null | undefined;
  }> => {
    const { doc, staleHeaderType } = await this.load(baseUrl);
    const docElement = getFirstTag(doc, LOCAL_NAME.DOC);
    if (!docElement) {
      throw new Errors.XMLRequiredElementNotFound(LOCAL_NAME.DOC, baseUrl);
    }

    const screenElement = getFirstTag(docElement, LOCAL_NAME.SCREEN);
    const navigatorElement = getFirstTag(docElement, LOCAL_NAME.NAVIGATOR);
    if (!screenElement) {
      throw new Errors.XMLRequiredElementNotFound(LOCAL_NAME.SCREEN, baseUrl);
    }
    if (!navigatorElement) {
      throw new Errors.XMLRequiredElementNotFound(
        LOCAL_NAME.NAVIGATOR,
        baseUrl,
      );
    }

    if (screenElement) {
      const bodyElement = getFirstTag(screenElement, LOCAL_NAME.BODY);
      if (!bodyElement) {
        throw new Errors.XMLRequiredElementNotFound(LOCAL_NAME.BODY, baseUrl);
      }
    } else if (navigatorElement) {
      const routeElement = getFirstTag(navigatorElement, LOCAL_NAME.NAV_ROUTE);
      if (!routeElement) {
        throw new Errors.XMLRequiredElementNotFound(
          LOCAL_NAME.NAV_ROUTE,
          baseUrl,
        );
      }
    } else {
      if (!screenElement) {
        throw new Errors.XMLRequiredElementNotFound(LOCAL_NAME.SCREEN, baseUrl);
      }
      if (!navigatorElement) {
        throw new Errors.XMLRequiredElementNotFound(
          LOCAL_NAME.NAVIGATOR,
          baseUrl,
        );
      }
    }
    return { doc, staleHeaderType };
  };

  loadElement = async (
    baseUrl: string,
    data?: any | null,
    method: HttpMethod | null = HTTP_METHODS.GET,
  ): Promise<{
    doc: Document;
    staleHeaderType: XResponseStaleReason | null | undefined;
  }> => {
    const { doc, staleHeaderType } = await this.load(
      baseUrl,
      data,
      method,
      CONTENT_TYPE.APPLICATION_VND_HYPERVIEW_FRAGMENT_XML,
    );
    const docElement = getFirstTag(doc, LOCAL_NAME.DOC);
    if (docElement) {
      throw new Errors.XMLRestrictedElementFound(LOCAL_NAME.DOC, baseUrl);
    }

    const navigatorElement = getFirstTag(doc, LOCAL_NAME.NAVIGATOR);
    if (navigatorElement) {
      throw new Errors.XMLRestrictedElementFound(LOCAL_NAME.NAVIGATOR, baseUrl);
    }

    const screenElement = getFirstTag(doc, LOCAL_NAME.SCREEN);
    if (screenElement) {
      throw new Errors.XMLRestrictedElementFound(LOCAL_NAME.SCREEN, baseUrl);
    }

    const bodyElement = getFirstTag(doc, LOCAL_NAME.BODY);
    if (bodyElement) {
      throw new Errors.XMLRestrictedElementFound(LOCAL_NAME.BODY, baseUrl);
    }
    return { doc, staleHeaderType };
  };
}
