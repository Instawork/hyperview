import { DOMParser } from '@instawork/xmldom';
import HyperRef from 'hyperview/src/components/hyper-ref';
import type { StyleSheets } from 'hyperview/src/types';
import { shallowCloneToRoot } from 'hyperview/src/services';

describe('HyperRef', () => {
  describe('onEventDispatch', () => {
    const stylesheets: StyleSheets = {
      focused: {},
      pressed: {},
      pressedSelected: {},
      regular: {},
      selected: {},
    };

    /**
     * Creates a doc with an `on-event` listener on a container element, next to a
     * field a behavior can set a value on.
     */
    const createContainer = (): Element => {
      const doc = new DOMParser().parseFromString(
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view id="container">
                  <text-field id="field" name="field" hide="true" />
                  <behavior
                    action="show"
                    trigger="on-event"
                    event-name="test-event"
                    target="target-view"
                  />
                </view>
              </body>
            </screen>
          </doc>
        `,
        'text/xml',
      );
      const [container] = Array.from(doc.getElementsByTagName('view'));
      return container;
    };

    const createHyperRef = (element: Element, onUpdate: jest.Mock) =>
      new HyperRef({ element, onUpdate, options: {}, stylesheets });

    test('triggers matching behaviors', () => {
      const onUpdate = jest.fn();
      const hyperRef = createHyperRef(createContainer(), onUpdate);

      hyperRef.onEventDispatch('test-event');

      expect(onUpdate).toHaveBeenCalledTimes(1);
    });

    test('does not trigger behaviors for other events', () => {
      const onUpdate = jest.fn();
      const hyperRef = createHyperRef(createContainer(), onUpdate);

      hyperRef.onEventDispatch('other-event');

      expect(onUpdate).not.toHaveBeenCalled();
    });

    /**
     * Updating the DOM shallow-clones every ancestor of the mutated node, which
     * moves the children onto the clone and orphans the original. Between the
     * update and the re-render, the listener holds the orphaned element, which no
     * longer has any behavior children.
     */
    test('triggers matching behaviors when the element was orphaned by a DOM update', () => {
      const onUpdate = jest.fn();
      const container = createContainer();
      const hyperRef = createHyperRef(container, onUpdate);
      const [field] = Array.from(container.getElementsByTagName('text-field'));

      shallowCloneToRoot(field);
      expect(container.parentNode).toBeNull();
      expect(container.firstChild).toBeNull();

      hyperRef.onEventDispatch('test-event');

      expect(onUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
