import { findTagEndIndex, preorder, trimAndCleanString } from './helpers';
import { NODE_TYPE } from 'hyperview/src/types';
import { parse } from 'hyperview/test/helpers';

describe('preorder', () => {
  test('1', () => {
    const node: Document = parse(
      `<text id="a">
          <text id="b">
            <text id="c">   </text>
            <text id="d">   </text>
            <text id="e">
              Hello
            </text>
            <text id="f">
              World
            </text>
          </text>
          <text id="g">
            of HyperView!
          </text>
          <text id="h"> </text>
        </text>`,
    );
    expect(preorder(node, NODE_TYPE.TEXT_NODE)).toEqual([
      node.getElementById('a')?.firstChild, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('b')?.firstChild, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('c')?.firstChild, // ◦◦◦
      node.getElementById('c')?.nextSibling, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('d')?.firstChild, // ◦◦◦
      node.getElementById('d')?.nextSibling, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('e')?.firstChild, // Hello
      node.getElementById('e')?.nextSibling, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('f')?.firstChild, // World
      node.getElementById('f')?.nextSibling, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('g')?.previousSibling, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('g')?.firstChild, // of Hyperview!
      node.getElementById('g')?.nextSibling, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('h')?.firstChild, // ◦
      node.getElementById('a')?.lastChild, // ⏎◦◦◦◦◦◦◦◦◦◦
    ]);
  });

  describe('findTagEndIndex', () => {
    const xml =
      '<doc>\n  <screen id="home">\n    <body>\n      <view/>\n    </body>\n  </screen>\n</doc>';

    it('finds end index of opening tag', () => {
      const docEnd = xml.indexOf('>');
      const screenStart = xml.indexOf('<screen');
      const screenEnd = xml.indexOf('>', screenStart);
      const bodyStart = xml.indexOf('<body');
      const bodyEnd = xml.indexOf('>', bodyStart);
      expect(findTagEndIndex(xml, 'doc')).toBe(docEnd);
      expect(findTagEndIndex(xml, 'screen')).toBe(screenEnd);
      expect(findTagEndIndex(xml, 'body')).toBe(bodyEnd);
    });

    it('is case-insensitive and handles self-closing', () => {
      const xml2 = '<DOC><SCREEN/><BoDy></BoDy></DOC>';
      const docEnd2 = xml2.indexOf('>');
      const screenStart2 = xml2.indexOf('<SCREEN');
      const screenEnd2 = xml2.indexOf('>', screenStart2);
      const bodyStart2 = xml2.indexOf('<BoDy');
      const bodyEnd2 = xml2.indexOf('>', bodyStart2);
      expect(findTagEndIndex(xml2, 'doc')).toBe(docEnd2);
      expect(findTagEndIndex(xml2, 'screen')).toBe(screenEnd2);
      expect(findTagEndIndex(xml2, 'body')).toBe(bodyEnd2);
    });

    it('can return end index of opening tag', () => {
      const screenStart = xml.indexOf('<screen');
      const screenEnd = xml.indexOf('>', screenStart);
      expect(findTagEndIndex(xml, 'screen', 0)).toBe(screenEnd);

      const xml2 = '<DOC><SCREEN/><BoDy></BoDy></DOC>';
      const screenStart2 = xml2.indexOf('<SCREEN');
      const screenEnd2 = xml2.indexOf('>', screenStart2);
      expect(findTagEndIndex(xml2, 'screen', 0)).toBe(screenEnd2);
    });

    it('returns fallback when not found', () => {
      expect(findTagEndIndex(xml, 'navigator', 10)).toBe(10);
    });
  });
});

describe('helpers', () => {
  describe('trimAndCleanString', () => {
    it('collapses whitespace and respects start/length bounds', () => {
      const text = 'AAA\n\n   BBB\t\tCCC    DDD';
      const start = 0;
      const length = 100;
      const result = trimAndCleanString(text, start, length);
      expect(result).toBe('AAA BBB CCC DDD');
    });

    it('clamps start below 0 and slices correctly before collapsing', () => {
      const text = 'XX  YY\nZZ';
      // Ask for a window that starts before 0 and extends beyond the end
      const result = trimAndCleanString(text, -10, 999);
      // Collapsed expected
      expect(result).toBe('XX YY ZZ');
    });
  });
});
