import {
  ListenerEvent,
  NavigationProps,
  RouteProps,
} from 'hyperview/src/types';
import { act, render, waitFor } from '@testing-library/react-native';
import type { PreventRemoveAction } from './types';
import React from 'react';
import { RouteGuard } from './route-guard';
import { Text } from 'react-native';
import { registerRouteFocusListener } from './helpers';
import { usePreventRemove } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  const ReactModule = jest.requireActual('react');
  return {
    ...actual,
    useFocusEffect: (callback: () => () => void) =>
      ReactModule.useLayoutEffect(callback, [callback]),
    useIsFocused: () => true,
    usePreventRemove: jest.fn(),
  };
});

const mockUsePreventRemove = usePreventRemove as jest.Mock;
const mockAddListener = jest.fn<
  () => void,
  [string, (event: ListenerEvent) => void]
>((): (() => void) => jest.fn());
const routeGuardNavigation = ({
  addListener: mockAddListener,
} as unknown) as NavigationProps;

describe('registerRouteFocusListener', () => {
  it('notifies after a completed opening transition for the focused route', () => {
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
    const onRouteFocus = jest.fn();
    const route: RouteProps = {
      key: 'route-key',
      name: 'route',
      params: {},
    };

    const unsubscribe = registerRouteFocusListener(
      navigation,
      route,
      onRouteFocus,
    );

    expect(navigation.addListener).toHaveBeenCalledWith(
      'transitionEnd',
      expect.any(Function),
    );
    expect(onRouteFocus).not.toHaveBeenCalled();

    listener?.({
      data: { closing: true },
      preventDefault: jest.fn(),
    });
    expect(onRouteFocus).not.toHaveBeenCalled();

    navigation.isFocused = jest.fn(() => false);
    listener?.({
      data: { closing: false },
      preventDefault: jest.fn(),
    });
    expect(onRouteFocus).not.toHaveBeenCalled();

    navigation.isFocused = jest.fn(() => true);
    listener?.({
      data: { closing: false },
      preventDefault: jest.fn(),
    });
    expect(onRouteFocus).toHaveBeenCalledWith(route);

    unsubscribe();
    expect(removeListener).toHaveBeenCalledTimes(1);
  });
});

describe('RouteGuard', () => {
  beforeEach(() => {
    mockAddListener.mockClear();
    mockUsePreventRemove.mockClear();
  });

  it('keeps focus lifetime stable when route callbacks change', async () => {
    const onBlur = jest.fn();
    const onFocus = jest.fn();
    const onNextBlur = jest.fn();
    const onNextFocus = jest.fn();
    const resumeRemoval = jest.fn();
    const runBackBehaviors = jest.fn();
    const view = await render(
      <RouteGuard
        navigation={routeGuardNavigation}
        onBlur={onBlur}
        onFocus={onFocus}
        onRemove={jest.fn()}
        preventRemove
        resumeRemoval={resumeRemoval}
        runBackBehaviors={runBackBehaviors}
      >
        <Text>Route</Text>
      </RouteGuard>,
    );

    await waitFor(() => expect(onFocus).toHaveBeenCalledTimes(1));

    await view.rerender(
      <RouteGuard
        navigation={routeGuardNavigation}
        onBlur={onNextBlur}
        onFocus={onNextFocus}
        onRemove={jest.fn()}
        preventRemove
        resumeRemoval={resumeRemoval}
        runBackBehaviors={runBackBehaviors}
      >
        <Text>Route updated</Text>
      </RouteGuard>,
    );

    expect(onBlur).not.toHaveBeenCalled();
    expect(onNextFocus).not.toHaveBeenCalled();

    await view.unmount();

    await waitFor(() => expect(onNextBlur).toHaveBeenCalledTimes(1));
    expect(mockUsePreventRemove).toHaveBeenLastCalledWith(
      true,
      expect.any(Function),
    );
  });

  it('removes the route only after an unprevented removal', async () => {
    const onRemove = jest.fn();
    await render(
      <RouteGuard
        navigation={routeGuardNavigation}
        onBlur={jest.fn()}
        onFocus={jest.fn()}
        onRemove={onRemove}
        preventRemove
        resumeRemoval={jest.fn()}
        runBackBehaviors={jest.fn()}
      >
        <Text>Route</Text>
      </RouteGuard>,
    );
    const listenerCall = mockAddListener.mock.calls.at(-1);
    if (!listenerCall) {
      throw new Error('Expected beforeRemove listener');
    }
    const [, handleBeforeRemove] = listenerCall;

    await act(() => {
      handleBeforeRemove({
        data: {},
        defaultPrevented: true,
        preventDefault: jest.fn(),
      });
      handleBeforeRemove({
        data: {},
        defaultPrevented: false,
        preventDefault: jest.fn(),
      });
    });

    expect(mockAddListener).toHaveBeenCalledWith(
      'beforeRemove',
      expect.any(Function),
    );
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('keeps the original removal blocked when back behaviors do not navigate', async () => {
    const action = { type: 'GO_BACK' };
    const resumeRemoval = jest.fn();
    const runBackBehaviors = jest.fn();
    await render(
      <RouteGuard
        navigation={routeGuardNavigation}
        onBlur={jest.fn()}
        onFocus={jest.fn()}
        onRemove={jest.fn()}
        preventRemove
        resumeRemoval={resumeRemoval}
        runBackBehaviors={runBackBehaviors}
      >
        <Text>Route</Text>
      </RouteGuard>,
    );
    const [, preventCallback] = mockUsePreventRemove.mock.calls.at(-1);

    await act(() => {
      preventCallback({ data: { action } });
      expect(runBackBehaviors).toHaveBeenCalledTimes(1);
      expect(resumeRemoval).not.toHaveBeenCalled();
      expect(mockUsePreventRemove).toHaveBeenLastCalledWith(
        true,
        expect.any(Function),
      );
    });
  });

  it('redispatches every removal dispatched by back behaviors', async () => {
    const nestedActions = [
      { payload: { id: 1 }, type: 'GO_BACK' },
      { payload: { id: 2 }, type: 'GO_BACK' },
      { payload: { id: 3 }, type: 'GO_BACK' },
    ];
    const resumeRemoval = jest.fn();
    let preventCallback: (event: {
      data: { action: PreventRemoveAction };
    }) => void;
    const runBackBehaviors = jest.fn(() => {
      nestedActions.forEach(action => {
        preventCallback({ data: { action } });
      });
    });
    await render(
      <RouteGuard
        navigation={routeGuardNavigation}
        onBlur={jest.fn()}
        onFocus={jest.fn()}
        onRemove={jest.fn()}
        preventRemove
        resumeRemoval={resumeRemoval}
        runBackBehaviors={runBackBehaviors}
      >
        <Text>Route</Text>
      </RouteGuard>,
    );
    [, preventCallback] = mockUsePreventRemove.mock.calls.at(-1);

    await act(() => {
      preventCallback({ data: { action: { type: 'POP' } } });
      expect(resumeRemoval.mock.calls.map(([action]) => action)).toEqual(
        nestedActions,
      );
      expect(runBackBehaviors).toHaveBeenCalledTimes(1);
    });
  });
});
