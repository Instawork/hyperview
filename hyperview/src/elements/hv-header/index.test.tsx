import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Logging from 'hyperview/src/services/logging';
import { HyperviewMock, parse } from 'hyperview/test/helpers';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import type { HeaderViewProps } from 'hyperview/src/types';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { resolveUniqueElementById } from './callbacks';

describe('HvHeader', () => {
  test.each([
    ['basic', 'basic', 'content'],
    ['custom title', 'custom-title', 'custom-title'],
    ['item states', 'item-states', 'loading-item'],
    ['menu', 'menu', 'menu-sort-name'],
    ['mixed items', 'mixed-items', 'custom-badge'],
    ['native items', 'native-items', 'native-done'],
    ['search', 'search', 'native-search'],
  ])('renders the %s example without a host wrapper', async (_, story, id) => {
    await render(
      <HyperviewMock paths={[`${__dirname}/stories/${story}.xml`]} />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeOnTheScreen();
      expect(screen.getByTestId(id)).toBeOnTheScreen();
      return true;
    });
  });

  test('wraps header content with the host header view', async () => {
    const triggerPressBehaviors = jest
      .spyOn(Behaviors, 'triggerPressBehaviors')
      .mockImplementation();
    const HeaderView = jest.fn(({ children }: HeaderViewProps) => (
      <View testID="host-header">{children}</View>
    ));

    await render(
      <HyperviewMock
        navigationComponents={{ HeaderView }}
        paths={[`${__dirname}/stories/native-items.xml`]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('host-header')).toBeOnTheScreen();
      expect(screen.getByTestId('header')).toBeOnTheScreen();
      expect(screen.getByTestId('native-info')).toBeOnTheScreen();
      expect(HeaderView).toHaveBeenCalled();
      expect(
        HeaderView.mock.calls.every(
          ([props]) =>
            props.element.localName === 'header' &&
            typeof props.getElementById === 'function' &&
            typeof props.onChangeText === 'function' &&
            typeof props.onPress === 'function' &&
            typeof props.onTrigger === 'function' &&
            typeof props.renderItem === 'function',
        ),
      ).toBe(true);
      return true;
    });

    const [headerViewProps] = HeaderView.mock.calls[
      HeaderView.mock.calls.length - 1
    ];
    const element = headerViewProps.getElementById('native-info');
    expect(element).toBeDefined();
    headerViewProps.onPress('native-info');

    expect(triggerPressBehaviors).toHaveBeenCalledWith(
      element,
      expect.any(Function),
    );
  });

  test('updates native header activation from host context', async () => {
    const EnabledContext = React.createContext(false);
    const Stack = createNativeStackNavigator();
    const HeaderView = ({ children }: HeaderViewProps) => children;
    const useOptions = () => {
      return React.useContext(EnabledContext)
        ? { headerShown: true }
        : undefined;
    };
    HeaderView.useOptions = useOptions;
    const renderHeader = (enabled: boolean) => (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="HeaderTest">
            {() => (
              <EnabledContext.Provider value={enabled}>
                <HyperviewMock
                  navigationComponents={{ HeaderView }}
                  paths={[`${__dirname}/stories/search.xml`]}
                />
              </EnabledContext.Provider>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
    const result = await render(renderHeader(false));

    await waitFor(() => {
      expect(screen.getByTestId('native-search')).toBeOnTheScreen();
      return true;
    });

    await result.rerender(renderHeader(true));

    await waitFor(() => {
      expect(screen.queryByTestId('native-search')).not.toBeOnTheScreen();
      return true;
    });

    await result.rerender(renderHeader(false));

    await waitFor(() => {
      expect(screen.getByTestId('native-search')).toBeOnTheScreen();
      return true;
    });
  });

  test('renders custom header buttons through standard HXML behaviors', async () => {
    const createActionHandler = jest.spyOn(Behaviors, 'createActionHandler');
    const triggerPressBehaviors = jest.spyOn(
      Behaviors,
      'triggerPressBehaviors',
    );
    triggerPressBehaviors.mockClear();
    const HeaderView = jest.fn(({ element, renderItem }: HeaderViewProps) => {
      const customItem = element.getElementsByTagName('view').item(0);
      return (
        <View testID="host-header">
          {customItem ? renderItem(customItem) : null}
        </View>
      );
    });

    await render(
      <HyperviewMock
        navigationComponents={{ HeaderView }}
        paths={[`${__dirname}/stories/custom-item.xml`]}
      />,
    );

    await fireEvent.press(screen.getByTestId('custom-header-button'));

    expect(createActionHandler).toHaveBeenCalled();
    expect(triggerPressBehaviors).not.toHaveBeenCalled();
  });

  test('resolves live text-field elements for native header callbacks', async () => {
    let callbacks: HeaderViewProps | undefined;
    const trigger = jest.spyOn(Behaviors, 'trigger').mockImplementation();
    const HeaderView = jest.fn((props: HeaderViewProps) => {
      callbacks = props;
      return <View testID="host-header">{props.children}</View>;
    });

    await render(
      <HyperviewMock
        navigationComponents={{ HeaderView }}
        paths={[`${__dirname}/stories/search.xml`]}
      />,
    );

    const getCallbacks = () => {
      expect(callbacks).toBeDefined();
      return callbacks as HeaderViewProps;
    };
    const originalElement = getCallbacks().getElementById('native-search');

    await act(async () => {
      getCallbacks().onChangeText('native-search', '4155551212');
    });

    await waitFor(() => {
      expect(
        getCallbacks().getElementById('native-search')?.getAttribute('value'),
      ).toEqual('(415) 555-1212');
    });
    const liveElement = getCallbacks().getElementById('native-search');
    expect(liveElement).not.toBe(originalElement);
    await waitFor(() => {
      expect(trigger).toHaveBeenCalledWith(
        'change',
        liveElement,
        expect.any(Function),
      );
    });

    const expectTrigger = async (
      behaviorTrigger: Parameters<HeaderViewProps['onTrigger']>[0],
    ) => {
      trigger.mockClear();
      await act(async () => {
        getCallbacks().onTrigger(behaviorTrigger, 'native-search');
      });
      expect(trigger).toHaveBeenCalledWith(
        behaviorTrigger,
        getCallbacks().getElementById('native-search'),
        expect.any(Function),
      );
    };
    await expectTrigger('focus');
    await expectTrigger('blur');
    await expectTrigger('submit');
  });

  test('safely ignores a missing native header callback target', async () => {
    let callbacks: HeaderViewProps | undefined;
    const warn = jest.spyOn(Logging, 'warn').mockImplementation();
    const HeaderView = jest.fn((props: HeaderViewProps) => {
      callbacks = props;
      return props.children;
    });

    await render(
      <HyperviewMock
        navigationComponents={{ HeaderView }}
        paths={[`${__dirname}/stories/basic.xml`]}
      />,
    );

    expect(callbacks).toBeDefined();
    (callbacks as HeaderViewProps).onPress('missing-element');
    expect(warn).toHaveBeenCalledWith(
      'Unable to resolve native header element with id "missing-element"',
    );
  });

  test('rejects duplicate native header callback targets', () => {
    const warn = jest.spyOn(Logging, 'warn').mockImplementation();
    const doc = parse(`
      <doc xmlns="https://hyperview.org/hyperview">
        <screen>
          <body>
            <view id="duplicate" />
            <view id="duplicate" />
          </body>
        </screen>
      </doc>
    `);

    expect(resolveUniqueElementById(doc, 'duplicate')).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      'Unable to resolve duplicate native header elements with id "duplicate"',
    );
  });
});
