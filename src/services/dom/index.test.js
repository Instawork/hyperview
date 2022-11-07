// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Dom from 'hyperview/src/services/dom';
import * as UrlService from 'hyperview/src/services/url';
import { version } from 'hyperview/package.json';

// Mock instawork-xmldom module
const mockExpectedDocument = { foo: 'bar' };
const mockParseFromString = jest.fn().mockReturnValue(mockExpectedDocument);
jest.mock('xmldom-instawork', () => {
  const DOMParser = () => null;
  DOMParser.prototype.parseFromString = (...args) =>
    mockParseFromString.apply(this, args);
  return { DOMParser };
});

// Mock other dependencies
const fetchMock = jest.fn();
const responseTextMock = jest.fn();
const headers = new Map();
headers.set(Dom.HTTP_HEADERS.X_RESPONSE_STALE_REASON, 'stale-if-error');
// $FlowFixMe
fetchMock.mockResolvedValue({ text: responseTextMock }).mockResolvedValueOnce({ text: responseTextMock, headers });
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
    describe('offline GET', () => {
      it('sets the right isStale value', async () => {
        const url = 'http://foo/bar';
        const expectedOptions = {
          body: undefined,
          headers: {
            Accept: 'application/xml, application/vnd.hyperview+xml',
            'X-Hyperview-Dimensions': '750w 1334h',
            'X-Hyperview-Version': version,
          },
          method: 'get',
        };
        const responseText = 'foobarbaz';
        responseTextMock.mockResolvedValue(responseText);

        const { doc, isStale } = await parser.load(url);

        expect(urlServiceAddFormDataToUrlMock).toHaveBeenCalledTimes(0);
        expect(mockParseFromString).toHaveBeenCalledWith(responseText);
        expect(beforeParseMock).toHaveBeenCalledWith(url);
        expect(afterParseMock).toHaveBeenCalledWith(url);
        expect(fetchMock).toHaveBeenCalledWith(url, expectedOptions);
        expect(doc).toEqual(mockExpectedDocument);
        expect(isStale).toEqual(true);
      });
    });

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
        };
        const responseText = 'foobarbaz';
        responseTextMock.mockResolvedValue(responseText);

        const { doc, isStale } = await parser.load(url);

        expect(urlServiceAddFormDataToUrlMock).toHaveBeenCalledTimes(0);
        expect(mockParseFromString).toHaveBeenCalledWith(responseText);
        expect(beforeParseMock).toHaveBeenCalledWith(url);
        expect(afterParseMock).toHaveBeenCalledWith(url);
        expect(fetchMock).toHaveBeenCalledWith(url, expectedOptions);
        expect(doc).toEqual(mockExpectedDocument);
        expect(isStale).toEqual(false);
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

        const { doc, isStale } = await parser.load(url, data);

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
        expect(isStale).toEqual(false);
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

        const { doc, isStale } = await parser.load(url, data, 'post');

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
        expect(isStale).toEqual(false);
      });
    });
    // it.todo('parser warning', () => {});
    // it.todo('parser error', () => {});
    // it.todo('parser fatal error', () => {});
    // it.todo('server error', () => {});
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
