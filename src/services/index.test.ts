/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Components from 'hyperview/src/services/components';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import {
  createProps,
  createTestProps,
  encodeXml,
  flattenRegistry,
} from 'hyperview/src/services';
import { DOMParser } from 'xmldom-instawork';
import HvDateField from 'hyperview/src/components/hv-date-field';
import HvPickerField from 'hyperview/src/components/hv-picker-field';
import HvSelectMultiple from 'hyperview/src/components/hv-select-multiple';
import HvSelectSingle from 'hyperview/src/components/hv-select-single';
import HvSwitch from 'hyperview/src/components/hv-switch';
import HvTextField from 'hyperview/src/components/hv-text-field';

const parser = new DOMParser();
const createElement = (id?: string | null) => {
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

const mockPlatform = OS: any => {
  jest.resetModules();
  jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
    OS,
    select: objs: any => objs[OS],
  }));
};

describe('createTestProps', () => {
  describe('valid cases', () => {
    let testProps: any;
    beforeEach(() => {
      testProps = createTestProps(createElement('myID'));
    });
    describe('Android', () => {
      beforeAll(() => mockPlatform('android'));
      it('does not set testID', () => {
        expect(testProps).not.toHaveProperty('testID');
      });

      it('sets accessibilityLabel from id attribute', () => {
        expect(testProps).toHaveProperty('accessibilityLabel', 'myID');
      });
    });

    describe('iOS', () => {
      beforeAll(() => mockPlatform('ios'));
      it('sets testID from id attribute', () => {
        expect(testProps).toHaveProperty('testID', 'myID');
      });

      it('does not set accessibilityLabel', () => {
        expect(testProps).not.toHaveProperty('accessibilityLabel');
      });
    });
  });

  it('returns empty object if no id attribute present', () => {
    expect(createTestProps(createElement(null))).toEqual({});
  });

  it('returns empty id attribute is empty', () => {
    expect(createTestProps(createElement(''))).toEqual({});
  });
});

describe('createProps', () => {
  const styleSheets = Stylesheets.createStylesheets(
    parser.parseFromString('<doc></doc>'),
  );
  let props: any;
  beforeEach(() => {
    props = createProps(createElement('myID'), styleSheets, {});
  });

  it('sets id from id attribute', () => {
    expect(props).toHaveProperty('id', 'myID');
  });
  describe('Android', () => {
    beforeAll(() => mockPlatform('android'));
    it('does not set testID', () => {
      expect(props).not.toHaveProperty('testID');
    });

    it('sets accessibilityLabel from id attribute', () => {
      expect(props).toHaveProperty('accessibilityLabel', 'myID');
    });
  });

  describe('iOS', () => {
    beforeAll(() => mockPlatform('ios'));
    it('sets testID from id attribute', () => {
      expect(props).toHaveProperty('testID', 'myID');
    });

    it('does not set accessibilityLabel', () => {
      expect(props).not.toHaveProperty('accessibilityLabel');
    });
  });
});

describe('flattenRegistry', () => {
  const registry = Components.getFormRegistry();
  it('returns flattened registy', () => {
    expect(flattenRegistry(registry)).toEqual([
      ['https://hyperview.org/hyperview', 'date-field', HvDateField],
      ['https://hyperview.org/hyperview', 'picker-field', HvPickerField],
      ['https://hyperview.org/hyperview', 'select-multiple', HvSelectMultiple],
      ['https://hyperview.org/hyperview', 'select-single', HvSelectSingle],
      ['https://hyperview.org/hyperview', 'switch', HvSwitch],
      ['https://hyperview.org/hyperview', 'text-field', HvTextField],
      ['https://hyperview.org/hyperview', 'text-area', HvTextField],
    ]);
  });
});
