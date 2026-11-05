import { act, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { RouteLifecycle } from './route-lifecycle';
import { Text } from 'react-native';
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

describe('RouteLifecycle', () => {
  beforeEach(() => {
    mockUsePreventRemove.mockClear();
  });

  it('keeps the focus lifetime stable when route callbacks change', async () => {
    const removeFocusListener = jest.fn();
    const onBlur = jest.fn();
    const onFocus = jest.fn(() => removeFocusListener);
    const onNextBlur = jest.fn();
    const onNextFocus = jest.fn();
    const view = await render(
      <RouteLifecycle
        onBlur={onBlur}
        onFocus={onFocus}
        preventRemove
        resumeRemoval={jest.fn()}
        runBackBehaviors={jest.fn()}
      >
        <Text>Route</Text>
      </RouteLifecycle>,
    );

    expect(onFocus).toHaveBeenCalledTimes(1);

    await view.rerender(
      <RouteLifecycle
        onBlur={onNextBlur}
        onFocus={onNextFocus}
        preventRemove
        resumeRemoval={jest.fn()}
        runBackBehaviors={jest.fn()}
      >
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

  it('keeps the original removal blocked when back behaviors run', async () => {
    const action = { type: 'GO_BACK' };
    const resumeRemoval = jest.fn();
    const runBackBehaviors = jest.fn(() => true);
    await render(
      <RouteLifecycle
        onBlur={jest.fn()}
        onFocus={jest.fn()}
        preventRemove
        resumeRemoval={resumeRemoval}
        runBackBehaviors={runBackBehaviors}
      >
        <Text>Route</Text>
      </RouteLifecycle>,
    );
    const [, preventCallback] = mockUsePreventRemove.mock.calls.at(-1);

    await act(() => {
      preventCallback({ data: { action } });
    });

    expect(runBackBehaviors).toHaveBeenCalledTimes(1);
    expect(resumeRemoval).not.toHaveBeenCalled();
  });

  it('resumes the original removal when no back behavior can run', async () => {
    const action = { type: 'GO_BACK' };
    const resumeRemoval = jest.fn();
    await render(
      <RouteLifecycle
        onBlur={jest.fn()}
        onFocus={jest.fn()}
        preventRemove
        resumeRemoval={resumeRemoval}
        runBackBehaviors={jest.fn(() => false)}
      >
        <Text>Route</Text>
      </RouteLifecycle>,
    );
    const [, preventCallback] = mockUsePreventRemove.mock.calls.at(-1);

    await act(() => {
      preventCallback({ data: { action } });
    });

    expect(resumeRemoval).toHaveBeenCalledWith(action);
  });

  it('redispatches removals triggered synchronously by back behaviors', async () => {
    const nestedActions = [
      { payload: { id: 1 }, type: 'GO_BACK' },
      { payload: { id: 2 }, type: 'GO_BACK' },
    ];
    const resumeRemoval = jest.fn();
    let preventCallback: (event: {
      data: { action: { payload?: { id: number }; type: string } };
    }) => void;
    const runBackBehaviors = jest.fn(() => {
      nestedActions.forEach(action => {
        preventCallback({ data: { action } });
      });
      return true;
    });
    await render(
      <RouteLifecycle
        onBlur={jest.fn()}
        onFocus={jest.fn()}
        preventRemove
        resumeRemoval={resumeRemoval}
        runBackBehaviors={runBackBehaviors}
      >
        <Text>Route</Text>
      </RouteLifecycle>,
    );
    [, preventCallback] = mockUsePreventRemove.mock.calls.at(-1);

    await act(() => {
      preventCallback({ data: { action: { type: 'POP' } } });
    });

    expect(resumeRemoval.mock.calls.map(([action]) => action)).toEqual(
      nestedActions,
    );
    expect(runBackBehaviors).toHaveBeenCalledTimes(1);
  });
});
