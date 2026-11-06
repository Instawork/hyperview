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
import Hyperview from 'hyperview/src/hyperview';
import React from 'react';
import type { RouteProps } from 'hyperview/src/types';
import { fetchFactory } from 'hyperview/test/helpers/fetch';

describe('Hyperview route lifecycle', () => {
  it('reports route identities when a new route focuses', async () => {
    const navigationRef = createNavigationContainerRef();
    const events: Array<{ route: RouteProps; type: 'blur' | 'focus' }> = [];
    const onRouteBlur = jest.fn((route: RouteProps) => {
      events.push({ route, type: 'blur' });
    });
    const onRouteFocus = jest.fn((route: RouteProps) => {
      events.push({ route, type: 'focus' });
    });
    const mockFetch = fetchFactory([
      [
        'http://myapp.com/lifecycle-document',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <navigator id="root" type="stack">
              <nav-route id="home" href="http://myapp.com/lifecycle-home" />
            </navigator>
          </doc>
        `,
      ],
      [
        'http://myapp.com/lifecycle-home',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <view
                  action="push"
                  href="http://myapp.com/lifecycle-details"
                  id="open-details"
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
        'http://myapp.com/lifecycle-details',
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text id="details">Details</text>
              </body>
            </screen>
          </doc>
        `,
      ],
    ]);

    await render(
      <NavigationContainer ref={navigationRef}>
        <Hyperview
          entrypointUrl="http://myapp.com/lifecycle-document"
          fetch={mockFetch}
          formatDate={jest.fn()}
          onRouteBlur={onRouteBlur}
          onRouteFocus={onRouteFocus}
        />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeOnTheScreen();
      expect(onRouteFocus).toHaveBeenCalledTimes(1);
    });
    const homeRoute = navigationRef.getCurrentRoute();
    if (!homeRoute) {
      throw new Error('Expected the home route to be focused');
    }
    expect(onRouteFocus).toHaveBeenLastCalledWith(homeRoute);

    await fireEvent.press(screen.getByTestId('open-details'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeOnTheScreen();
      expect(onRouteBlur).toHaveBeenCalledTimes(1);
      expect(onRouteFocus).toHaveBeenCalledTimes(2);
    });
    const detailsRoute = navigationRef.getCurrentRoute();
    if (!detailsRoute) {
      throw new Error('Expected the details route to be focused');
    }
    expect(events).toEqual([
      { route: homeRoute, type: 'focus' },
      { route: homeRoute, type: 'blur' },
      { route: detailsRoute, type: 'focus' },
    ]);
  });
});
