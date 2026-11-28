import * as Components from 'hyperview/src/services/components';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import { DOMParser } from '@instawork/xmldom';
import type { HvComponentProps } from 'hyperview/src/types';
import { PureComponent } from 'react';

class CustomComponent extends PureComponent<HvComponentProps> {
  static namespaceURI = 'https://example.com/custom';

  static localName = 'component';
}

const componentRegistry = new Components.Registry([CustomComponent]);
const document = new DOMParser().parseFromString(`
  <body
    xmlns="${Namespaces.HYPERVIEW}"
    xmlns:custom="${CustomComponent.namespaceURI}"
  >
    <text native-hide="true" />
    <text-field native-hide="true" />
    <view native-hide="true" />
    <image native-hide="true" />
    <custom:component native-hide="true" />
    <view id="content" />
  </body>
`);
const hiddenElements = Array.from(document.getElementsByTagName('*')).filter(
  element => element.getAttribute('native-hide') === 'true',
);
const content = document.getElementById('content') as Element;

describe('isRenderableElement', () => {
  test.each(hiddenElements)(
    'does not render a native-hidden element when the native header is active',
    element => {
      expect(
        Render.isRenderableElement(
          element,
          { componentRegistry, nativeHeaderActive: true },
          undefined,
        ),
      ).toBe(false);
    },
  );

  test.each(hiddenElements)(
    'renders a native-hidden element when the native header is inactive',
    element => {
      expect(
        Render.isRenderableElement(
          element,
          { componentRegistry, nativeHeaderActive: false },
          undefined,
        ),
      ).toBe(true);
    },
  );

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
