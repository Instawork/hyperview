import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import HyperviewComponent from 'hyperview/src/hyperview';
import { Pressable } from 'react-native';
import React from 'react';
import { fetchFactory } from 'hyperview/test/helpers/fetch';

let mockUseNativeStack = false;

jest.mock('hyperview/src/components/navigator-stack', () => {
  const ReactModule = jest.requireActual<typeof import('react')>('react');
  const { createNavigatorFactory } = jest.requireActual<
    typeof import('@react-navigation/native')
  >('@react-navigation/native');
  const StackNavigator = jest.requireActual<
    typeof import('hyperview/src/components/navigator-stack/stack-navigator')
  >('hyperview/src/components/navigator-stack/stack-navigator').default;
  const NativeStackNavigator = jest.requireActual<
    typeof import('hyperview/src/components/navigator-stack/native-stack-navigator')
  >('hyperview/src/components/navigator-stack/native-stack-navigator').default;
  const Navigator = (
    props: React.ComponentProps<typeof StackNavigator>,
  ): React.ReactElement =>
    ReactModule.createElement(
      mockUseNativeStack ? NativeStackNavigator : StackNavigator,
      props,
    );

  return {
    __esModule: true,
    default: createNavigatorFactory(Navigator),
  };
});

jest.mock('hyperview/src/elements/hv-navigator/stack-options', () => {
  const stackOptions = jest.requireActual<
    typeof import('hyperview/src/elements/hv-navigator/stack-options')
  >('hyperview/src/elements/hv-navigator/stack-options');
  const nativeStackOptions = jest.requireActual<
    typeof import('hyperview/src/elements/hv-navigator/stack-options.native')
  >('hyperview/src/elements/hv-navigator/stack-options.native');

  return {
    getStackRouteOptions: (
      params: Parameters<typeof stackOptions.getStackRouteOptions>[0],
    ) =>
      (mockUseNativeStack
        ? nativeStackOptions
        : stackOptions
      ).getStackRouteOptions(params),
  };
});

const getRootNavigationState = (
  navigationRef: ReturnType<typeof createNavigationContainerRef>,
) => {
  const state = navigationRef.getRootState();
  if (!state) {
    throw new Error('Expected root navigation state');
  }
  return state;
};

