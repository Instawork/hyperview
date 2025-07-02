import { render, screen, waitFor } from '@testing-library/react-native';
import Hyperview from '.';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

type FetchResponse = [string, Response];

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const navigator: FetchResponse = [
  'http://myapp.com/navigator',
  new Response(
    `
  <doc xmlns="https://hyperview.org/hyperview">
    <navigator id="root" type="stack">
      <nav-route id="home" href="http://myapp.com/home" />
    </navigator>
  </doc>
  `,
    { status: 200 },
  ),
];

export const home: FetchResponse = [
  'http://myapp.com/home',
  new Response(
    `
  <doc xmlns="https://hyperview.org/hyperview">
    <screen>
      <body>
        <text id="home-text">Hello, world!</text>
        <view
          id="partial"
          trigger="load"
          action="replace"
          target="partial"
          href="http://myapp.com/partial"
        />
        <view
          id="other-partial"
          trigger="load"
          action="replace"
          target="other-partial"
          href="http://myapp.com/other-partial"
        />
      </body>
    </screen>
  </doc>
  `,
    { status: 200 },
  ),
];

export const partial: FetchResponse = [
  'http://myapp.com/partial',
  new Response(
    `
  <view xmlns="https://hyperview.org/hyperview">
    <text id="partial-text">Partial</text>
  </view>
  `,
    { status: 200 },
  ),
];

export const otherPartial: FetchResponse = [
  'http://myapp.com/other-partial',
  new Response(
    `
  <view xmlns="https://hyperview.org/hyperview">
    <text id="other-partial-text">Other partial</text>
  </view>
  `,
    { status: 200 },
  ),
];

const fetch = jest.fn().mockImplementation(async url => {
  switch (url) {
    case navigator[0]:
      await wait(1000);
      return navigator[1];
    case home[0]:
      await wait(1000);
      return home[1];
    case partial[0]:
      await wait(1000);
      return partial[1];
    case otherPartial[0]:
      await wait(1000);
      return otherPartial[1];
    default:
      return new Response('', { status: 404 });
  }
});

const formatDate = jest.fn();

describe('Hvperview', () => {
  test('Loading remote content', async () => {
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
        const homeText = screen.getByTestId('home-text');
        const partialText = screen.getByTestId('partial-text');
        const otherPartialText = screen.getByTestId('other-partial-text');
        expect(homeText).toBeOnTheScreen();
        expect(partialText).toBeOnTheScreen();
        expect(otherPartialText).toBeOnTheScreen();
        expect(fetch).toHaveBeenCalledTimes(4);
        expect(fetch).toHaveBeenCalledWith(navigator[0], expect.anything());
        expect(fetch).toHaveBeenCalledWith(home[0], expect.anything());
        expect(fetch).toHaveBeenCalledWith(partial[0], expect.anything());
        expect(fetch).toHaveBeenCalledWith(otherPartial[0], expect.anything());
        return true;
      },
      { timeout: 5000 },
    );
  });
});
