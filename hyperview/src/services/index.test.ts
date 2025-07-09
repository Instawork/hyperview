import * as Stylesheets from 'hyperview/src/services/stylesheets';
import {
  createProps,
  createTestProps,
  encodeXml,
} from 'hyperview/src/services';
import { DOMParser } from '@instawork/xmldom';

const parser = new DOMParser();
const createElement = (id: string | null) => {
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
        // eslint-disable-next-line quotes
        `<behavior href="https://hyperview.org/foo=bar&bar=baz" action='new' />`,
      ),
    ).toEqual(
      '&lt;behavior href=&quot;https://hyperview.org/foo=bar&amp;bar=baz&quot; action=&apos;new&apos; /&gt;',
    );
  });
});

const mockPlatform = (OS: 'android' | 'ios' | 'web') => {
  jest.resetModules();
  jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
    OS,
    select: (objs: { android?: unknown; ios?: unknown; web?: unknown }) =>
      objs[OS],
  }));
};

describe('createTestProps', () => {
  describe('valid cases', () => {
    let testProps: {
      testID?: string;
      accessibilityLabel?: string;
    };
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
  let props: {
    testID?: string;
    accessibilityLabel?: string;
  };
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
