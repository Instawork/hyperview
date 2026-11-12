import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Events from 'hyperview/src/services/events';
import {
  NavigationContainer,
  NavigationContainerRefContext,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { act, render } from '@testing-library/react-native';
import { DOMParser } from '@instawork/xmldom';
import { Context as HvDocContext } from 'hyperview/src/elements/hv-doc/context';
import HvNavigator from './index';
import { HyperviewContext } from 'hyperview/src/contexts/hyperview';
import React from 'react';

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
      <navigator
        xmlns:redux="https://instawork.com/hyperview-redux"
        id="${id}"
        type="stack"
      >
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
          action="redux"
          redux:action="AUTH_FLOW/SAVE_LOCAL_AUTH_TOKEN_BEGIN"
        />
        <behavior
          trigger="on-event"
          event-name="save-local-auth-token-end"
          action="redux"
          redux:action="AUTH_FLOW/AUTHENTICATE_BEGIN"
        />
      `,
    );
    const onUpdate = jest.fn();
    triggerBehaviors.mockImplementationOnce(() => {
      Events.dispatch('save-local-auth-token-end');
    });

    await renderNavigator(element, onUpdate);

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(
      null,
      'redux',
      element,
      expect.objectContaining({
        behaviorElement: expect.any(Object),
      }),
    );
  });

  test('waits for the navigation container to be ready before triggering load behaviors', async () => {
    let ready = false;
    let onReady: (() => void) | undefined;
    const rootNavigation = ({
      addListener: (event: string, callback: () => void) => {
        if (event === 'ready') {
          onReady = callback;
        }
        return jest.fn();
      },
      isReady: () => ready,
    } as unknown) as React.ContextType<typeof NavigationContainerRefContext>;

    await render(
      <NavigationContainer>
        <NavigationContainerRefContext.Provider value={rootNavigation}>
          <HyperviewContext.Provider value={hyperviewContextValue}>
            <HvDocContext.Provider value={hvDocContextValue}>
              <HvNavigator
                element={createNavigatorElement('navigation-ready')}
                onUpdate={jest.fn()}
                routeComponent={RouteComponent}
              />
            </HvDocContext.Provider>
          </HyperviewContext.Provider>
        </NavigationContainerRefContext.Provider>
      </NavigationContainer>,
    );

    expect(triggerBehaviors).not.toHaveBeenCalled();

    ready = true;
    await act(() => onReady?.());

    expect(triggerBehaviors).toHaveBeenCalledTimes(1);

    await act(() => onReady?.());

    expect(triggerBehaviors).toHaveBeenCalledTimes(1);
  });

  test('triggers load behaviors after a real navigation container is ready', async () => {
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

  test('triggers business login load actions once in source order', async () => {
    const element = createNavigatorElementWithBehaviors(
      'business-login',
      `
        <behavior
          trigger="load"
          action="redux"
          redux:action="SESSION/SAVE_LOCAL_AUTH_TOKEN_BEGIN"
        />
        <behavior
          trigger="load"
          action="redux"
          redux:action="SESSION/LOAD_BEGIN"
        />
      `,
    );

    await renderNavigator(element);

    expect(triggerBehaviors).toHaveBeenCalledTimes(1);
    const [[, triggeredElements]] = triggerBehaviors.mock.calls;
    expect(
      triggeredElements.map(behavior =>
        behavior.getAttributeNS(
          'https://instawork.com/hyperview-redux',
          'action',
        ),
      ),
    ).toEqual(['SESSION/SAVE_LOCAL_AUTH_TOKEN_BEGIN', 'SESSION/LOAD_BEGIN']);
  });

  test('triggers applicant authentication only after its completion events', async () => {
    const element = createNavigatorElementWithBehaviors(
      'applicant-authentication',
      `
        <behavior
          trigger="load"
          action="redux"
          once="true"
          redux:action="AUTH_FLOW/SAVE_LOCAL_AUTH_TOKEN_BEGIN"
        />
        <behavior
          trigger="on-event"
          event-name="save-local-auth-token-end"
          action="redux"
          once="true"
          redux:action="AUTH_FLOW/AUTHENTICATE_BEGIN"
        />
        <behavior
          trigger="on-event"
          event-name="app-become-ready-end"
          action="deep-link"
          href="https://example.com/profile"
          once="true"
        />
      `,
    );
    const onUpdate = jest.fn();

    await renderNavigator(element, onUpdate);

    expect(triggerBehaviors).toHaveBeenCalledTimes(1);
    expect(triggerBehaviors.mock.calls[0][1]).toHaveLength(1);
    expect(onUpdate).not.toHaveBeenCalled();

    Events.dispatch('save-local-auth-token-end');

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenLastCalledWith(
      null,
      'redux',
      element,
      expect.objectContaining({
        behaviorElement: expect.any(Object),
      }),
    );

    Events.dispatch('app-become-ready-end');

    expect(onUpdate).toHaveBeenCalledTimes(2);
    expect(onUpdate).toHaveBeenLastCalledWith(
      'https://example.com/profile',
      'deep-link',
      element,
      expect.objectContaining({
        behaviorElement: expect.any(Object),
      }),
    );
  });
});
