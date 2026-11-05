import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { RouteLifecycle } from './route-lifecycle';
import { Text } from 'react-native';

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  const ReactModule = jest.requireActual('react');
  return {
    ...actual,
    useFocusEffect: (callback: () => () => void) =>
      ReactModule.useLayoutEffect(callback, [callback]),
  };
});

describe('RouteLifecycle', () => {
  it('keeps the focus lifetime stable when route callbacks change', async () => {
    const removeFocusListener = jest.fn();
    const onBlur = jest.fn();
    const onFocus = jest.fn(() => removeFocusListener);
    const onNextBlur = jest.fn();
    const onNextFocus = jest.fn();
    const view = await render(
      <RouteLifecycle onBlur={onBlur} onFocus={onFocus}>
        <Text>Route</Text>
      </RouteLifecycle>,
    );

    expect(onFocus).toHaveBeenCalledTimes(1);

    await view.rerender(
      <RouteLifecycle onBlur={onNextBlur} onFocus={onNextFocus}>
        <Text>Updated route</Text>
      </RouteLifecycle>,
    );

    expect(onBlur).not.toHaveBeenCalled();
    expect(onNextFocus).not.toHaveBeenCalled();

    await view.unmount();

    await waitFor(() => {
      expect(removeFocusListener).toHaveBeenCalledTimes(1);
      expect(onNextBlur).toHaveBeenCalledTimes(1);
    });
  });
});
