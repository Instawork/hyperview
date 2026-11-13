import * as Components from 'hyperview/src/services/components';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import { DOMParser } from '@instawork/xmldom';

const componentRegistry = new Components.Registry();
const document = new DOMParser().parseFromString(`
  <body xmlns="${Namespaces.HYPERVIEW}" xmlns:navigation="${Namespaces.HYPERVIEW_NAVIGATION}">
    <view>
      <item navigation:role="title" />
      <item />
    </view>
  </body>
`);
const [title, content] = Array.from(
  document.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'item'),
);

describe('isRenderableElement', () => {
  test('does not render a nested title when the native header is active', () => {
    expect(
      Render.isRenderableElement(
        title,
        { componentRegistry, nativeHeaderActive: true },
        undefined,
      ),
    ).toBe(false);
  });

  test('renders a nested title when the native header is inactive', () => {
    expect(
      Render.isRenderableElement(
        title,
        { componentRegistry, nativeHeaderActive: false },
        undefined,
      ),
    ).toBe(true);
  });

  test('renders an unmarked element when the native header is active', () => {
    expect(
      Render.isRenderableElement(
        content,
        { componentRegistry, nativeHeaderActive: true },
        undefined,
      ),
    ).toBe(true);
  });
});
