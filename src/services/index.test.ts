import * as Stylesheets from 'hyperview/src/services/stylesheets';
import {
  createCollapsableProps,
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

describe('createCollapsableProps', () => {
  const makeEl = (attrs: Record<string, string> = {}) => {
    const doc = parser.parseFromString('<doc></doc>');
    const el = doc.createElement('el');
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };

  it('returns empty object when neither attribute is present', () => {
    expect(createCollapsableProps(makeEl())).toEqual({});
  });

  it('maps collapsable="true" to collapsable: true', () => {
    expect(createCollapsableProps(makeEl({ collapsable: 'true' }))).toEqual({
      collapsable: true,
    });
  });

  it('maps collapsable="false" to collapsable: false', () => {
    expect(createCollapsableProps(makeEl({ collapsable: 'false' }))).toEqual({
      collapsable: false,
    });
  });

  it('maps collapsable-children="true" to collapsableChildren: true', () => {
    expect(
      createCollapsableProps(makeEl({ 'collapsable-children': 'true' })),
    ).toEqual({ collapsableChildren: true });
  });

  it('maps collapsable-children="false" to collapsableChildren: false', () => {
    expect(
      createCollapsableProps(makeEl({ 'collapsable-children': 'false' })),
    ).toEqual({ collapsableChildren: false });
  });

  it('handles both attributes together', () => {
    expect(
      createCollapsableProps(
        makeEl({ collapsable: 'false', 'collapsable-children': 'true' }),
      ),
    ).toEqual({ collapsable: false, collapsableChildren: true });
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

  describe('collapsable attributes', () => {
    const styleSheets2 = Stylesheets.createStylesheets(
      parser.parseFromString('<doc></doc>'),
    );
    const makeEl = (attrs: Record<string, string>) => {
      const doc = parser.parseFromString('<doc></doc>');
      const el = doc.createElement('el');
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      return el;
    };

    it('emits collapsable: false when collapsable="false"', () => {
      const result = createProps(
        makeEl({ collapsable: 'false' }),
        styleSheets2,
        {},
      );
      expect(result).toHaveProperty('collapsable', false);
    });

    it('does not emit a stray collapsable-children string prop', () => {
      const result = createProps(
        makeEl({ 'collapsable-children': 'false' }),
        styleSheets2,
        {},
      );
      expect(result).not.toHaveProperty('collapsable-children');
    });

    it('emits collapsableChildren: true when collapsable-children="true"', () => {
      const result = createProps(
        makeEl({ 'collapsable-children': 'true' }),
        styleSheets2,
        {},
      );
      expect(result).toHaveProperty('collapsableChildren', true);
    });
  });
});
