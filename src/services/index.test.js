// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createProps, createTestProps, encodeXml } from '.';
import { DOMParser } from 'xmldom-instawork';
import { createStylesheets } from 'hyperview/src/services/stylesheets';

const parser = new DOMParser();
const createElement = (id: ?string) => {
  const doc = parser.parseFromString('<doc></doc>');
  const el = doc.createElement('<el>');
  if (id) {
    el.setAttribute('id', id);
  }
  return el;
};

describe('encodeXml', () => {
  it('encodes XML entities in an XML string', () => {
    expect(
      encodeXml(
        `<behavior href="https://hyperview.org/foo=bar&bar=baz" action='new' />`,
      ),
    ).toEqual(
      '&lt;behavior href=&quot;https://hyperview.org/foo=bar&amp;bar=baz&quot; action=&apos;new&apos; /&gt;',
    );
  });
});

describe('createTestProps', () => {
  it('sets testID from id attribute', () => {
    expect(createTestProps(createElement('myID'))).toHaveProperty(
      'testID',
      'myID',
    );
  });

  it('sets accessibilityLabel from id attribute', () => {
    expect(createTestProps(createElement('myID'))).toHaveProperty(
      'accessibilityLabel',
      'myID',
    );
  });

  it('returns empty object if no id attribute present', () => {
    expect(createTestProps(createElement(null))).toEqual({});
  });

  it('returns empty id attribute is empty', () => {
    expect(createTestProps(createElement(''))).toEqual({});
  });
});

describe('createProps', () => {
  const styleSheets = createStylesheets(parser.parseFromString('<doc></doc>'));

  it('sets id from id attribute', () => {
    expect(createProps(createElement('myID'), styleSheets, {})).toHaveProperty(
      'id',
      'myID',
    );
  });

  it('sets testID from id attribute', () => {
    expect(createProps(createElement('myID'), styleSheets, {})).toHaveProperty(
      'testID',
      'myID',
    );
  });

  it('sets accessibilityLabel from id attribute', () => {
    expect(createProps(createElement('myID'), styleSheets, {})).toHaveProperty(
      'accessibilityLabel',
      'myID',
    );
  });
});
