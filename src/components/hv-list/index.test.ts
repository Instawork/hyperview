/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getDummyHvProps, getElements } from 'hyperview/test/helpers';
import HvList from 'hyperview/src/components/hv-list';
import { LOCAL_NAME } from 'hyperview/src/types';

describe('HvList', () => {
  describe('getItems', () => {
    let items: Element[];
    describe('simple list', () => {
      beforeEach(() => {
        const elements = getElements(
          `
            <doc xmlns="https://hyperview.org/hyperview">
              <screen>
                <body>
                  <list>
                    <item id="foo"/>
                    <item id="bar"/>
                    <item id="baz"/>
                  </list>
                </body>
              </screen>
            </doc>
          `,
          LOCAL_NAME.LIST,
        );
        const list = new HvList({
          ...getDummyHvProps(),
          element: elements[0],
        });
        items = list.getItems();
      });
      it('returns expected items count', async () => {
        expect(items.length).toEqual(3);
      });
      it('returns expected items order', async () => {
        expect(items[0].getAttribute('id')).toEqual('foo');
        expect(items[1].getAttribute('id')).toEqual('bar');
        expect(items[2].getAttribute('id')).toEqual('baz');
      });
    });
    describe('nested lists', () => {
      let elements: Element[];
      beforeAll(() => {
        elements = getElements(
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <list>
                  <item id="foo">
                    <list>
                      <item id="foo-foo"/>
                      <item id="foo-bar"/>
                    </list>
                  </item>
                  <item id="bar"/>
                  <item id="baz"/>
                </list>
              </body>
            </screen>
          </doc>
        `,
          LOCAL_NAME.LIST,
        );
      });
      describe('list 1', () => {
        beforeAll(() => {
          const list = new HvList({
            ...getDummyHvProps(),
            element: elements[0],
          });
          items = list.getItems();
        });
        it('returns expected items count', async () => {
          expect(items.length).toEqual(3);
        });
        it('returns expected items order', async () => {
          expect(items[0].getAttribute('id')).toEqual('foo');
          expect(items[1].getAttribute('id')).toEqual('bar');
          expect(items[2].getAttribute('id')).toEqual('baz');
        });
      });

      describe('list 2', () => {
        beforeAll(() => {
          const list = new HvList({
            ...getDummyHvProps(),
            element: elements[1],
          });
          items = list.getItems();
        });
        it('returns expected items count', async () => {
          expect(items.length).toEqual(2);
        });
        it('returns expected items order', async () => {
          expect(items[0].getAttribute('id')).toEqual('foo-foo');
          expect(items[1].getAttribute('id')).toEqual('foo-bar');
        });
      });
    });
    describe('paginated lists', () => {
      let elements: Element[];
      beforeAll(() => {
        elements = getElements(
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <list>
                  <item id="foo"/>
                  <item id="bar"/>
                  <items>
                    <item id="1-foo"/>
                    <item id="1-bar"/>
                    <item id="1-baz"/>
                    <items>
                      <item id="2-foo"/>
                      <item id="2-bar"/>
                      <item id="2-baz"/>
                    </items>
                  </items>
                  <item id="baz"/>
                </list>
              </body>
            </screen>
          </doc>
        `,
          LOCAL_NAME.LIST,
        );
        const list = new HvList({
          ...getDummyHvProps(),
          element: elements[0],
        });
        items = list.getItems();
      });
      it('returns expected items count', async () => {
        expect(items.length).toEqual(9);
      });
      it('returns expected items order', async () => {
        expect(items[0].getAttribute('id')).toEqual('foo');
        expect(items[1].getAttribute('id')).toEqual('bar');
        expect(items[2].getAttribute('id')).toEqual('1-foo');
        expect(items[3].getAttribute('id')).toEqual('1-bar');
        expect(items[4].getAttribute('id')).toEqual('1-baz');
        expect(items[5].getAttribute('id')).toEqual('2-foo');
        expect(items[6].getAttribute('id')).toEqual('2-bar');
        expect(items[7].getAttribute('id')).toEqual('2-baz');
        expect(items[8].getAttribute('id')).toEqual('baz');
      });
    });
    describe('paginated and nested lists', () => {
      let elements: Element[];
      beforeAll(() => {
        elements = getElements(
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <list>
                  <item id="foo"/>
                  <item id="bar">
                    <list>
                      <item id="bar-foo"/>
                      <item id="bar-bar"/>
                      <items>
                        <item id="bar-1-foo"/>
                        <item id="bar-1-bar"/>
                        <item id="bar-1-baz"/>
                      </items>
                      <item id="bar-baz"/>
                    </list>
                  </item>
                  <items>
                    <item id="1-foo"/>
                    <item id="1-bar"/>
                    <item id="1-baz">
                      <list>
                        <item id="1-baz-foo"/>
                        <item id="1-baz-bar"/>
                        <items>
                          <item id="1-baz-1-foo"/>
                          <item id="1-baz-1-bar"/>
                        </items>
                        <item id="1-baz-baz"/>
                      </list>
                    </item>
                  </items>
                  <items>
                    <item id="2-foo"/>
                    <item id="2-bar"/>
                    <item id="2-baz"/>
                  </items>
                  <item id="baz"/>
                </list>
              </body>
            </screen>
          </doc>
        `,
          LOCAL_NAME.LIST,
        );
        const list = new HvList({
          ...getDummyHvProps(),
          element: elements[0],
        });
        items = list.getItems();
      });
      describe('list 1', () => {
        beforeAll(() => {
          const list = new HvList({
            ...getDummyHvProps(),
            element: elements[0],
          });
          items = list.getItems();
        });
        it('returns expected items count', async () => {
          expect(items.length).toEqual(9);
        });
        it('returns expected items order', async () => {
          expect(items[0].getAttribute('id')).toEqual('foo');
          expect(items[1].getAttribute('id')).toEqual('bar');
          expect(items[2].getAttribute('id')).toEqual('1-foo');
          expect(items[3].getAttribute('id')).toEqual('1-bar');
          expect(items[4].getAttribute('id')).toEqual('1-baz');
          expect(items[5].getAttribute('id')).toEqual('2-foo');
          expect(items[6].getAttribute('id')).toEqual('2-bar');
          expect(items[7].getAttribute('id')).toEqual('2-baz');
          expect(items[8].getAttribute('id')).toEqual('baz');
        });
      });
      describe('list 2', () => {
        beforeAll(() => {
          const list = new HvList({
            ...getDummyHvProps(),
            element: elements[1],
          });
          items = list.getItems();
        });
        it('returns expected items count', async () => {
          expect(items.length).toEqual(6);
        });
        it('returns expected items order', async () => {
          expect(items[0].getAttribute('id')).toEqual('bar-foo');
          expect(items[1].getAttribute('id')).toEqual('bar-bar');
          expect(items[2].getAttribute('id')).toEqual('bar-1-foo');
          expect(items[3].getAttribute('id')).toEqual('bar-1-bar');
          expect(items[4].getAttribute('id')).toEqual('bar-1-baz');
          expect(items[5].getAttribute('id')).toEqual('bar-baz');
        });
      });
      describe('list 3', () => {
        beforeAll(() => {
          const list = new HvList({
            ...getDummyHvProps(),
            element: elements[2],
          });
          items = list.getItems();
        });
        it('returns expected items count', async () => {
          expect(items.length).toEqual(5);
        });
        it('returns expected items order', async () => {
          expect(items[0].getAttribute('id')).toEqual('1-baz-foo');
          expect(items[1].getAttribute('id')).toEqual('1-baz-bar');
          expect(items[2].getAttribute('id')).toEqual('1-baz-1-foo');
          expect(items[3].getAttribute('id')).toEqual('1-baz-1-bar');
          expect(items[4].getAttribute('id')).toEqual('1-baz-baz');
        });
      });
    });
  });
});
