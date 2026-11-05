import * as Types from './types';
import {
  CommonActions,
  NavigationState,
  StackActions,
  TabActions,
} from '@react-navigation/native';
import type {
  NavigationProps,
  RouteParams,
  RouteProps,
} from 'hyperview/src/types';
import { NAV_ACTIONS } from 'hyperview/src/types';
import { Navigator } from './navigator';

const rootState = {
  index: 0,
  key: 'stack-root',
  routeNames: ['tabs'],
  routes: [
    {
      key: 'tabs-key',
      name: 'tabs',
      state: {
        index: 0,
        key: 'tab-root',
        routeNames: ['tab-navigation'],
        routes: [
          {
            key: 'tab-navigation-key',
            name: 'tab-navigation',
          },
        ],
        stale: false,
        type: 'tab',
      },
    },
  ],
  stale: false,
  type: 'stack',
} as NavigationState;

const createNavigation = (state: NavigationState): NavigationProps => ({
  addListener: jest.fn(() => jest.fn()),
  dispatch: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(() => state),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  navigate: jest.fn(),
});

describe('Navigator.routeBackRequest', () => {
  it('removes a non-focused first route without going back from the focused route', () => {
    const state = {
      index: 2,
      key: 'stack-root',
      routeNames: ['redirect', 'confirmation', 'webview'],
      routes: [
        {
          key: 'redirect-key',
          name: 'redirect',
        },
        {
          key: 'confirmation-key',
          name: 'confirmation',
        },
        {
          key: 'webview-key',
          name: 'webview',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState;
    const navigation = createNavigation(state);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      route: {
        key: 'redirect-key',
        name: 'redirect',
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.routeBackRequest(navigation, NAV_ACTIONS.BACK, 'redirect-key');

    expect(navigation.dispatch).toHaveBeenCalledWith(
      CommonActions.reset({
        ...state,
        index: 1,
        routes: state.routes.slice(1),
      }),
    );
    expect(navigation.goBack).not.toHaveBeenCalled();
  });

  it('targets back requests from removed routes at their source navigator', () => {
    const state = {
      index: 1,
      key: 'stack-root',
      routeNames: ['home', 'card'],
      routes: [
        {
          key: 'home-key',
          name: 'home',
        },
        {
          key: 'card-key',
          name: 'card',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState;
    const navigation = createNavigation(state);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      route: {
        key: 'removed-key',
        name: 'card',
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.routeBackRequest(navigation, NAV_ACTIONS.BACK, 'removed-key');

    expect(navigation.dispatch).toHaveBeenCalledWith({
      ...CommonActions.goBack(),
      source: 'removed-key',
      target: 'stack-root',
    });
    expect(navigation.goBack).not.toHaveBeenCalled();
  });

  it('bubbles back requests from the first stack route', () => {
    const navigation = createNavigation(rootState);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      route: {
        key: 'tabs-key',
        name: 'tabs',
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.routeBackRequest(navigation, NAV_ACTIONS.BACK, 'tabs-key');

    expect(navigation.dispatch).not.toHaveBeenCalled();
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('targets the navigator containing the revealed route when setting params', () => {
    const navigation = createNavigation({
      index: 1,
      key: 'stack-root',
      routeNames: ['tabs', 'card'],
      routes: [
        {
          key: 'tabs-key',
          name: 'tabs',
        },
        {
          key: 'card-key',
          name: 'card',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState);
    const rootNavigation = ({
      getCurrentRoute: jest.fn(() => ({
        key: 'tab-navigation-key',
        name: 'tab-navigation',
      })),
      getRootState: jest.fn(() => rootState),
    } as unknown) as NonNullable<Types.Props['rootNavigation']>;
    const routeParams: RouteParams = {
      url: 'https://example.com/changed.xml',
    };
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      rootNavigation,
      route: {
        key: 'card-key',
        name: 'card',
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.routeBackRequest(
      navigation,
      NAV_ACTIONS.BACK,
      'card-key',
      routeParams,
    );

    expect(navigation.dispatch).toHaveBeenCalledWith({
      ...CommonActions.goBack(),
      source: 'card-key',
      target: 'stack-root',
    });
    expect(navigation.dispatch).toHaveBeenCalledWith({
      ...CommonActions.setParams(routeParams),
      source: 'tab-navigation-key',
      target: 'tab-root',
    });
    expect(navigation.goBack).not.toHaveBeenCalled();
  });
});

describe('Navigator.sendRequest', () => {
  it('closes the current nested modal during a modal flow event', () => {
    const parentNavigation = createNavigation({
      index: 1,
      key: 'stack-root',
      routeNames: ['tabs', 'modal'],
      routes: [
        {
          key: 'tabs-key',
          name: 'tabs',
        },
        {
          key: 'modal-key',
          name: 'modal',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState);
    const navigation = createNavigation({
      index: 1,
      key: 'modal-stack',
      routeNames: ['modal-screen', 'modal'],
      routes: [
        {
          key: 'modal-screen-key',
          name: 'modal-screen',
        },
        {
          key: 'nested-modal-key',
          name: 'modal',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState);
    (navigation.getParent as jest.Mock).mockReturnValue(parentNavigation);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      route: {
        key: 'modal-screen-key',
        name: 'modal-screen',
        params: {
          isModal: true,
        },
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.sendRequest(NAV_ACTIONS.CLOSE);

    expect(navigation.goBack).toHaveBeenCalled();
    expect(parentNavigation.goBack).not.toHaveBeenCalled();
  });

  it('closes a named modal through its modal sub-stack', () => {
    const parentNavigation = createNavigation({
      index: 1,
      key: 'stack-root',
      routeNames: ['tabs', 'welcome'],
      routes: [
        {
          key: 'tabs-key',
          name: 'tabs',
        },
        {
          key: 'welcome-key',
          name: 'welcome',
          params: {
            isModal: true,
          },
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState);
    const navigation = createNavigation({
      index: 0,
      key: 'welcome-stack',
      routeNames: ['modal-screen-welcome'],
      routes: [
        {
          key: 'modal-screen-welcome-key',
          name: 'modal-screen-welcome',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState);
    (navigation.getParent as jest.Mock).mockReturnValue(parentNavigation);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      route: {
        key: 'modal-screen-welcome-key',
        name: 'modal-screen-welcome',
        params: {
          isModal: true,
        },
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.sendRequest(NAV_ACTIONS.CLOSE);

    expect(navigation.goBack).toHaveBeenCalled();
    expect(parentNavigation.goBack).not.toHaveBeenCalled();
  });

  it('continues navigation from the parent after its route is removed', () => {
    const parentState = {
      index: 0,
      key: 'stack-root',
      routeNames: ['home'],
      routes: [
        {
          key: 'home-key',
          name: 'home',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState;
    const parentNavigation = createNavigation(parentState);
    const navigation = createNavigation({
      index: 0,
      key: 'modal-stack',
      routeNames: ['modal-screen'],
      routes: [
        {
          key: 'modal-screen-key',
          name: 'modal-screen',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState);
    (navigation.getParent as jest.Mock).mockReturnValue(parentNavigation);
    const rootNavigation = ({
      getRootState: jest.fn(() => parentState),
    } as unknown) as NonNullable<Types.Props['rootNavigation']>;
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      rootNavigation,
      route: {
        key: 'modal-screen-key',
        name: 'modal-screen',
      } as RouteProps,
      setElement: jest.fn(),
    });
    const routeParams = {
      url: 'https://example.com/destination.xml',
    };

    navigator.sendRequest(NAV_ACTIONS.PUSH, routeParams);

    expect(parentNavigation.dispatch).toHaveBeenCalledWith(
      StackActions.push('card', routeParams),
    );
    expect(navigation.dispatch).not.toHaveBeenCalled();
  });

  it('keeps navigation within a modal while its route is active', () => {
    const modalState = {
      index: 0,
      key: 'modal-stack',
      routeNames: ['modal-screen'],
      routes: [
        {
          key: 'modal-screen-key',
          name: 'modal-screen',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState;
    const rootNavigation = ({
      getRootState: jest.fn(
        () =>
          ({
            index: 1,
            key: 'stack-root',
            routeNames: ['home', 'modal'],
            routes: [
              {
                key: 'home-key',
                name: 'home',
              },
              {
                key: 'modal-key',
                name: 'modal',
                state: modalState,
              },
            ],
            stale: false,
            type: 'stack',
          } as NavigationState),
      ),
    } as unknown) as NonNullable<Types.Props['rootNavigation']>;
    const navigation = createNavigation(modalState);
    const modalRootState = rootNavigation.getRootState();
    if (!modalRootState) {
      throw new Error('Expected a root navigation state');
    }
    const parentNavigation = createNavigation(modalRootState);
    (navigation.getParent as jest.Mock).mockReturnValue(parentNavigation);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      rootNavigation,
      route: {
        key: 'modal-screen-key',
        name: 'modal-screen',
      } as RouteProps,
      setElement: jest.fn(),
    });
    const routeParams = {
      url: 'https://example.com/destination.xml',
    };

    navigator.sendRequest(NAV_ACTIONS.PUSH, routeParams);

    expect(navigation.dispatch).toHaveBeenCalledWith(
      StackActions.push('card', routeParams),
    );
    expect(parentNavigation.dispatch).not.toHaveBeenCalled();
  });

  it('targets a mounted tab without changing the parent stack', () => {
    const fullState = {
      index: 1,
      key: 'root-stack',
      routeNames: ['tabs', 'card'],
      routes: [
        {
          key: 'tabs-key',
          name: 'tabs',
          state: {
            index: 0,
            key: 'tabs-state',
            routeNames: ['home', 'messages'],
            routes: [
              {
                key: 'home-key',
                name: 'home',
              },
              {
                key: 'messages-key',
                name: 'messages',
              },
            ],
            stale: false,
            type: 'tab',
          },
        },
        {
          key: 'card-key',
          name: 'card',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState;
    const navigation = createNavigation({
      ...fullState,
      routes: fullState.routes.map(route => ({
        key: route.key,
        name: route.name,
      })),
    } as NavigationState);
    const rootNavigation = ({
      dispatch: jest.fn(),
      getRootState: jest.fn(() => fullState),
    } as unknown) as NonNullable<Types.Props['rootNavigation']>;
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      rootNavigation,
      route: {
        key: 'card-key',
        name: 'card',
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.sendRequest(NAV_ACTIONS.NAVIGATE, {
      url: '#messages',
    });

    expect(rootNavigation.dispatch).toHaveBeenCalledWith({
      ...TabActions.jumpTo('messages', {}),
      target: 'tabs-state',
    });
    expect(navigation.dispatch).not.toHaveBeenCalled();
  });
});

describe('Navigator.updateRouteUrl', () => {
  it('updates the URL param of the current route', () => {
    const navigation = createNavigation({
      index: 0,
      key: 'tab-root',
      routeNames: ['tab-navigation'],
      routes: [
        {
          key: 'tab-navigation-key',
          name: 'tab-navigation',
        },
      ],
      stale: false,
      type: 'tab',
    } as NavigationState);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/changed.xml',
      navigation,
      route: {
        key: 'tab-navigation-key',
        name: 'tab-navigation',
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.updateRouteUrl('https://example.com/index.xml');

    expect(navigation.dispatch).toHaveBeenCalledWith({
      ...CommonActions.setParams({
        url: 'https://example.com/index.xml',
      }),
      source: 'tab-navigation-key',
    });
  });
});