describe.each([
  ['stack', false],
  ['native-stack', true],
])('Hyperview navigation sequences (%s)', (_name, useNativeStack) => {
  const Hyperview = (
    props: React.ComponentProps<typeof HyperviewComponent>,
  ): React.ReactElement => (
    <HyperviewComponent
      entrypointUrl={props.entrypointUrl}
      fetch={props.fetch}
      formatDate={props.formatDate}
    />
  );
  const formatDate = jest.fn();

  beforeEach(() => {
    mockUseNativeStack = useNativeStack;
  });

  afterEach(async () => {
    await cleanup();
  });

  test.each(['new', 'push'])(
    'runs adjacent close and %s load behaviors in order',
    async action => {
      const navigationRef = createNavigationContainerRef();
      const mockFetch = fetchFactory([
        [
          'http://myapp.com/navigation-sequence-document',
          `
            <doc xmlns="https://hyperview.org/hyperview">
              <navigator id="root" type="stack">
                <nav-route
                  id="home"
                  href="http://myapp.com/navigation-sequence-home"
                />
              </navigator>
            </doc>
          `,
        ],
        [
          'http://myapp.com/navigation-sequence-home',
          `
            <doc xmlns="https://hyperview.org/hyperview">
              <screen>
                <body>
                  <behavior
                    trigger="load"
                    action="new"
                    href="http://myapp.com/navigation-sequence-proxy"
                    once="true"
                  />
                  <text id="home">Home</text>
                </body>
              </screen>
            </doc>
          `,
        ],
        [
          'http://myapp.com/navigation-sequence-proxy',
          `
            <doc xmlns="https://hyperview.org/hyperview">
              <screen>
                <body>
                  <behavior trigger="load" action="close" once="true" />
                  <behavior
                    trigger="load"
                    action="${action}"
                    href="http://myapp.com/navigation-sequence-destination"
                    once="true"
                  />
                  <text id="proxy">Proxy</text>
                </body>
              </screen>
            </doc>
          `,
        ],
        [
          'http://myapp.com/navigation-sequence-destination',
          `
            <doc xmlns="https://hyperview.org/hyperview">
              <screen>
                <body>
                  <text id="destination">Destination</text>
                </body>
              </screen>
            </doc>
          `,
        ],
      ]);

      await render(
        <NavigationContainer ref={navigationRef}>
          <Hyperview
            entrypointUrl="http://myapp.com/navigation-sequence-document"
            fetch={mockFetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );

      await waitFor(
        () => {
          expect(screen.getByTestId('destination')).toBeOnTheScreen();
          expect(screen.queryByTestId('proxy')).not.toBeOnTheScreen();
        },
        { timeout: 2000 },
      );
      const rootState = getRootNavigationState(navigationRef);
      expect(rootState.routes.map(route => route.name)).toEqual([
        'home',
        action === 'new' ? 'modal' : 'card',
      ]);
      expect(rootState.index).toBe(1);
    },
  );

  test('runs adjacent close and push press behaviors in order', async () => {
    const navigationRef = createNavigationContainerRef();
    const mockFetch = fetchFactory([
      [
        'http://myapp.com/community-document',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root" type="stack">
              <nav-route id="home" href="http://myapp.com/community-home" />
            </navigator>
          </doc>
        `,
      ],
      [
        'http://myapp.com/community-home',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <behavior
                  trigger="load"
                  action="new"
                  href="http://myapp.com/community-intro"
                  once="true"
                />
                <text id="home">Home</text>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/community-intro',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view id="get-started">
                  <behavior action="close" />
                  <behavior href="http://myapp.com/community-form" />
                  <text>Get started</text>
                </view>
                <text id="intro">Intro</text>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/community-form',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text id="community-form">Community form</text>
              </body>
            </screen>
          </doc>
        `,
      ],
    ]);

    await render(
      <NavigationContainer ref={navigationRef}>
        <Hyperview
          entrypointUrl="http://myapp.com/community-document"
          fetch={mockFetch}
          formatDate={formatDate}
        />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('get-started')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('get-started'));

    await waitFor(() => {
      expect(screen.getByTestId('community-form')).toBeOnTheScreen();
      expect(screen.queryByTestId('intro')).not.toBeOnTheScreen();
    });
    const rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual(['home', 'card']);
    expect(rootState.index).toBe(1);
  });

  test.each(['back', 'close'])(
    'reloads the underlying route while a modal performs %s',
    async action => {
      const mockFetch = fetchFactory([
        [
          'http://myapp.com/event-reload-document',
          `
            <doc xmlns="https://hyperview.org/hyperview">
              <navigator id="root" type="stack">
                <nav-route
                  id="home"
                  href="http://myapp.com/event-reload-home"
                />
              </navigator>
            </doc>
          `,
        ],
        [
          'http://myapp.com/event-reload-home',
          `
            <doc xmlns="https://hyperview.org/hyperview">
              <screen>
                <body>
                  <view
                    id="open-details"
                    action="push"
                    href="http://myapp.com/event-reload-details"
                  >
                    <text>Open details</text>
                  </view>
                  <text id="home">Home</text>
                </body>
              </screen>
            </doc>
          `,
        ],
        [
          'http://myapp.com/event-reload-details',
          `
            <doc xmlns="https://hyperview.org/hyperview">
              <screen>
                <body>
                  <behavior
                    trigger="on-event"
                    event-name="details-updated"
                    action="reload"
                    href="http://myapp.com/event-reload-refreshed"
                    once="true"
                  />
                  <behavior
                    trigger="load"
                    action="new"
                    href="http://myapp.com/event-reload-modal"
                    once="true"
                  />
                  <text id="details">Details</text>
                </body>
              </screen>
            </doc>
          `,
        ],
        [
          'http://myapp.com/event-reload-modal',
          `
            <doc xmlns="https://hyperview.org/hyperview">
              <screen>
                <body>
                  <behavior
                    trigger="load"
                    action="dispatch-event"
                    event-name="details-updated"
                    once="true"
                  />
                  <behavior
                    trigger="load"
                    action="${action}"
                    once="true"
                  />
                  <text id="modal">Modal</text>
                </body>
              </screen>
            </doc>
          `,
        ],
        [
          'http://myapp.com/event-reload-refreshed',
          `
            <doc xmlns="https://hyperview.org/hyperview">
              <screen>
                <body>
                  <text id="refreshed-details">Refreshed details</text>
                </body>
              </screen>
            </doc>
          `,
        ],
      ]);

      const navigationRef = createNavigationContainerRef();

      await render(
        <NavigationContainer ref={navigationRef}>
          <Hyperview
            entrypointUrl="http://myapp.com/event-reload-document"
            fetch={mockFetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('open-details')).toBeOnTheScreen();
      });
      await fireEvent.press(screen.getByTestId('open-details'));

      await waitFor(() => {
        expect(screen.getByTestId('refreshed-details')).toBeOnTheScreen();
        expect(screen.queryByTestId('modal')).not.toBeOnTheScreen();
        expect(screen.queryByTestId('home')).not.toBeOnTheScreen();
      });
      const rootState = getRootNavigationState(navigationRef);
      expect(rootState.routes.map(route => route.name)).toEqual([
        'home',
        'card',
      ]);
      expect(rootState.index).toBe(1);
    },
  );

  test('closes a named route marked as a modal', async () => {
    const navigationRef = createNavigationContainerRef();
    const mockFetch = fetchFactory([
      [
        'http://myapp.com/named-modal-document',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root" type="stack">
              <nav-route id="home" href="http://myapp.com/named-modal-home" />
              <nav-route
                id="welcome"
                href="http://myapp.com/named-modal-welcome"
                modal="true"
              />
            </navigator>
          </doc>
        `,
      ],
      [
        'http://myapp.com/named-modal-home',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text id="home">Home</text>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/named-modal-welcome',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view id="close-welcome" action="close">
                  <text>Close welcome</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
      ],
    ]);

    await render(
      <NavigationContainer ref={navigationRef}>
        <Hyperview
          entrypointUrl="http://myapp.com/named-modal-document"
          fetch={mockFetch}
          formatDate={formatDate}
        />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('close-welcome')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('close-welcome'));

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeOnTheScreen();
      expect(screen.queryByTestId('close-welcome')).not.toBeOnTheScreen();
    });
    const rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual(['home']);
    expect(rootState.index).toBe(0);
  });

  test('retires a welcome modal when navigating into a tab route', async () => {
    const navigationRef = createNavigationContainerRef();
    const mockFetch = fetchFactory([
      [
        'http://myapp.com/welcome-tabs-document',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root-navigator" type="stack">
              <nav-route id="tabs-route">
                <navigator id="tabs-navigator" type="tab" merge="true">
                  <nav-route id="home-route" href="http://myapp.com/welcome-tabs-home" />
                  <nav-route id="messages-route" href="http://myapp.com/welcome-tabs-messages" />
                </navigator>
              </nav-route>
              <nav-route id="welcome" href="http://myapp.com/welcome-tabs-welcome" modal="true" />
            </navigator>
          </doc>
        `,
      ],
      [
        'http://myapp.com/welcome-tabs-welcome',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text id="welcome">Congrats</text>
                <view action="close" href="#" id="continue">
                  <text>Continue</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/welcome-tabs-home',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text id="home">Home</text>
                <view action="navigate" href="#messages-route" id="go-messages">
                  <text>Messages</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/welcome-tabs-messages',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text id="messages">Messages</text>
              </body>
            </screen>
          </doc>
        `,
      ],
    ]);

    await render(
      <NavigationContainer ref={navigationRef}>
        <Hyperview
          entrypointUrl="http://myapp.com/welcome-tabs-document"
          fetch={mockFetch}
          formatDate={formatDate}
        />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('continue')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('continue'));

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeOnTheScreen();
    });
    expect(screen.queryByTestId('welcome')).not.toBeOnTheScreen();
    let rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual(['tabs-route']);
    expect(rootState.index).toBe(0);

    await fireEvent.press(screen.getByTestId('go-messages'));

    await waitFor(() => {
      expect(screen.getByTestId('messages')).toBeOnTheScreen();
    });
    expect(screen.queryByTestId('welcome')).not.toBeOnTheScreen();
    rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual(['tabs-route']);
    expect(rootState.index).toBe(0);
  });

  test('retargets a tab behind a pushed card without removing the card', async () => {
    const navigationRef = createNavigationContainerRef();
    const mockFetch = fetchFactory([
      [
        'http://myapp.com/tab-retarget-document',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root-navigator" type="stack">
              <nav-route id="tabs-route">
                <navigator id="tabs-navigator" type="tab">
                  <nav-route id="home-route" href="http://myapp.com/tab-retarget-home" />
                  <nav-route id="messages-route" href="http://myapp.com/tab-retarget-messages" />
                </navigator>
              </nav-route>
            </navigator>
          </doc>
        `,
      ],
      [
        'http://myapp.com/tab-retarget-home',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text id="home">Home</text>
                <view
                  action="push"
                  href="http://myapp.com/tab-retarget-card"
                  id="push-card"
                >
                  <text>Push card</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/tab-retarget-card',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text id="card">Card</text>
                <view action="navigate" href="#messages-route" id="go-messages">
                  <text>Go to messages</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/tab-retarget-messages',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text id="messages">Messages</text>
              </body>
            </screen>
          </doc>
        `,
      ],
    ]);

    await render(
      <NavigationContainer ref={navigationRef}>
        <Hyperview
          entrypointUrl="http://myapp.com/tab-retarget-document"
          fetch={mockFetch}
          formatDate={formatDate}
        />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('push-card')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('push-card'));
    await waitFor(() => {
      expect(screen.getByTestId('go-messages')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('go-messages'));

    await waitFor(() => {
      const rootState = getRootNavigationState(navigationRef);
      const tabsState = rootState.routes[0].state;
      expect(tabsState?.routes[tabsState.index ?? 0]?.name).toBe(
        'messages-route',
      );
    });
    expect(screen.getByTestId('card')).toBeOnTheScreen();
    let rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual([
      'tabs-route',
      'card',
    ]);
    expect(rootState.index).toBe(1);

    await act(() => navigationRef.goBack());

    await waitFor(() => {
      expect(screen.getByTestId('messages')).toBeOnTheScreen();
      expect(screen.queryByTestId('card')).not.toBeOnTheScreen();
    });
    rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual(['tabs-route']);
    expect(rootState.index).toBe(0);
  });

  test.each(['event', 'back'])(
    'closes an entire flow containing nested modals through %s behaviors',
    async closeMethod => {
      const navigationRef = createNavigationContainerRef();
      const mockFetch = fetchFactory([
        [
          'http://myapp.com/nested-modal-document',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root" type="stack">
              <nav-route id="home" href="http://myapp.com/nested-modal-home" />
            </navigator>
          </doc>
        `,
        ],
        [
          'http://myapp.com/nested-modal-home',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view
                  id="open-first-modal"
                  action="new"
                  href="http://myapp.com/nested-modal-first"
                >
                  <text>Open first modal</text>
                </view>
                <text id="home">Home</text>
              </body>
            </screen>
          </doc>
        `,
        ],
        [
          'http://myapp.com/nested-modal-first',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <behavior
                  trigger="on-event"
                  event-name="close-flow"
                  action="close"
                />
                <view
                  id="open-second-modal"
                  action="new"
                  href="http://myapp.com/nested-modal-second"
                >
                  <text>Open second modal</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
        ],
        [
          'http://myapp.com/nested-modal-second',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <behavior
                  trigger="on-event"
                  event-name="close-flow"
                  action="close"
                />
                <view
                  id="open-third-modal"
                  action="new"
                  href="http://myapp.com/nested-modal-third"
                >
                  <text>Open third modal</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
        ],
        [
          'http://myapp.com/nested-modal-third',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                ${
                  closeMethod === 'back'
                    ? `<view id="back-behaviors">
                  <behavior
                    action="hide"
                    target="back-behaviors"
                    trigger="back"
                  />
                  <behavior action="close" trigger="back" />
                  <behavior action="close" trigger="back" />
                  <behavior action="close" trigger="back" />
                </view>`
                    : ''
                }
                <behavior
                  trigger="on-event"
                  event-name="close-flow"
                  action="close"
                />
                <view id="close-modal-flow">
                  <behavior
                    action="dispatch-event"
                    event-name="close-flow"
                  />
                  <text>Close modal flow</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
        ],
      ]);

      await render(
        <NavigationContainer ref={navigationRef}>
          <Hyperview
            entrypointUrl="http://myapp.com/nested-modal-document"
            fetch={mockFetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('open-first-modal')).toBeOnTheScreen();
      });
      await fireEvent.press(screen.getByTestId('open-first-modal'));
      await waitFor(() => {
        expect(screen.getByTestId('open-second-modal')).toBeOnTheScreen();
      });
      await fireEvent.press(screen.getByTestId('open-second-modal'));
      await waitFor(() => {
        expect(screen.getByTestId('open-third-modal')).toBeOnTheScreen();
      });
      await fireEvent.press(screen.getByTestId('open-third-modal'));
      await waitFor(() => {
        expect(screen.getByTestId('close-modal-flow')).toBeOnTheScreen();
      });
      if (closeMethod === 'back') {
        await act(() => navigationRef.goBack());
      } else {
        await fireEvent.press(screen.getByTestId('close-modal-flow'));
      }

      await waitFor(() => {
        expect(screen.getByTestId('home')).toBeOnTheScreen();
        expect(screen.queryByTestId('close-modal-flow')).not.toBeOnTheScreen();
      });
      const rootState = getRootNavigationState(navigationRef);
      expect(rootState.routes.map(route => route.name)).toEqual(['home']);
      expect(rootState.index).toBe(0);
    },
  );

  test('closes a modal after pushing within it', async () => {
    const navigationRef = createNavigationContainerRef();
    const mockFetch = fetchFactory([
      [
        'http://myapp.com/push-in-modal-document',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root" type="stack">
              <nav-route
                id="home"
                href="http://myapp.com/push-in-modal-home"
              />
            </navigator>
          </doc>
        `,
      ],
      [
        'http://myapp.com/push-in-modal-home',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view
                  id="open-modal"
                  action="new"
                  href="http://myapp.com/push-in-modal-step-one"
                >
                  <text>Open modal</text>
                </view>
                <text id="home">Home</text>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/push-in-modal-step-one',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view
                  id="push"
                  action="push"
                  href="http://myapp.com/push-in-modal-step-two"
                >
                  <text>Push</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/push-in-modal-step-two',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view id="close" action="close">
                  <text>Close</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
      ],
    ]);

    await render(
      <NavigationContainer ref={navigationRef}>
        <Hyperview
          entrypointUrl="http://myapp.com/push-in-modal-document"
          fetch={mockFetch}
          formatDate={formatDate}
        />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('open-modal')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('open-modal'));
    await waitFor(() => {
      expect(screen.getByTestId('push')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('push'));
    await waitFor(() => {
      expect(screen.getByTestId('close')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('close'));

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeOnTheScreen();
      expect(screen.queryByTestId('close')).not.toBeOnTheScreen();
    });
    const rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual(['home']);
    expect(rootState.index).toBe(0);
  });

  test('unwinds a pushed screen and modal through an event', async () => {
    const navigationRef = createNavigationContainerRef();
    const mockFetch = fetchFactory([
      [
        'http://myapp.com/push-then-modal-document',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root" type="stack">
              <nav-route
                id="home"
                href="http://myapp.com/push-then-modal-home"
              />
            </navigator>
          </doc>
        `,
      ],
      [
        'http://myapp.com/push-then-modal-home',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view
                  id="push"
                  action="push"
                  href="http://myapp.com/push-then-modal-card"
                >
                  <text>Push</text>
                </view>
                <text id="home">Home</text>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/push-then-modal-card',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <behavior
                  trigger="on-event"
                  event-name="push-done"
                  action="back"
                />
                <view
                  id="open-modal"
                  action="new"
                  href="http://myapp.com/push-then-modal-done"
                >
                  <text>Open modal</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/push-then-modal-done',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <behavior
                  trigger="on-event"
                  event-name="push-done"
                  action="back"
                />
                <behavior
                  trigger="load"
                  delay="10"
                  action="dispatch-event"
                  event-name="push-done"
                  once="true"
                />
                <text id="done">Done</text>
              </body>
            </screen>
          </doc>
        `,
      ],
    ]);

    await render(
      <NavigationContainer ref={navigationRef}>
        <Hyperview
          entrypointUrl="http://myapp.com/push-then-modal-document"
          fetch={mockFetch}
          formatDate={formatDate}
        />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('push')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('push'));
    await waitFor(() => {
      expect(screen.getByTestId('open-modal')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('open-modal'));

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeOnTheScreen();
      expect(screen.queryByTestId('done')).not.toBeOnTheScreen();
    });
    const rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual(['home']);
    expect(rootState.index).toBe(0);
  });

  test('loads a replacement URL once before updating its route', async () => {
    const navigationRef = createNavigationContainerRef();
    const getCurrentUrl = () =>
      (navigationRef.getCurrentRoute() as
        | { params?: { url?: string } }
        | undefined)?.params?.url;
    let resolveDestination: (body: string) => void = () => undefined;
    const destinationBody = new Promise<string>(resolve => {
      resolveDestination = resolve;
    });
    const destinationUrl = 'http://myapp.com/replacement-destination';
    const destinationXml = `
      <doc xmlns="https://hyperview.org/hyperview">
        <screen>
          <body>
            <text id="destination">Destination</text>
          </body>
        </screen>
      </doc>
    `;
    const destinationRouteUrls: Array<string | undefined> = [];
    const mockFetch = jest.fn(async url => {
      if (url.includes('replacement-document')) {
        return new Response(
          `
            <doc xmlns="https://hyperview.org/hyperview">
              <navigator id="root" type="stack">
                <nav-route id="home" href="http://myapp.com/replacement-home" />
              </navigator>
            </doc>
          `,
          { status: 200 },
        );
      }
      if (url.includes('replacement-home')) {
        return new Response(
          `
            <doc xmlns="https://hyperview.org/hyperview">
              <screen>
                <body>
                  <view
                    id="load-destination"
                    action="reload"
                    href="${destinationUrl}"
                  />
                </body>
              </screen>
            </doc>
          `,
          { status: 200 },
        );
      }
      if (url.includes(destinationUrl)) {
        destinationRouteUrls.push(getCurrentUrl());
        return new Response(await destinationBody, { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    });

    await render(
      <>
        <NavigationContainer ref={navigationRef}>
          <Hyperview
            entrypointUrl="http://myapp.com/replacement-document"
            fetch={mockFetch}
            formatDate={formatDate}
          />
        </NavigationContainer>
        <Pressable
          onPress={() => resolveDestination(destinationXml)}
          testID="resolve-destination"
        />
      </>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('load-destination')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('load-destination'));

    await waitFor(() => {
      expect(
        mockFetch.mock.calls.filter(([url]) => url === destinationUrl),
      ).toHaveLength(1);
    });
    expect(getCurrentUrl()).not.toBe(destinationUrl);

    await fireEvent.press(screen.getByTestId('resolve-destination'));

    await waitFor(() => {
      expect(screen.getByTestId('destination')).toBeOnTheScreen();
      expect(getCurrentUrl()).toBe(destinationUrl);
    });
    expect(destinationRouteUrls).toEqual(['http://myapp.com/replacement-home']);
    expect(
      mockFetch.mock.calls.filter(([url]) => url === destinationUrl),
    ).toHaveLength(1);
  });

  test('keeps the screen under a modal when a pushed child close races an event close', async () => {
    const navigationRef = createNavigationContainerRef();
    const mockFetch = fetchFactory([
      [
        'http://myapp.com/leave-flow-document',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root" type="stack">
              <nav-route id="home" href="http://myapp.com/leave-flow-home" />
            </navigator>
          </doc>
        `,
      ],
      [
        'http://myapp.com/leave-flow-home',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view
                  id="open-details"
                  action="new"
                  href="http://myapp.com/leave-flow-details"
                >
                  <text>Open details</text>
                </view>
                <text id="home">Home</text>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/leave-flow-details',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text id="details">Gig details</text>
                <view
                  id="open-options"
                  action="new"
                  href="http://myapp.com/leave-flow-options"
                >
                  <text>Open options</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/leave-flow-options',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <behavior
                  trigger="on-event"
                  event-name="leave-done"
                  action="close"
                />
                <view
                  id="open-form"
                  action="push"
                  href="http://myapp.com/leave-flow-form"
                >
                  <text>Open form</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/leave-flow-form',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <behavior
                  trigger="load"
                  action="dispatch-event"
                  event-name="leave-done"
                  once="true"
                />
                <text id="form">Leave form</text>
              </body>
            </screen>
          </doc>
        `,
      ],
    ]);

    await render(
      <NavigationContainer ref={navigationRef}>
        <Hyperview
          entrypointUrl="http://myapp.com/leave-flow-document"
          fetch={mockFetch}
          formatDate={formatDate}
        />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('open-details')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('open-details'));
    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('open-options'));
    await waitFor(() => {
      expect(screen.getByTestId('open-form')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('open-form'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeOnTheScreen();
      expect(screen.queryByTestId('home')).not.toBeOnTheScreen();
      expect(screen.queryByTestId('form')).not.toBeOnTheScreen();
    });
    const rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual([
      'home',
      'modal',
    ]);
    expect(rootState.index).toBe(1);
  });

  test('triggers a load behavior once when a route is first shown', async () => {
    const mockFetch = fetchFactory([
      [
        'http://myapp.com/load-once-document',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root" type="stack">
              <nav-route id="home" href="http://myapp.com/load-once-home" />
            </navigator>
          </doc>
        `,
      ],
      [
        'http://myapp.com/load-once-home',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view id="slot">
                  <behavior
                    action="replace-inner"
                    href="http://myapp.com/load-once-fragment"
                    target="slot"
                    trigger="load"
                  />
                </view>
                <text id="home">Home</text>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/load-once-fragment',
        `
          <view xmlns="https://hyperview.org/hyperview">
            <text id="fragment">Fragment</text>
          </view>
        `,
      ],
    ]);

    await render(
      <NavigationContainer>
        <Hyperview
          entrypointUrl="http://myapp.com/load-once-document"
          fetch={mockFetch}
          formatDate={formatDate}
        />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('fragment')).toBeOnTheScreen();
    });

    const fragmentRequests = mockFetch.mock.calls.filter(([url]) =>
      String(url).includes('load-once-fragment'),
    );
    expect(fragmentRequests).toHaveLength(1);
  });

  test('does not re-trigger a load behavior when returning to a route', async () => {
    const mockFetch = fetchFactory([
      [
        'http://myapp.com/load-return-document',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root" type="stack">
              <nav-route id="home" href="http://myapp.com/load-return-home" />
            </navigator>
          </doc>
        `,
      ],
      [
        'http://myapp.com/load-return-home',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view id="slot">
                  <behavior
                    action="replace-inner"
                    href="http://myapp.com/load-return-fragment"
                    target="slot"
                    trigger="load"
                  />
                </view>
                <view
                  action="push"
                  href="http://myapp.com/load-return-detail"
                  id="open-detail"
                >
                  <text>Open detail</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/load-return-detail',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view action="back" href="#" id="go-back">
                  <text>Go back</text>
                </view>
                <text id="detail">Detail</text>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/load-return-fragment',
        `
          <view xmlns="https://hyperview.org/hyperview">
            <text id="fragment">Fragment</text>
          </view>
        `,
      ],
    ]);

    const navigationRef = createNavigationContainerRef();

    await render(
      <NavigationContainer ref={navigationRef}>
        <Hyperview
          entrypointUrl="http://myapp.com/load-return-document"
          fetch={mockFetch}
          formatDate={formatDate}
        />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('open-detail')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('open-detail'));
    await waitFor(() => {
      expect(screen.getByTestId('detail')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('go-back'));
    await waitFor(() => {
      expect(screen.getByTestId('open-detail')).toBeOnTheScreen();
    });

    const fragmentRequests = mockFetch.mock.calls.filter(([url]) =>
      String(url).includes('load-return-fragment'),
    );
    expect(fragmentRequests).toHaveLength(1);
    const rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual(['home']);
    expect(rootState.index).toBe(0);
  });

  test('continues repeated close removals through registered back behaviors', async () => {
    const navigationRef = createNavigationContainerRef();
    const mockFetch = fetchFactory([
      [
        'http://myapp.com/back-close-document',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root" type="stack">
              <nav-route id="home" href="http://myapp.com/back-close-home" />
            </navigator>
          </doc>
        `,
      ],
      [
        'http://myapp.com/back-close-home',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view
                  action="new"
                  href="http://myapp.com/back-close-guarded"
                  id="open-guarded"
                >
                  <text>Open guarded screen</text>
                </view>
                <text id="home">Home</text>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/back-close-guarded',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view id="back-behaviors">
                  <behavior
                    action="hide"
                    target="back-behaviors"
                    trigger="back"
                  />
                  <behavior action="close" trigger="back" />
                  <behavior
                    action="dispatch-event"
                    event-name="payment-success-close"
                    trigger="back"
                  />
                </view>
                <view id="close">
                  <behavior
                    action="dispatch-event"
                    event-name="payment-success-close"
                  />
                  <behavior action="close" />
                  <text>Close</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
      ],
    ]);

    await render(
      <NavigationContainer ref={navigationRef}>
        <Hyperview
          entrypointUrl="http://myapp.com/back-close-document"
          fetch={mockFetch}
          formatDate={formatDate}
        />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('open-guarded')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('open-guarded'));
    await waitFor(() => {
      expect(screen.getByTestId('close')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('close'));

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeOnTheScreen();
      expect(screen.queryByTestId('close')).not.toBeOnTheScreen();
    });
    let rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual(['home']);
    expect(rootState.index).toBe(0);

    await fireEvent.press(screen.getByTestId('open-guarded'));
    await waitFor(() => {
      expect(screen.getByTestId('close')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('close'));
    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeOnTheScreen();
      expect(screen.queryByTestId('close')).not.toBeOnTheScreen();
    });
    rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual(['home']);
    expect(rootState.index).toBe(0);
  });

  test('blocks route removal while a visible back behavior is registered', async () => {
    const navigationRef = createNavigationContainerRef();
    const mockFetch = fetchFactory([
      [
        'http://myapp.com/back-behavior-document',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root" type="stack">
              <nav-route id="home" href="http://myapp.com/back-behavior-home" />
            </navigator>
          </doc>
        `,
      ],
      [
        'http://myapp.com/back-behavior-home',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view
                  action="push"
                  href="http://myapp.com/back-behavior-guarded"
                  id="open-guarded"
                >
                  <text>Open guarded screen</text>
                </view>
                <text id="home">Home</text>
              </body>
            </screen>
          </doc>
        `,
      ],
      [
        'http://myapp.com/back-behavior-guarded',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view id="back-behavior">
                  <behavior
                    action="hide"
                    target="back-behavior"
                    trigger="back"
                  />
                  <text>Back behavior</text>
                </view>
                <text id="guarded">Guarded screen</text>
              </body>
            </screen>
          </doc>
        `,
      ],
    ]);

    await render(
      <NavigationContainer ref={navigationRef}>
        <Hyperview
          entrypointUrl="http://myapp.com/back-behavior-document"
          fetch={mockFetch}
          formatDate={formatDate}
        />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('open-guarded')).toBeOnTheScreen();
    });
    await fireEvent.press(screen.getByTestId('open-guarded'));
    await waitFor(() => {
      expect(screen.getByTestId('guarded')).toBeOnTheScreen();
    });

    let rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual(['home', 'card']);
    expect(rootState.index).toBe(1);

    await act(() => navigationRef.goBack());

    rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual(['home', 'card']);
    expect(rootState.index).toBe(1);

    await waitFor(() => {
      expect(screen.getByTestId('guarded')).toBeOnTheScreen();
      expect(screen.queryByTestId('back-behavior')).not.toBeOnTheScreen();
    });
    rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual(['home', 'card']);
    expect(rootState.index).toBe(1);

    await act(() => navigationRef.goBack());

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeOnTheScreen();
      expect(screen.queryByTestId('guarded')).not.toBeOnTheScreen();
    });
    rootState = getRootNavigationState(navigationRef);
    expect(rootState.routes.map(route => route.name)).toEqual(['home']);
    expect(rootState.index).toBe(0);
  });
});
