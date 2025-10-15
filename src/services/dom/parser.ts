import * as Errors from './errors';
import * as UrlService from 'hyperview/src/services/url';
import type {
  BeforeAfterParseHandler,
  Fetch,
  HttpMethod,
  XNetworkRetryAction,
  XResponseStaleReason,
} from './types';
import {
  CONTENT_TYPE,
  HTTP_HEADERS,
  HTTP_METHODS,
  X_RESPONSE_STALE_REASON,
} from './types';
import { LOCAL_NAME, NO_OP, SYNC_METHODS } from 'hyperview/src/types';
import {
  buildContextSnippet,
  cleanParserMessage,
  getFirstTag,
  processDocument,
  trimAndCleanString,
} from './helpers';
import { DOMParser } from '@instawork/xmldom';
import { Dimensions } from 'react-native';
import { version } from 'hyperview/package.json';

const { width, height } = Dimensions.get('window');
const SNIPPET_LENGTH = 200;

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

  syncRequests: Map<string, Promise<Response>>;

  constructor(
    fetch: Fetch,
    onBeforeParse: BeforeAfterParseHandler | null | undefined,
    onAfterParse: BeforeAfterParseHandler | null | undefined,
  ) {
    this.fetch = fetch;
    this.onBeforeParse = onBeforeParse;
    this.onAfterParse = onAfterParse;
    this.syncRequests = new Map();
  }

  load = async (
    baseUrl: string,
    data: FormData | null | undefined = undefined,
    httpMethod: HttpMethod | null | undefined = undefined,
    acceptContentType: string = CONTENT_TYPE.APPLICATION_VND_HYPERVIEW_XML,
    networkRetryAction: XNetworkRetryAction | null | undefined = undefined,
    networkRetryEvent: string | null | undefined = undefined,
    syncId: string | null | undefined = undefined,
    syncMethod: string | null | undefined = 'drop',
  ): Promise<
    | {
        doc: Document;
        staleHeaderType: XResponseStaleReason | null | undefined;
      }
    | typeof NO_OP
  > => {
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
        ...(networkRetryAction && {
          [HTTP_HEADERS.X_NETWORK_RETRY_ACTION]: networkRetryAction,
        }),
        ...(networkRetryEvent && {
          [HTTP_HEADERS.X_NETWORK_RETRY_EVENT]: networkRetryEvent,
        }),
      },
      method,
    } as const;

    // Handle sync logic
    let currentRequest: Promise<Response>;

    if (syncId) {
      const existingRequest = this.syncRequests.get(syncId);

      if (existingRequest) {
        // There's already a request in flight for this sync ID
        if (syncMethod === SYNC_METHODS.DROP) {
          // Drop this request
          return NO_OP;
        }
        if (syncMethod === SYNC_METHODS.REPLACE) {
          // Create new request and update the map
          currentRequest = this.fetch(url, options);
          this.syncRequests.set(syncId, currentRequest);
        } else {
          // Unsupported sync method, drop the request
          return NO_OP;
        }
      } else {
        // No existing request, create and store new one
        currentRequest = this.fetch(url, options);
        this.syncRequests.set(syncId, currentRequest);
      }
    } else {
      // No sync ID, proceed normally
      currentRequest = this.fetch(url, options);
    }

    const response: Response = await currentRequest;

    // Clean up the sync request when done
    if (syncId) {
      const storedRequest = this.syncRequests.get(syncId);
      if (storedRequest === currentRequest) {
        this.syncRequests.delete(syncId);
      } else if (syncMethod === SYNC_METHODS.REPLACE) {
        // This request was replaced by a newer one, return NO_OP
        return NO_OP;
      }
    }
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
    let doc: Document;
    try {
      doc = parser.parseFromString(responseText);
    } catch (e) {
      const err = e as Error;
      const snippet = buildContextSnippet(
        err.message,
        responseText,
        SNIPPET_LENGTH,
      );
      if (err instanceof Errors.XMLParserFatalError) {
        // Re-throw with extra context
        throw new Errors.ParserFatalError(
          cleanParserMessage(err.message, snippet),
          url,
          snippet,
          response.status,
        );
      }
      if (err instanceof Errors.XMLParserWarning) {
        // Re-throw with extra context
        throw new Errors.ParserWarning(
          cleanParserMessage(err.message, snippet),
          url,
          snippet,
          response.status,
        );
      }
      // Re-throw with extra context
      throw new Errors.ParserError(
        cleanParserMessage(err?.message || 'Unknown error', snippet),
        url,
        snippet,
        response.status,
      );
    }
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
    const result = await this.load(baseUrl);
    if (result === NO_OP) {
      throw new Error('loadDocument cannot return NO_OP');
    }
    const { doc, staleHeaderType } = result;
    const resultText = doc.toString();
    const docElement = getFirstTag(doc, LOCAL_NAME.DOC);
    if (!docElement) {
      throw new Errors.XMLRequiredElementNotFound(
        LOCAL_NAME.DOC,
        baseUrl,
        resultText,
      );
    }

    const screenElement = getFirstTag(docElement, LOCAL_NAME.SCREEN);
    const navigatorElement = getFirstTag(docElement, LOCAL_NAME.NAVIGATOR);
    if (!screenElement && !navigatorElement) {
      throw new Errors.XMLRequiredElementNotFound(
        `${LOCAL_NAME.SCREEN}/${LOCAL_NAME.NAVIGATOR}`,
        baseUrl,
        resultText,
      );
    }

    if (screenElement) {
      const bodyElement = getFirstTag(screenElement, LOCAL_NAME.BODY);
      if (!bodyElement) {
        throw new Errors.XMLRequiredElementNotFound(
          LOCAL_NAME.BODY,
          baseUrl,
          resultText,
        );
      }
    } else if (navigatorElement) {
      const routeElement = getFirstTag(navigatorElement, LOCAL_NAME.NAV_ROUTE);
      if (!routeElement) {
        throw new Errors.XMLRequiredElementNotFound(
          LOCAL_NAME.NAV_ROUTE,
          baseUrl,
          resultText,
        );
      }
    } else {
      throw new Errors.XMLRequiredElementNotFound(
        `${LOCAL_NAME.SCREEN}/${LOCAL_NAME.NAVIGATOR}`,
        baseUrl,
        resultText,
      );
    }
    return { doc: processDocument(doc), staleHeaderType };
  };

  loadElement = async (
    baseUrl: string,
    data: FormData | null,
    method: HttpMethod | null = HTTP_METHODS.GET,
    networkRetryAction: XNetworkRetryAction | null | undefined,
    networkRetryEvent: string | null | undefined,
    syncId: string | null | undefined = undefined,
    syncMethod: string | null | undefined = 'drop',
  ): Promise<
    | {
        doc: Document;
        staleHeaderType: XResponseStaleReason | null | undefined;
      }
    | typeof NO_OP
  > => {
    const result = await this.load(
      baseUrl,
      data,
      method,
      CONTENT_TYPE.APPLICATION_VND_HYPERVIEW_FRAGMENT_XML,
      networkRetryAction,
      networkRetryEvent,
      syncId,
      syncMethod,
    );

    if (result === NO_OP) {
      return NO_OP;
    }

    const { doc, staleHeaderType } = result;
    const resultText = doc.toString();
    const docElement = getFirstTag(doc, LOCAL_NAME.DOC);
    if (docElement) {
      throw new Errors.XMLRestrictedElementFound(
        LOCAL_NAME.DOC,
        baseUrl,
        resultText,
      );
    }

    const navigatorElement = getFirstTag(doc, LOCAL_NAME.NAVIGATOR);
    if (navigatorElement) {
      throw new Errors.XMLRestrictedElementFound(
        LOCAL_NAME.NAVIGATOR,
        baseUrl,
        resultText,
      );
    }

    const screenElement = getFirstTag(doc, LOCAL_NAME.SCREEN);
    if (screenElement) {
      throw new Errors.XMLRestrictedElementFound(
        LOCAL_NAME.SCREEN,
        baseUrl,
        resultText,
      );
    }

    const bodyElement = getFirstTag(doc, LOCAL_NAME.BODY);
    if (bodyElement) {
      throw new Errors.XMLRestrictedElementFound(
        LOCAL_NAME.BODY,
        baseUrl,
        resultText,
      );
    }
    return { doc: processDocument(doc), staleHeaderType };
  };
}
