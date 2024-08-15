import { DOMParser } from '@instawork/xmldom';
import { findElements } from 'core-mobile/src/components/hyperview-filter';

const getElement = (xml: string): Element => {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  return doc.documentElement;
};

describe('findElements', () => {
  it('finds no items', () => {
    const xml = `
      <list xmlns:filter="https://instawork.com/hyperview-filter">
      </list>
    `;
    const elements = findElements(getElement(xml), ['terms']);
    expect(elements).toHaveLength(0);
  });
  it('finds multiple items', () => {
    const xml = `
      <list xmlns:filter="https://instawork.com/hyperview-filter">
        <item key="1" filter:terms="a" />
        <item key="2" filter:terms="b" />
      </list>
    `;
    const elements = findElements(getElement(xml), ['terms']);
    expect(elements).toHaveLength(2);
    expect(elements[0].getAttribute('key')).toEqual('1');
    expect(elements[1].getAttribute('key')).toEqual('2');
  });
  it('ignores items without terms', () => {
    const xml = `
      <list xmlns:filter="https://instawork.com/hyperview-filter">
        <item key="1" filter:terms="a" />
        <item key="2" />
        <item key="3" />
        <item key="4" filter:terms="a" />
      </list>
    `;
    const elements = findElements(getElement(xml), ['terms']);
    expect(elements).toHaveLength(2);
    expect(elements[0].getAttribute('key')).toEqual('1');
    expect(elements[1].getAttribute('key')).toEqual('4');
  });
  it('ignores items with wrong terms namespace', () => {
    const xml = `
      <list xmlns:filter="https://instawork.com/hyperview-filter">
        <item key="1" terms="a" />
        <item key="4" other:terms="a" />
      </list>
    `;
    const elements = findElements(getElement(xml), ['terms']);
    expect(elements).toHaveLength(0);
  });
  it('handles nested elements with terms', () => {
    const xml = `
      <list xmlns:filter="https://instawork.com/hyperview-filter">
        <item key="1">
          <view filter:terms="a"></view>
        </item>
        <item key="2">
          <view>
            <text filter:terms="b"></text>
          </view>
        </item>
      </list>
    `;
    const elements = findElements(getElement(xml), ['terms']);
    expect(elements).toHaveLength(2);
    expect(elements[0].getAttributeNS('https://instawork.com/hyperview-filter', 'terms')).toEqual(
      'a',
    );
    expect(elements[1].getAttributeNS('https://instawork.com/hyperview-filter', 'terms')).toEqual(
      'b',
    );
  });
});
