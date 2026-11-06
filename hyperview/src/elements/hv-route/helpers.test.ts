import type { ListenerEvent, NavigationProps } from 'hyperview/src/types';
import {
  getNestedNavigator,
  getVisibleBackBehaviors,
  registerRouteFocusListener,
} from './helpers';
import { DOMParser } from '@instawork/xmldom';

const parser = new DOMParser();

describe('getNestedNavigator', () => {
  it('returns the nested navigator for a route', () => {
    const doc = parser.parseFromString(`
      <doc xmlns="https://hyperview.org/hyperview">
        <navigator id="root" type="stack">
          <nav-route id="route">
            <navigator id="nested" type="stack" />
          </nav-route>
        </navigator>
      </doc>
    `);

    expect(getNestedNavigator('route', doc)?.getAttribute('id')).toBe('nested');
  });

  it('returns undefined without a matching route', () => {
    const doc = parser.parseFromString(
      '<doc xmlns="https://hyperview.org/hyperview" />',
    );

    expect(getNestedNavigator(undefined, doc)).toBeUndefined();
    expect(getNestedNavigator('route', undefined)).toBeUndefined();
    expect(getNestedNavigator('route', doc)).toBeUndefined();
  });
});

describe('getVisibleBackBehaviors', () => {
  it('excludes behaviors hidden directly or by an ancestor', () => {
    const doc = parser.parseFromString(`
      <doc xmlns="https://hyperview.org/hyperview">
        <screen>
          <body>
            <behavior id="visible" />
            <behavior id="hidden" hide="true" />
            <view hide="true">
              <behavior id="hidden-by-parent" />
            </view>
          </body>
        </screen>
      </doc>
    `);
    const behaviors = Array.from(doc.getElementsByTagName('behavior'));

    expect(
      getVisibleBackBehaviors(behaviors).map(element =>
        element.getAttribute('id'),
      ),
    ).toEqual(['visible']);
  });
});

describe('registerRouteFocusListener', () => {
  it('notifies route focus after the transition completes', () => {
    let listener: ((event: ListenerEvent) => void) | undefined;
    const removeListener = jest.fn();
    const navigation = ({
      addListener: jest.fn(
        (_eventName: string, callback: (event: ListenerEvent) => void) => {
          listener = callback;
          return removeListener;
        },
      ),
      isFocused: jest.fn(() => true),
    } as unknown) as NavigationProps;
    const onFocus = jest.fn();

    const unsubscribe = registerRouteFocusListener(navigation, onFocus);
    listener?.({
      data: undefined,
      preventDefault: jest.fn(),
    });

    expect(navigation.addListener).toHaveBeenCalledWith(
      'transitionEnd',
      expect.any(Function),
    );
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(removeListener).toHaveBeenCalledTimes(1);
    expect(unsubscribe).toBe(removeListener);
  });

  it('ignores closing and unfocused transitions', () => {
    let listener: ((event: ListenerEvent) => void) | undefined;
    const removeListener = jest.fn();
    const navigation = ({
      addListener: jest.fn(
        (_eventName: string, callback: (event: ListenerEvent) => void) => {
          listener = callback;
          return removeListener;
        },
      ),
      isFocused: jest.fn(() => true),
    } as unknown) as NavigationProps;
    const onFocus = jest.fn();

    registerRouteFocusListener(navigation, onFocus);

    listener?.({
      data: { closing: true },
      preventDefault: jest.fn(),
    });
    expect(onFocus).not.toHaveBeenCalled();

    navigation.isFocused = jest.fn(() => false);
    listener?.({
      data: { closing: false },
      preventDefault: jest.fn(),
    });
    expect(onFocus).not.toHaveBeenCalled();

    navigation.isFocused = jest.fn(() => true);
    listener?.({
      data: { closing: false },
      preventDefault: jest.fn(),
    });
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(removeListener).toHaveBeenCalledTimes(1);
  });
});
