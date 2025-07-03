import { render, screen, waitFor } from '@testing-library/react-native';
import Hyperview from '.';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

type FetchResponse = [string, Response];

export const navigator: FetchResponse = [
  'http://myapp.com/navigator',
  new Response(
    `
     <doc xmlns="https://hyperview.org/hyperview">
      <navigator id="root" type="stack">
        <nav-route id="home" href="http://myapp.com/behavior-view" />
      </navigator>
    </doc>
  `,
    { status: 200 },
  ),
];

export const navigator2: FetchResponse = [
  'http://myapp.com/navigator2',
  new Response(
    `
     <doc xmlns="https://hyperview.org/hyperview">
      <navigator id="root" type="stack">
        <nav-route id="home" href="http://myapp.com/view-as-behavior" />
      </navigator>
    </doc>
  `,
    { status: 200 },
  ),
];

/**
 * Test for a view which has two behaviors which originally caused a bug.
 * - The first behavior shows the view mutates the dom by calling 'show' on the view.
 * - The second behavior replaces the view by calling 'replace' on the view.
 * - The second behavior would originallyfail because the target
 * will have been orphaned by the first behavior.
 * - If the behaviors included `id` attributes, the bug would not occur.
 */
export const behaviorView: FetchResponse = [
  'http://myapp.com/behavior-view',
  new Response(
    `
    <doc xmlns="https://hyperview.org/hyperview">
      <screen>
        <body>
          <text id="behavior-view-text">Behavior View</text>
          <view id="replacement-view">
            <!-- This behavior immediately mutates the dom -->
            <behavior
              action="show"
              trigger="load"
              target="replacement-view"
              once="true"
            />

            <!-- This behavior would fail because the target will have been orphaned by the first behavior. -->
            <behavior
              action="replace"
              trigger="load"
              href="http://myapp.com/replacement-1"
              once="true"
              delay="10"
            />
          </view>
        </body>
      </screen>
    </doc>
  `,
    { status: 200 },
  ),
];

/**
 * Test for a view which has a behavior which mutates the dom by calling 'show' on the view.
 * - The second behavior replaces the view by calling 'replace' on the view.
 * - The second behavior would fail because the target
 * will have been orphaned by the first behavior.
 * - If the views included `id` attributes, the bug would not occur.
 */
export const viewAsBehavior: FetchResponse = [
  'http://myapp.com/view-as-behavior',
  new Response(
    `
    <doc xmlns="https://hyperview.org/hyperview">
      <screen>
        <body>
          <text id="behavior-view-text">Behavior View</text>
          <view id="replacement-view">
            <!-- This behavior immediately mutates the dom -->
            <view
              action="show"
              trigger="load"
              target="replacement-view"
              once="true"
            />

            <!-- This behavior would fail because the target will have been orphaned by the first behavior. -->
            <view
              action="replace"
              trigger="load"
              href="http://myapp.com/replacement-1"
              once="true"
              delay="10"
              target="replacement-view"
            />
          </view>
        </body>
      </screen>
    </doc>
  `,
    { status: 200 },
  ),
];

/**
 * Test content for the view which is replaced by the behavior.
 */
export const replacement1: FetchResponse = [
  'http://myapp.com/replacement-1',
  new Response(
    `
    <view xmlns="https://hyperview.org/hyperview" id="replacement-1">
      <text id="replacement-1-text">Replacement 1</text>
    </view>
  `,
    { status: 200 },
  ),
];

const fetch = jest.fn().mockImplementation(async url => {
  switch (url) {
    case navigator[0]:
      return navigator[1];
    case navigator2[0]:
      return navigator2[1];
    case behaviorView[0]:
      return behaviorView[1];
    case replacement1[0]:
      return replacement1[1];
    case viewAsBehavior[0]:
      return viewAsBehavior[1];
    default:
      return new Response('', { status: 404 });
  }
});

const formatDate = jest.fn();

describe('Hyperview', () => {
  describe('Behaviors', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    /**
     * Test for a view which has two behaviors which originally caused a bug.
     * Uses the `behaviorView` test content.
     */
    test('Replace behavior', async () => {
      render(
        <NavigationContainer>
          <Hyperview
            entrypointUrl={navigator[0]}
            fetch={fetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );

      await waitFor(
        () => {
          expect(fetch).toHaveBeenCalledTimes(3);
          expect(fetch).toHaveBeenCalledWith(navigator[0], expect.anything());
          expect(fetch).toHaveBeenCalledWith(
            behaviorView[0],
            expect.anything(),
          );
          expect(fetch).toHaveBeenCalledWith(
            replacement1[0],
            expect.anything(),
          );
          const behaviorViewText = screen.getByTestId('behavior-view-text');
          expect(behaviorViewText).toBeOnTheScreen();
          const replacementViewText = screen.getByTestId('replacement-1-text');
          expect(replacementViewText).toBeOnTheScreen();
          return true;
        },
        { timeout: 1000 },
      );
    });
  });

  /**
   * Test for a view which has a views with behavior attributes
   * which mutate the dom by calling 'show' on the view.
   * - The second behavior replaces the view by calling 'replace' on the view.
   * - The second behavior would fail because the target
   * will have been orphaned by the first behavior.
   */
  describe.only('View as behavior', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    /**
     * Test for a view which has two behaviors which originally caused a bug.
     * Uses the `viewAsBehavior` test content.
     */
    test('Replace behavior as view', async () => {
      render(
        <NavigationContainer>
          <Hyperview
            entrypointUrl={navigator2[0]}
            fetch={fetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );

      await waitFor(
        () => {
          expect(fetch).toHaveBeenCalledTimes(3);
          expect(fetch).toHaveBeenCalledWith(navigator2[0], expect.anything());
          expect(fetch).toHaveBeenCalledWith(
            viewAsBehavior[0],
            expect.anything(),
          );
          expect(fetch).toHaveBeenCalledWith(
            replacement1[0],
            expect.anything(),
          );
          const behaviorViewText = screen.getByTestId('behavior-view-text');
          expect(behaviorViewText).toBeOnTheScreen();
          const replacementViewText = screen.getByTestId('replacement-1-text');
          expect(replacementViewText).toBeOnTheScreen();
          return true;
        },
        { timeout: 1000 },
      );
    });
  });
});
