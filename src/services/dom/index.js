// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as UrlService from 'hyperview/src/services/url';
import type { BeforeAfterParseHandler, Fetch, HttpMethod } from './types';
import { CONTENT_TYPE, HTTP_HEADERS, HTTP_METHODS } from './types';
import { ParserError, ParserFatalError, ParserWarning } from './errors';
import { DOMParser } from 'xmldom-instawork';
import { Dimensions } from 'react-native';
import type { Document } from 'hyperview/src/types';
import { version } from 'hyperview/package.json';
const xmllint = require('xmllint');

const { width, height } = Dimensions.get('window');
const headers = {
  [HTTP_HEADERS.ACCEPT]: CONTENT_TYPE.APPLICATION_XML,
  [HTTP_HEADERS.X_HYPERVIEW_VERSION]: version,
  [HTTP_HEADERS.X_HYPERVIEW_DIMENSIONS]: `${width}w ${height}h`,
};

const parser = new DOMParser({
  locator: {},
  errorHandler: {
    error: (error: string) => {
      throw new ParserError(error);
    },
    fatalError: (error: string) => {
      throw new ParserFatalError(error);
    },
    warning: (error: string) => {
      throw new ParserWarning(error);
    },
  },
});

function test_validate() {
  const xsd =
    '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="comment"><xs:complexType><xs:all><xs:element name="author" type="xs:string"/><xs:element name="content" type="xs:string"/></xs:all></xs:complexType></xs:element></xs:schema>';
  const xml_valid =
    '<?xml version="1.0"?><comment><author>author</author><content>nothing</content></comment>';
  const xml_invalid = '<?xml version="1.0"?><comment>A comment</comment>';

  const valid_result = xmllint.validateXML({ xml: xml_valid, schema: xsd });
  const invalid_result = xmllint.validateXML({ xml: xml_invalid, schema: xsd });

  console.log('\nINVALID DOC', invalid_result);
}

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
    method: ?HttpMethod = HTTP_METHODS.GET,
  ): Promise<Document> => {
    // For GET requests, we can't include a body so we encode the form data as a query
    // string in the URL.
    const url =
      method === HTTP_METHODS.GET && data
        ? UrlService.addFormDataToUrl(baseUrl, data)
        : baseUrl;

    const options = {
      // For non-GET requests, include the formdata as the body of the request.
      body: method === HTTP_METHODS.GET ? undefined : data,
      headers,
      method,
    };

    const response: Response = await this.fetch(url, options);
    const responseText: string = await response.text();

    test_validate();

    if (this.onBeforeParse) {
      this.onBeforeParse(url);
    }
    const document = parser.parseFromString(responseText);
    if (this.onAfterParse) {
      this.onAfterParse(url);
    }
    return document;
  };
}
