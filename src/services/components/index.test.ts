/* eslint-disable max-classes-per-file */
import * as Components from 'hyperview/src/services/components';
import type { HvComponentProps } from 'hyperview/src/types';
import HvView from 'hyperview/src/elements/hv-view';
import { LOCAL_NAME } from 'hyperview/src/types';
import { PureComponent } from 'react';
import { getElements } from 'hyperview/test/helpers';

class MockFormData {
  data: Array<{ name: string; value: string }>;

  constructor() {
    this.data = [];
  }

  append(name: string, value: string) {
    this.data.push({ name, value });
  }

  getParts() {
    return this.data;
  }
}

describe('Registry', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.FormData = MockFormData as any;

  class Foo extends PureComponent<HvComponentProps> {
    static namespaceURI = 'http://foo';

    static localName = LOCAL_NAME.IMAGE;

    static getFormInputValues() {
      return [['a', 'b']];
    }
  }
  // eslint-disable-next-line react/no-multi-comp
  class Bar extends PureComponent<HvComponentProps> {
    static namespaceURI = 'http://bar';

    static localName = LOCAL_NAME.IMAGE;
  }
  // eslint-disable-next-line react/no-multi-comp
  class Baz extends PureComponent<HvComponentProps> {
    static namespaceURI = 'http://baz';

    static localName = LOCAL_NAME.IMAGE;

    static localNameAliases = ['baz-1', 'baz-2'];

    static getFormInputValues() {
      return [['c', 'd']];
    }
  }
  const registry = new Components.Registry([Foo, Bar, Baz]);

  describe('hasComponent', () => {
    it('returns true for existing component using local name', () => {
      expect(registry.hasComponent('http://foo', 'image')).toBe(true);
    });

    it('returns true for custom component using local name', () => {
      expect(
        registry.hasComponent('https://hyperview.org/hyperview', 'body'),
      ).toBe(true);
    });

    it('returns true for custom component using alias', () => {
      expect(registry.hasComponent('http://baz', 'baz-2')).toBe(true);
    });

    it('returns false for non-existing component', () => {
      expect(
        registry.hasComponent('https://hyperview.org/hyperview', 'foo'),
      ).toBe(false);
    });

    it('returns false for existing component with matching local name but different namespace', () => {
      expect(registry.hasComponent('https://foo.org/hyperview', 'body')).toBe(
        false,
      );
    });

    it('returns false for custom component with matching local name but different namespace', () => {
      expect(
        registry.hasComponent('https://hyperview.org/hyperview', 'baz'),
      ).toBe(false);
    });
  });

  describe('getComponent', () => {
    it('returns existing component using local name', () => {
      expect(
        registry.getComponent('https://hyperview.org/hyperview', 'body'),
      ).toBe(HvView);
    });

    it('returns custom component using local name', () => {
      expect(registry.getComponent('http://foo', 'image')).toBe(Foo);
    });

    it('returns custom component using alias', () => {
      expect(registry.getComponent('http://baz', 'baz-1')).toBe(Baz);
    });

    it('returns undefined non-existing component', () => {
      expect(
        registry.getComponent('https://hyperview.org/hyperview', 'foo'),
      ).toBe(undefined);
    });

    it('returns undefined for component with matching local name but different namespace', () => {
      expect(registry.getComponent('https://foo.org/hyperview', 'body')).toBe(
        undefined,
      );
    });
  });

  describe('getFormData', () => {
    const xml = `
      <doc xmlns="https://hyperview.org/hyperview">
        <screen>
          <body>
            <form>
              <text-field name="input1" value="hello world" />
              <picker-field name="input2" value="choice1" />
              <foo:image xmlns:foo="http://foo" />
            </form>
            <form>
              <text-field name="input3" value="hello world" />
              <picker-field name="input3" value="choice1" />
              <baz:baz-2 xmlns:baz="http://baz" />
            </form>
            <text-field name="input4" value="hello world" />
            <form>
            </form>
          </body>
        </screen>
      </doc>
    `;
    describe('with form element', () => {
      let elements: Element[];
      beforeAll(() => {
        elements = getElements(xml, LOCAL_NAME.FORM);
      });

      it('returns form data', () => {
        const formData = registry.getFormData(
          elements[0],
        ) as MockFormData | null;
        expect(formData?.getParts()).toEqual(
          expect.arrayContaining([
            { name: 'input1', value: 'hello world' },
            { name: 'input2', value: 'choice1' },
            { name: 'a', value: 'b' },
          ]),
        );
      });

      it('returns form data with two values for same name', () => {
        const formData = registry.getFormData(
          elements[1],
        ) as MockFormData | null;
        expect(formData?.getParts()).toEqual(
          expect.arrayContaining([
            { name: 'input3', value: 'hello world' },
            { name: 'input3', value: 'choice1' },
            { name: 'c', value: 'd' },
          ]),
        );
      });

      it('returns null if form present, but no data in form', () => {
        const formData = registry.getFormData(
          elements[2],
        ) as MockFormData | null;
        expect(formData).toBe(null);
      });
    });

    describe('with other element', () => {
      let elements: Element[];
      beforeAll(() => {
        elements = getElements(xml, LOCAL_NAME.TEXT_FIELD);
      });

      it('returns form data', () => {
        const formData = registry.getFormData(
          elements[0],
        ) as MockFormData | null;
        expect(formData?.getParts()).toEqual(
          expect.arrayContaining([
            { name: 'input1', value: 'hello world' },
            { name: 'input2', value: 'choice1' },
          ]),
        );
      });

      it('returns form data with two values for same name', () => {
        const formData = registry.getFormData(
          elements[1],
        ) as MockFormData | null;
        expect(formData?.getParts()).toEqual(
          expect.arrayContaining([
            { name: 'input3', value: 'hello world' },
            { name: 'input3', value: 'choice1' },
          ]),
        );
      });

      it('returns null if element has no form parent', () => {
        const formData = registry.getFormData(
          elements[2],
        ) as MockFormData | null;
        expect(formData).toBe(null);
      });
    });
  });
});
