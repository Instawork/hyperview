import * as Dom from 'hyperview/src/services/dom';
import * as UrlService from 'hyperview/src/services/url';
import { NO_OP, SYNC_METHODS } from 'hyperview/src/types';
import { X_RESPONSE_STALE_REASON } from './types';
import { version } from 'hyperview/package.json';

// Mock @instawork/xmldom module
const mockExpectedDocument = { foo: 'bar' } as const;
const mockParseFromString = jest.fn().mockReturnValue(mockExpectedDocument);
type CapturedParserOptions = {
  errorHandler?: {
    error?: (msg: string) => never;
    fatalError?: (msg: string) => never;
    warning?: (msg: string) => never;
  };
  locator?: unknown;
};
let mockCapturedDOMParserOptions: CapturedParserOptions | null = null;
jest.mock('@instawork/xmldom', () => {
  class DOMParser {
    options: CapturedParserOptions | null;

    constructor(options?: CapturedParserOptions) {
      mockCapturedDOMParserOptions = options || null;
      this.options = mockCapturedDOMParserOptions;
    }

    parseFromString(input: string): Document {
      if (this.options === undefined) {
        // no-op
      }
      return (mockParseFromString(input) as unknown) as Document;
    }
  }
  return { DOMParser };
});

// Mock other dependencies
const fetchMock = jest.fn();
const responseTextMock = jest.fn();
fetchMock.mockResolvedValue({ text: responseTextMock });
const beforeParseMock = jest.fn();
const afterParseMock = jest.fn();
const urlServiceAddFormDataToUrlMock = jest.spyOn(
  UrlService,
  'addFormDataToUrl',
);
const parser = new Dom.Parser(fetchMock, beforeParseMock, afterParseMock);

