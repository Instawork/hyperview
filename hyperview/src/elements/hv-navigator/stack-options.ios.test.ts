import {
  getStackRouteOptions,
  getStackScreenOptions,
} from './stack-options.ios';

describe('iOS stack options', () => {
  it('uses a full-screen bottom-up card for modal routes', () => {
    expect(
      getStackRouteOptions({
        isFirstScreen: false,
        usesModalPresentation: true,
      }),
    ).toEqual({
      animation: 'slide_from_bottom',
      gestureEnabled: false,
      presentation: 'card',
    });
  });

  it('disables animation for an initial card route', () => {
    expect(
      getStackRouteOptions({
        isFirstScreen: true,
        usesModalPresentation: false,
      }),
    ).toEqual({
      animation: 'none',
      gestureEnabled: true,
      presentation: 'card',
    });
  });

  it('omits JS-stack-only screen options', () => {
    expect(
      getStackScreenOptions(
        { route: { key: 'route-key', name: 'route', params: { id: 'route' } } },
        params => params?.id,
      ),
    ).toEqual({
      headerShown: false,
      title: 'route',
    });
  });
});
