import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import Hyperview from './hyperview';
import { Pressable } from 'react-native';
import React from 'react';
import { fetchFactory } from 'hyperview/test/helpers/fetch';

describe('Hyperview navigation sequences', () => {
  const formatDate = jest.fn();

  test.each(['new', 'push'])(
    'runs adjacent close and %s load behaviors as one transition',
    async action => {
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

      render(
        <NavigationContainer>
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
    },
  );

  test('runs adjacent close and push press behaviors as one transition', async () => {
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

    render(
      <NavigationContainer>
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
    fireEvent.press(screen.getByTestId('get-started'));

    await waitFor(() => {
      expect(screen.getByTestId('community-form')).toBeOnTheScreen();
      expect(screen.queryByTestId('intro')).not.toBeOnTheScreen();
    });
  });

  test('closes a named route marked as a modal', async () => {
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

    render(
      <NavigationContainer>
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
    fireEvent.press(screen.getByTestId('close-welcome'));

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeOnTheScreen();
      expect(screen.queryByTestId('close-welcome')).not.toBeOnTheScreen();
    });
  });

  test('closes an entire flow containing nested modals', async () => {
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

    render(
      <NavigationContainer>
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
    fireEvent.press(screen.getByTestId('open-first-modal'));
    await waitFor(() => {
      expect(screen.getByTestId('open-second-modal')).toBeOnTheScreen();
    });
    fireEvent.press(screen.getByTestId('open-second-modal'));
    await waitFor(() => {
      expect(screen.getByTestId('open-third-modal')).toBeOnTheScreen();
    });
    fireEvent.press(screen.getByTestId('open-third-modal'));
    await waitFor(() => {
      expect(screen.getByTestId('close-modal-flow')).toBeOnTheScreen();
    });
    fireEvent.press(screen.getByTestId('close-modal-flow'));

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeOnTheScreen();
      expect(screen.queryByTestId('close-modal-flow')).not.toBeOnTheScreen();
    });
  });

  test('closes a modal after pushing within it', async () => {
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

    render(
      <NavigationContainer>
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
    fireEvent.press(screen.getByTestId('open-modal'));
    await waitFor(() => {
      expect(screen.getByTestId('push')).toBeOnTheScreen();
    });
    fireEvent.press(screen.getByTestId('push'));
    await waitFor(() => {
      expect(screen.getByTestId('close')).toBeOnTheScreen();
    });
    fireEvent.press(screen.getByTestId('close'));

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeOnTheScreen();
      expect(screen.queryByTestId('close')).not.toBeOnTheScreen();
    });
  });

  test('unwinds a pushed screen and modal through an event', async () => {
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

    render(
      <NavigationContainer>
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
    fireEvent.press(screen.getByTestId('push'));
    await waitFor(() => {
      expect(screen.getByTestId('open-modal')).toBeOnTheScreen();
    });
    fireEvent.press(screen.getByTestId('open-modal'));

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeOnTheScreen();
      expect(screen.queryByTestId('done')).not.toBeOnTheScreen();
    });
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

    render(
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
    fireEvent.press(screen.getByTestId('load-destination'));

    await waitFor(() => {
      expect(
        mockFetch.mock.calls.filter(([url]) => url === destinationUrl),
      ).toHaveLength(1);
    });
    expect(getCurrentUrl()).not.toBe(destinationUrl);

    fireEvent.press(screen.getByTestId('resolve-destination'));

    await waitFor(() => {
      expect(screen.getByTestId('destination')).toBeOnTheScreen();
      expect(getCurrentUrl()).toBe(destinationUrl);
    });
    expect(destinationRouteUrls).toEqual(['http://myapp.com/replacement-home']);
    expect(
      mockFetch.mock.calls.filter(([url]) => url === destinationUrl),
    ).toHaveLength(1);
  });
});
