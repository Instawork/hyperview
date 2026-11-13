import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Events from 'hyperview/src/services/events';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { DOMParser } from '@instawork/xmldom';
import { Context as HvDocContext } from 'hyperview/src/elements/hv-doc/context';
import HvNavigator from './index';
import { HyperviewContext } from 'hyperview/src/contexts/hyperview';
import React from 'react';
import { render } from '@testing-library/react-native';

const parser = new DOMParser();

const createNavigatorElement = (id: string): Element => {
  const doc = parser.parseFromString(`
    <doc xmlns="https://hyperview.org/hyperview">
      <navigator id="${id}" type="stack">
        <behavior
          action="dispatch-event"
          event-name="${id}-loaded"
          trigger="load"
        />
        <nav-route id="${id}-route" href="https://example.com/${id}" />
      </navigator>
    </doc>
  `);

  return doc.getElementsByTagNameNS(
    'https://hyperview.org/hyperview',
    'navigator',
  )[0];
};

const createNavigatorElementWithBehaviors = (
  id: string,
  behaviors: string,
): Element => {
  const doc = parser.parseFromString(`
    <doc xmlns="https://hyperview.org/hyperview">
      <navigator id="${id}" type="stack">
        ${behaviors}
        <nav-route id="${id}-route" href="https://example.com/${id}" />
      </navigator>
    </doc>
  `);

  return doc.getElementsByTagNameNS(
    'https://hyperview.org/hyperview',
    'navigator',
  )[0];
};

const RouteComponent = () => null;

describe('HvNavigator load behaviors', () => {
  const triggerBehaviors = jest.spyOn(Behaviors, 'triggerBehaviors');
  const hyperviewContextValue = ({
    navigationComponents: {},
  } as unknown) as React.ContextType<typeof HyperviewContext>;
  const hvDocContextValue = ({
    getSourceDoc: () => undefined,
  } as unknown) as React.ContextType<typeof HvDocContext>;

  const buildTree = (element: Element, onUpdate: jest.Mock = jest.fn()) => (
    <NavigationContainer>
      <HyperviewContext.Provider value={hyperviewContextValue}>
        <HvDocContext.Provider value={hvDocContextValue}>
          <HvNavigator
            element={element}
            onUpdate={onUpdate}
            routeComponent={RouteComponent}
          />
        </HvDocContext.Provider>
      </HyperviewContext.Provider>
    </NavigationContainer>
  );

  const renderNavigator = (element: Element, onUpdate?: jest.Mock) =>
    render(buildTree(element, onUpdate));

  beforeEach(() => {
    triggerBehaviors.mockReset();
  });

  test('triggers once when mounted', async () => {
    await renderNavigator(createNavigatorElement('initial'));

    expect(triggerBehaviors).toHaveBeenCalledTimes(1);
  });

  test('does not retrigger when onUpdate changes for the same element', async () => {
    const element = createNavigatorElement('same');
    const { rerender } = await renderNavigator(element);

    await rerender(buildTree(element, jest.fn()));

    expect(triggerBehaviors).toHaveBeenCalledTimes(1);
  });

  test('triggers once for each replacement element', async () => {
    const { rerender } = await renderNavigator(createNavigatorElement('first'));
    const replacement = createNavigatorElement('replacement');

    await rerender(buildTree(replacement));

    expect(triggerBehaviors).toHaveBeenCalledTimes(2);
    expect(triggerBehaviors).toHaveBeenLastCalledWith(
      replacement,
      expect.any(Array),
      expect.any(Function),
    );
  });

  test('triggers once when remounted with the same element', async () => {
    const element = createNavigatorElement('remount');
    const firstRender = await renderNavigator(element);

    await firstRender.unmount();
    await renderNavigator(element);

    expect(triggerBehaviors).toHaveBeenCalledTimes(2);
  });

  test('subscribes to completion events before triggering load behaviors', async () => {
    const element = createNavigatorElementWithBehaviors(
      'synchronous-completion',
      `
        <behavior
          trigger="load"
          action="dispatch-event"
          event-name="load-complete"
        />
        <behavior
          trigger="on-event"
          event-name="load-complete"
          action="deep-link"
          href="https://example.com/completed"
        />
      `,
    );
    const onUpdate = jest.fn();
    triggerBehaviors.mockImplementationOnce(() => {
      Events.dispatch('load-complete');
    });

    await renderNavigator(element, onUpdate);

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(
      'https://example.com/completed',
      'deep-link',
      element,
      expect.objectContaining({
        behaviorElement: expect.any(Object),
      }),
    );
  });

  test('real navigation container is ready when load behaviors trigger', async () => {
    const navigationRef = createNavigationContainerRef();
    let readyWhenTriggered = false;
    triggerBehaviors.mockImplementationOnce(() => {
      readyWhenTriggered = navigationRef.isReady();
    });

    await render(
      <NavigationContainer ref={navigationRef}>
        <HyperviewContext.Provider value={hyperviewContextValue}>
          <HvDocContext.Provider value={hvDocContextValue}>
            <HvNavigator
              element={createNavigatorElement('real-navigation-ready')}
              onUpdate={jest.fn()}
              routeComponent={RouteComponent}
            />
          </HvDocContext.Provider>
        </HyperviewContext.Provider>
      </NavigationContainer>,
    );

    expect(triggerBehaviors).toHaveBeenCalledTimes(1);
    expect(readyWhenTriggered).toBe(true);
  });

  test('replacement element triggers after the real navigation container is already ready', async () => {
    const navigationRef = createNavigationContainerRef();
    const buildTreeWithRef = (element: Element) => (
      <NavigationContainer ref={navigationRef}>
        <HyperviewContext.Provider value={hyperviewContextValue}>
          <HvDocContext.Provider value={hvDocContextValue}>
            <HvNavigator
              element={element}
              onUpdate={jest.fn()}
              routeComponent={RouteComponent}
            />
          </HvDocContext.Provider>
        </HyperviewContext.Provider>
      </NavigationContainer>
    );
    const { rerender } = await render(
      buildTreeWithRef(createNavigatorElement('initial-ready-element')),
    );
    expect(navigationRef.isReady()).toBe(true);

    triggerBehaviors.mockReset();
    let readyWhenReplacementTriggered = false;
    triggerBehaviors.mockImplementationOnce(() => {
      readyWhenReplacementTriggered = navigationRef.isReady();
    });

    await rerender(
      buildTreeWithRef(createNavigatorElement('replacement-ready-element')),
    );

    expect(triggerBehaviors).toHaveBeenCalledTimes(1);
    expect(readyWhenReplacementTriggered).toBe(true);
  });
});
