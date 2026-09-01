import {
  CommonActions,
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import Hyperview from 'hyperview/src/hyperview';
import { Pressable } from 'react-native';
import React from 'react';
import { fetchFactory } from 'hyperview/test/helpers/fetch';

describe.each([false, true])(
  'Hyperview navigation sequences (native routes: %s)',
  enableNativeRoutes => {
    const formatDate = jest.fn();

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

      render(
        <NavigationContainer ref={navigationRef}>
          <Hyperview
            enableNativeRoutes={enableNativeRoutes}
            entrypointUrl="http://myapp.com/back-behavior-document"
            fetch={mockFetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('open-guarded')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('open-guarded'));
      await waitFor(() => {
        expect(screen.getByTestId('guarded')).toBeOnTheScreen();
      });

      act(() => navigationRef.goBack());

      await waitFor(() => {
        expect(screen.getByTestId('guarded')).toBeOnTheScreen();
        expect(screen.queryByTestId('back-behavior')).not.toBeOnTheScreen();
      });

      act(() => navigationRef.goBack());

      await waitFor(() => {
        expect(screen.getByTestId('home')).toBeOnTheScreen();
        expect(screen.queryByTestId('guarded')).not.toBeOnTheScreen();
      });
    });

    test('continues a back removal through a registered close behavior', async () => {
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

      render(
        <NavigationContainer>
          <Hyperview
            enableNativeRoutes={enableNativeRoutes}
            entrypointUrl="http://myapp.com/back-close-document"
            fetch={mockFetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('open-guarded')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('open-guarded'));
      await waitFor(() => {
        expect(screen.getByTestId('close')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('close'));

      await waitFor(() => {
        expect(screen.getByTestId('home')).toBeOnTheScreen();
        expect(screen.queryByTestId('close')).not.toBeOnTheScreen();
      });

      fireEvent.press(screen.getByTestId('open-guarded'));
      await waitFor(() => {
        expect(screen.getByTestId('close')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('close'));
      await waitFor(() => {
        expect(screen.getByTestId('home')).toBeOnTheScreen();
        expect(screen.queryByTestId('close')).not.toBeOnTheScreen();
      });
    });

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
              enableNativeRoutes={enableNativeRoutes}
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

      render(
        <NavigationContainer ref={navigationRef}>
          <Hyperview
            enableNativeRoutes={enableNativeRoutes}
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
      const rootState = navigationRef.getRootState();
      expect(rootState.routes.map(route => route.name)).toEqual([
        'home',
        'card',
      ]);
      expect(rootState.index).toBe(1);
    });

    test('runs adjacent back and new load behaviors after a modal push as one transition', async () => {
      const navigationRef = createNavigationContainerRef();
      const mockFetch = fetchFactory([
        [
          'http://myapp.com/shift-transfer-document',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root" type="stack">
              <nav-route id="home" href="http://myapp.com/shift-transfer-home" />
            </navigator>
          </doc>
        `,
        ],
        [
          'http://myapp.com/shift-transfer-home',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view
                  id="open-connections"
                  action="new"
                  href="http://myapp.com/shift-transfer-connections"
                >
                  <text>Open connections</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
        ],
        [
          'http://myapp.com/shift-transfer-connections',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view
                  id="open-confirmation"
                  action="push"
                  href="http://myapp.com/shift-transfer-confirmation"
                >
                  <text>Open confirmation</text>
                </view>
                <text id="connections">Connections</text>
              </body>
            </screen>
          </doc>
        `,
        ],
        [
          'http://myapp.com/shift-transfer-confirmation',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view id="shift-transfer-confirm-content">
                  <view id="confirm-transfer">
                    <behavior
                      trigger="press"
                      action="replace-inner"
                      target="shift-transfer-confirm-content"
                      href="http://myapp.com/shift-transfer-success"
                      verb="post"
                    />
                    <text>Confirm</text>
                  </view>
                  <text id="confirmation">Confirmation</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
        ],
        [
          'http://myapp.com/shift-transfer-success',
          `
          <view xmlns="https://hyperview.org/hyperview">
                <behavior trigger="load" action="back" once="true" />
                <behavior
                  trigger="load"
                  action="new"
                  href="http://myapp.com/shift-transfer-destination"
                  once="true"
                />
                <behavior
                  trigger="load"
                  action="hide"
                  target="unused-toast"
                  delay="2000"
                  once="true"
                />
          </view>
        `,
        ],
        [
          'http://myapp.com/shift-transfer-destination',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text id="shift-transfer-destination">Shift details</text>
              </body>
            </screen>
          </doc>
        `,
        ],
      ]);

      render(
        <NavigationContainer ref={navigationRef}>
          <Hyperview
            enableNativeRoutes={enableNativeRoutes}
            entrypointUrl="http://myapp.com/shift-transfer-document"
            fetch={mockFetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('open-connections')).toBeOnTheScreen();
      });
      if (enableNativeRoutes) {
        act(() =>
          navigationRef.dispatch(
            CommonActions.navigate('modal', {
              url: 'http://myapp.com/shift-transfer-connections',
            }),
          ),
        );
      } else {
        fireEvent.press(screen.getByTestId('open-connections'));
      }
      await waitFor(() => {
        expect(screen.getByTestId('connections')).toBeOnTheScreen();
      });
      if (enableNativeRoutes) {
        const modalParams = navigationRef.getRootState().routes[1]?.params as
          | { needsSubStack?: boolean }
          | undefined;
        expect(modalParams?.needsSubStack).toBe(true);
      }
      fireEvent.press(screen.getByTestId('open-confirmation'));
      await waitFor(() => {
        expect(screen.getByTestId('confirm-transfer')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('confirm-transfer'));

      await waitFor(() => {
        expect(
          screen.getByTestId('shift-transfer-destination'),
        ).toBeOnTheScreen();
        expect(screen.queryByTestId('confirmation')).not.toBeOnTheScreen();
      });
      const rootState = navigationRef.getRootState();
      expect(rootState.routes.map(route => route.name)).toEqual([
        'home',
        'modal',
      ]);
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

        render(
          <NavigationContainer>
            <Hyperview
              enableNativeRoutes={enableNativeRoutes}
              entrypointUrl="http://myapp.com/event-reload-document"
              fetch={mockFetch}
              formatDate={formatDate}
            />
          </NavigationContainer>,
        );

        await waitFor(() => {
          expect(screen.getByTestId('open-details')).toBeOnTheScreen();
        });
        fireEvent.press(screen.getByTestId('open-details'));

        await waitFor(() => {
          expect(screen.getByTestId('refreshed-details')).toBeOnTheScreen();
          expect(screen.queryByTestId('modal')).not.toBeOnTheScreen();
          expect(screen.queryByTestId('home')).not.toBeOnTheScreen();
        });
      },
    );

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
            enableNativeRoutes={enableNativeRoutes}
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

    test('retires a welcome modal when navigating into a tab route', async () => {
      // Mirrors backend/templates/worker/app/base.xml: the tabs sit at the
      // bottom of the root stack and a welcome modal is stacked above them,
      // so navigating to a tab route retargets a parent below the top. On
      // device the modal stayed up, covering the tab bar, and the run
      // stranded looking for a tab it could no longer reach.
      const mockFetch = fetchFactory([
        [
          'http://myapp.com/welcome-tabs-document',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root-navigator" type="stack">
              <nav-route id="tabs-route">
                <navigator id="tabs-navigator" type="tab" merge="true">
                  <nav-route id="shifts-route" href="http://myapp.com/welcome-tabs-shifts" />
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
                <view action="close" href="#" id="book-first">
                  <text>Book your first shift</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
        ],
        [
          'http://myapp.com/welcome-tabs-shifts',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text id="shifts">Open shifts</text>
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

      render(
        <NavigationContainer>
          <Hyperview
            enableNativeRoutes={enableNativeRoutes}
            entrypointUrl="http://myapp.com/welcome-tabs-document"
            fetch={mockFetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('book-first')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('book-first'));

      await waitFor(() => {
        expect(screen.getByTestId('shifts')).toBeOnTheScreen();
      });
      // The device symptom: the shifts screen rendered underneath a modal that
      // was never dismissed, which is why the tab bar had gone missing.
      expect(screen.queryByTestId('welcome')).not.toBeOnTheScreen();

      fireEvent.press(screen.getByTestId('go-messages'));

      await waitFor(() => {
        expect(screen.getByTestId('messages')).toBeOnTheScreen();
      });
      expect(screen.queryByTestId('welcome')).not.toBeOnTheScreen();
    });

    test('closes an entire flow containing nested modals', async () => {
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
                  id="open-details"
                  action="push"
                  href="http://myapp.com/nested-modal-details"
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
          'http://myapp.com/nested-modal-details',
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
                <text id="details">Details</text>
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
        <NavigationContainer ref={navigationRef}>
          <Hyperview
            enableNativeRoutes={enableNativeRoutes}
            entrypointUrl="http://myapp.com/nested-modal-document"
            fetch={mockFetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('open-details')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('open-details'));
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

      // Each modal closes itself, so the route which presented the first modal
      // has to survive the cascade
      await waitFor(() => {
        expect(screen.getByTestId('details')).toBeOnTheScreen();
        expect(screen.queryByTestId('close-modal-flow')).not.toBeOnTheScreen();
      });
      const rootState = navigationRef.getRootState();
      expect(rootState.routes.map(route => route.name)).toEqual([
        'home',
        'card',
      ]);
      expect(rootState.index).toBe(1);
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
            enableNativeRoutes={enableNativeRoutes}
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
                <view id="finish">
                  <behavior
                    action="dispatch-event"
                    event-name="push-done"
                  />
                  <text>Finish</text>
                </view>
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
            enableNativeRoutes={enableNativeRoutes}
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
        expect(screen.getByTestId('finish')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('finish'));

      await waitFor(() => {
        expect(screen.getByTestId('home')).toBeOnTheScreen();
        expect(screen.queryByTestId('done')).not.toBeOnTheScreen();
      });
    });

    test('keeps a focused confirmation when a background route at index 0 goes back', async () => {
      const mockFetch = fetchFactory([
        [
          'http://myapp.com/index-zero-back-document',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root" type="stack">
              <nav-route
                id="home"
                href="http://myapp.com/index-zero-back-selection"
              />
            </navigator>
          </doc>
        `,
        ],
        [
          'http://myapp.com/index-zero-back-selection',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <behavior
                  trigger="on-event"
                  event-name="booking-done"
                  action="back"
                />
                <view
                  id="open-confirmation"
                  action="push"
                  href="http://myapp.com/index-zero-back-confirmation"
                >
                  <text>Open confirmation</text>
                </view>
                <text id="selection">Selection</text>
              </body>
            </screen>
          </doc>
        `,
        ],
        [
          'http://myapp.com/index-zero-back-confirmation',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view id="finish">
                  <behavior
                    action="dispatch-event"
                    event-name="booking-done"
                  />
                  <text>Finish</text>
                </view>
                <text id="confirmation">Confirmation</text>
              </body>
            </screen>
          </doc>
        `,
        ],
      ]);

      render(
        <NavigationContainer>
          <Hyperview
            enableNativeRoutes={enableNativeRoutes}
            entrypointUrl="http://myapp.com/index-zero-back-document"
            fetch={mockFetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('open-confirmation')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('open-confirmation'));
      await waitFor(() => {
        expect(screen.getByTestId('confirmation')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('finish'));

      await waitFor(() => {
        expect(screen.getByTestId('confirmation')).toBeOnTheScreen();
        expect(screen.queryByTestId('selection')).not.toBeOnTheScreen();
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
              enableNativeRoutes={enableNativeRoutes}
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
      expect(destinationRouteUrls).toEqual([
        'http://myapp.com/replacement-home',
      ]);
      expect(
        mockFetch.mock.calls.filter(([url]) => url === destinationUrl),
      ).toHaveLength(1);
    });

    test('keeps the screen under a modal when a pushed child close races an event close', async () => {
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

      render(
        <NavigationContainer>
          <Hyperview
            enableNativeRoutes={enableNativeRoutes}
            entrypointUrl="http://myapp.com/leave-flow-document"
            fetch={mockFetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('open-details')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('open-details'));
      await waitFor(() => {
        expect(screen.getByTestId('details')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('open-options'));
      await waitFor(() => {
        expect(screen.getByTestId('open-form')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('open-form'));

      await waitFor(() => {
        expect(screen.getByTestId('details')).toBeOnTheScreen();
        expect(screen.queryByTestId('home')).not.toBeOnTheScreen();
        expect(screen.queryByTestId('form')).not.toBeOnTheScreen();
      });
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

      render(
        <NavigationContainer>
          <Hyperview
            enableNativeRoutes={enableNativeRoutes}
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

      render(
        <NavigationContainer>
          <Hyperview
            enableNativeRoutes={enableNativeRoutes}
            entrypointUrl="http://myapp.com/load-return-document"
            fetch={mockFetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('open-detail')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('open-detail'));
      await waitFor(() => {
        expect(screen.getByTestId('detail')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('go-back'));
      await waitFor(() => {
        expect(screen.getByTestId('open-detail')).toBeOnTheScreen();
      });

      const fragmentRequests = mockFetch.mock.calls.filter(([url]) =>
        String(url).includes('load-return-fragment'),
      );
      expect(fragmentRequests).toHaveLength(1);
    });

    test('keeps a pushed screen when navigating to a tab route', async () => {
      const mockFetch = fetchFactory([
        [
          'http://myapp.com/tabs-document',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root" type="stack">
              <nav-route id="tabs">
                <navigator id="tabs-nav" type="tab">
                  <nav-route id="shifts" href="http://myapp.com/tabs-shifts" />
                  <nav-route id="messages" href="http://myapp.com/tabs-messages" />
                </navigator>
              </nav-route>
            </navigator>
          </doc>
        `,
        ],
        [
          'http://myapp.com/tabs-shifts',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view
                  action="push"
                  href="http://myapp.com/tabs-card"
                  id="open-card"
                >
                  <text>Open card</text>
                </view>
              </body>
            </screen>
          </doc>
        `,
        ],
        [
          'http://myapp.com/tabs-messages',
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
        [
          'http://myapp.com/tabs-card',
          `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text id="card">Card</text>
                <view action="navigate" href="#messages" id="go-messages">
                  <text>Go to messages</text>
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
            enableNativeRoutes={enableNativeRoutes}
            entrypointUrl="http://myapp.com/tabs-document"
            fetch={mockFetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('open-card')).toBeOnTheScreen();
      });
      fireEvent.press(screen.getByTestId('open-card'));
      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeOnTheScreen();
      });

      // The storybook regression: a bare navigate to a tab route retargeted
      // the tabs and popped the pushed screen off the stack behind it.
      fireEvent.press(screen.getByTestId('go-messages'));

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeOnTheScreen();
      });
    });
  },
);