describe('Parser', () => {
  afterEach(() => {
    mockParseFromString.mockClear();
    fetchMock.mockClear();
    responseTextMock.mockClear();
    beforeParseMock.mockClear();
    afterParseMock.mockClear();
    urlServiceAddFormDataToUrlMock.mockClear();
  });

  describe('load', () => {
    describe('simple GET', () => {
      it('calls fetch with correct params', async () => {
        const url = 'http://foo/bar';
        const expectedOptions = {
          body: undefined,
          headers: {
            Accept: 'application/xml, application/vnd.hyperview+xml',
            'X-Hyperview-Dimensions': '750w 1334h',
            'X-Hyperview-Version': version,
          },
          method: 'get',
        } as const;
        const responseText = 'foobarbaz';
        responseTextMock.mockResolvedValue(responseText);

        const result = await parser.load(url);
        expect(result).not.toBe(NO_OP);
        const { doc, staleHeaderType } = result as {
          doc: Document;
          staleHeaderType: any;
        };

        expect(urlServiceAddFormDataToUrlMock).toHaveBeenCalledTimes(0);
        expect(mockParseFromString).toHaveBeenCalledWith(responseText);
        expect(beforeParseMock).toHaveBeenCalledWith(url);
        expect(afterParseMock).toHaveBeenCalledWith(url);
        expect(fetchMock).toHaveBeenCalledWith(url, expectedOptions);
        expect(doc).toEqual(mockExpectedDocument);
        expect(staleHeaderType).toBeNull();
      });
    });

    describe('GET with data', () => {
      it('calls fetch with correct params', async () => {
        const url = 'http://foo/bar';
        const data = new FormData();
        data.append('foo', 'bar');
        data.append('bar', 'baz');
        const expectedUrl = 'http://foo/bar?foo=bar&bar=baz';
        urlServiceAddFormDataToUrlMock.mockReturnValue(expectedUrl);
        const responseText = 'foobarbaz';
        responseTextMock.mockResolvedValue(responseText);

        const result = await parser.load(url, data);
        expect(result).not.toBe(NO_OP);
        const { doc, staleHeaderType } = result as {
          doc: Document;
          staleHeaderType: any;
        };

        expect(urlServiceAddFormDataToUrlMock).toHaveBeenCalledWith(url, data);
        expect(mockParseFromString).toHaveBeenCalledWith(responseText);
        expect(beforeParseMock).toHaveBeenCalledWith(expectedUrl);
        expect(afterParseMock).toHaveBeenCalledWith(expectedUrl);
        expect(fetchMock).toHaveBeenCalledWith(expectedUrl, {
          body: undefined,
          headers: {
            Accept: 'application/xml, application/vnd.hyperview+xml',
            'X-Hyperview-Dimensions': '750w 1334h',
            'X-Hyperview-Version': version,
          },
          method: 'get',
        });
        expect(doc).toEqual(mockExpectedDocument);
        expect(staleHeaderType).toBeNull();
      });
    });

    describe('offline GET', () => {
      it('sets the right staleHeaderType', async () => {
        const url = 'http://foo/bar';
        const expectedOptions = {
          body: undefined,
          headers: {
            Accept: 'application/xml, application/vnd.hyperview+xml',
            'X-Hyperview-Dimensions': '750w 1334h',
            'X-Hyperview-Version': version,
          },
          method: 'get',
        } as const;
        const responseText = 'foobarbaz';
        responseTextMock.mockResolvedValue(responseText);
        const headers = new Map();
        headers.set(
          Dom.HTTP_HEADERS.X_RESPONSE_STALE_REASON,
          X_RESPONSE_STALE_REASON.STALE_IF_ERROR,
        );
        fetchMock.mockResolvedValueOnce({ headers, text: responseTextMock });

        const result = await parser.load(url);
        expect(result).not.toBe(NO_OP);
        const { doc, staleHeaderType } = result as {
          doc: Document;
          staleHeaderType: any;
        };

        expect(urlServiceAddFormDataToUrlMock).toHaveBeenCalledTimes(0);
        expect(mockParseFromString).toHaveBeenCalledWith(responseText);
        expect(beforeParseMock).toHaveBeenCalledWith(url);
        expect(afterParseMock).toHaveBeenCalledWith(url);
        expect(fetchMock).toHaveBeenCalledWith(url, expectedOptions);
        expect(doc).toEqual(mockExpectedDocument);
        expect(staleHeaderType).toEqual(X_RESPONSE_STALE_REASON.STALE_IF_ERROR);
      });
    });

    describe('POST', () => {
      it('calls fetch with correct params', async () => {
        const url = 'http://foo/bar';
        const data = new FormData();
        data.append('foo', 'bar');
        data.append('bar', 'baz');
        const responseText = 'foobarbaz';
        responseTextMock.mockResolvedValue(responseText);
        const result = await parser.load(url, data, 'post');
        expect(result).not.toBe(NO_OP);
        const { doc, staleHeaderType } = result as {
          doc: Document;
          staleHeaderType: any;
        };

        expect(urlServiceAddFormDataToUrlMock).toHaveBeenCalledTimes(0);
        expect(mockParseFromString).toHaveBeenCalledWith(responseText);
        expect(beforeParseMock).toHaveBeenCalledWith(url);
        expect(afterParseMock).toHaveBeenCalledWith(url);
        expect(fetchMock).toHaveBeenCalledWith(url, {
          body: data,
          headers: {
            Accept: 'application/xml, application/vnd.hyperview+xml',
            'X-Hyperview-Dimensions': '750w 1334h',
            'X-Hyperview-Version': version,
          },
          method: 'post',
        });
        expect(doc).toEqual(mockExpectedDocument);
        expect(staleHeaderType).toBeNull();
      });
    });
    // it.todo('parser warning', () => {});
    // it.todo('parser error', () => {});
    // it.todo('parser fatal error', () => {});
    // it.todo('server error', () => {});

    describe('parsing errors', () => {
      it('throws ParserError when XML is malformed', async () => {
        const url = 'http://foo/invalid';
        // Long XML (>300 chars) with a formatting issue (missing closing quote) in the middle
        const invalidXml =
          '<?xml version="1.0" encoding="utf-8"?>' +
          '<doc>' +
          '<screen id="home"><body>' +
          '<view style="Container Primary">' +
          '<text value="This is a very long block of text intended to push the total XML over three hundred characters for testing purposes. ' +
          'We will intentionally introduce a malformed attribute somewhere in the middle to trigger a parsing error. ' +
          'Here is the broken attribute value="MissingClosingQuote ' +
          'Continuing the XML content to ensure sufficient length and complexity within the document so that the parser processes a sizeable input.' +
          '" style="Title" />' +
          '</view>' +
          '</body></screen>' +
          '</doc>';

        // Compute a column index and craft an xmldom-style error message
        const badIndex = invalidXml.indexOf('MissingClosingQuote');
        const col = badIndex + 1; // 1-based column
        // No longer used directly; caret is inserted into computed snippet

        // Ensure parseFromString throws an XML parser error with position info
        mockParseFromString.mockImplementationOnce(() => {
          const msg =
            'XMLParserWarning: [xmldom warning] unclosed xml attribute ' +
            `@#[line:1,col:${col}]`;
          throw new Dom.XMLParserError(msg);
        });

        responseTextMock.mockResolvedValue(invalidXml);

        try {
          await parser.load(url);
          throw new Error('Expected parser.load to reject');
        } catch (error) {
          const err = error as Dom.ParserError;
          expect(err).toBeInstanceOf(Dom.ParserError);
          // With caret insertion, assert caret exists and we captured context
          const ctx = err.getExtraContext().content as string;
          // Basic sanity: include part of the surrounding tag or error text
          expect(ctx).toMatch(/<text|style="Title"|MissingClosingQuote/);
          expect(mockParseFromString).toHaveBeenCalledWith(invalidXml);
          expect(beforeParseMock).toHaveBeenCalledWith(url);
          expect(afterParseMock).not.toHaveBeenCalled();
        }
      });
    });

    describe('sync functionality', () => {
      it('drops request when sync-method is drop and request is in flight', async () => {
        const url = 'http://foo/bar';
        const syncId = 'test-sync-id';
        const responseText = 'foobarbaz';

        // Mock a slow response for the first request
        let resolveFirst: (value: any) => void;
        const firstRequestPromise = new Promise(resolve => {
          resolveFirst = resolve;
        });
        fetchMock.mockReturnValueOnce(firstRequestPromise);

        // Start first request
        const firstRequest = parser.load(
          url,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          syncId,
          SYNC_METHODS.DROP,
        );

        // Start second request with same sync ID - should be dropped
        const secondRequest = parser.load(
          url,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          syncId,
          SYNC_METHODS.DROP,
        );

        // Second request should return NO_OP immediately
        const secondResult = await secondRequest;
        expect(secondResult).toBe(NO_OP);

        // Complete first request
        responseTextMock.mockResolvedValue(responseText);
        resolveFirst!({ text: responseTextMock, headers: new Map() });

        const firstResult = await firstRequest;
        expect(firstResult).toEqual({
          doc: mockExpectedDocument,
          staleHeaderType: null,
        });
      });

      it('replaces request when sync-method is replace and request is in flight', async () => {
        const url = 'http://foo/bar';
        const syncId = 'test-sync-id-2';
        const responseText1 = 'first-response';
        const responseText2 = 'second-response';

        // Mock responses
        let resolveFirst: (value: any) => void;
        let resolveSecond: (value: any) => void;
        const firstRequestPromise = new Promise(resolve => {
          resolveFirst = resolve;
        });
        const secondRequestPromise = new Promise(resolve => {
          resolveSecond = resolve;
        });

        fetchMock
          .mockReturnValueOnce(firstRequestPromise)
          .mockReturnValueOnce(secondRequestPromise);

        // Start first request
        const firstRequest = parser.load(
          url,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          syncId,
          SYNC_METHODS.REPLACE,
        );

        // Start second request with same sync ID - should replace first
        const secondRequest = parser.load(
          url,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          syncId,
          SYNC_METHODS.REPLACE,
        );

        // Complete both requests
        responseTextMock.mockResolvedValueOnce(responseText1);
        resolveFirst!({
          text: () => Promise.resolve(responseText1),
          headers: new Map(),
        });

        responseTextMock.mockResolvedValueOnce(responseText2);
        resolveSecond!({
          text: () => Promise.resolve(responseText2),
          headers: new Map(),
        });

        // First request should return NO_OP (was replaced)
        const firstResult = await firstRequest;
        expect(firstResult).toBe(NO_OP);

        // Second request should succeed
        const secondResult = await secondRequest;
        expect(secondResult).toEqual({
          doc: mockExpectedDocument,
          staleHeaderType: null,
        });
      });

      it('allows multiple requests with different sync IDs', async () => {
        const url = 'http://foo/bar';
        const syncId1 = 'sync-id-1';
        const syncId2 = 'sync-id-2';
        const responseText = 'response';

        responseTextMock.mockResolvedValue(responseText);
        fetchMock.mockResolvedValue({
          text: responseTextMock,
          headers: new Map(),
        });

        // Start two requests with different sync IDs
        const request1 = parser.load(
          url,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          syncId1,
          SYNC_METHODS.DROP,
        );
        const request2 = parser.load(
          url,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          syncId2,
          SYNC_METHODS.DROP,
        );

        // Both should succeed
        const [result1, result2] = await Promise.all([request1, request2]);
        expect(result1).toEqual({
          doc: mockExpectedDocument,
          staleHeaderType: null,
        });
        expect(result2).toEqual({
          doc: mockExpectedDocument,
          staleHeaderType: null,
        });
      });
    });
  });
  // describe('loadDocument', () => {
  // it.todo('missing <doc>');
  // it.todo('missing <screen>');
  // it.todo('missing <body>');
  // it.todo('valid response');
  // });
  // describe('loadElement', () => {
  // it.todo('with <doc> present');
  // it.todo('with <screen> present');
  // it.todo('with <body> present');
  // it.todo('valid response');
  // });
});
