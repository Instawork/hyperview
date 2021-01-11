// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Url from 'hyperview/src/services/url';

describe('getUrlFromHref', () => {
  it('returns href when href is a fully qualified url', () => {
    const href = 'http://foo/bar';
    const baseUrl = 'http://baz';
    expect(Url.getUrlFromHref(href, baseUrl)).toEqual(href);
  });
  it('composes url from href and baseUrl when href is not a fully qualified url', () => {
    const href = '/bar';
    const baseUrl = 'http://baz';
    expect(Url.getUrlFromHref(href, baseUrl)).toEqual('http://baz/bar');
  });
  it('preserves multiple query params', () => {
    const href = '/bar?a=1&a=2';
    const baseUrl = 'http://baz';
    expect(Url.getUrlFromHref(href, baseUrl)).toEqual('http://baz/bar?a=1&a=2');
  });
});

describe('addParamsToUrl', () => {
  it('adds params to an url without query string', () => {
    const url = 'http://foo/bar';
    const params = [
      { name: 'foo', value: 'bar' },
      { name: 'bar', value: 'baz' },
      { name: 'bar', value: 'abc' },
    ];
    expect(Url.addParamsToUrl(url, params)).toEqual(
      'http://foo/bar?foo=bar&bar=baz&bar=abc',
    );
  });
  it('adds params to an url with pre-existing query string', () => {
    const url = 'http://foo/bar?foo=abc';
    const params = [
      { name: 'foo', value: 'bar' },
      { name: 'bar', value: 'baz' },
    ];
    expect(Url.addParamsToUrl(url, params)).toEqual(
      'http://foo/bar?foo=abc&foo=bar&bar=baz',
    );
  });
});
