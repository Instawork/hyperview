import * as Types from './types';
import {
  CommonActions,
  NavigationState,
  StackActions,
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

    expect(navigation.goBack).toHaveBeenCalled();
    expect(navigation.dispatch).toHaveBeenCalledWith({
      ...CommonActions.setParams(routeParams),
      source: 'tab-navigation-key',
      target: 'tab-root',
    });
  });

  it('removes a background source route at index 0 instead of popping the focused route', () => {
    const selectionRoute = {
      key: 'selection-key',
      name: 'card',
    };
    const confirmationRoute = {
      key: 'confirmation-key',
      name: 'modal',
    };
    const state = {
      index: 1,
      key: 'stack-root',
      routeNames: ['card', 'modal'],
      routes: [selectionRoute, confirmationRoute],
      stale: false,
      type: 'stack',
    } as NavigationState;
    const navigation = createNavigation(state);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      route: {
        key: 'selection-key',
        name: 'card',
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.routeBackRequest(navigation, NAV_ACTIONS.BACK, 'selection-key');

    expect(navigation.goBack).not.toHaveBeenCalled();
    expect(navigation.dispatch).toHaveBeenCalledWith({
      ...CommonActions.reset({
        ...state,
        index: 0,
        routes: [confirmationRoute],
      }),
    });
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

  it('continues navigation from the root after its route is removed', () => {
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
    const staleParentNavigation = createNavigation({
      index: 0,
      key: 'stale-parent-stack',
      routeNames: ['modal-screen'],
      routes: [
        {
          key: 'stale-parent-screen-key',
          name: 'modal-screen',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState);
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
    (navigation.isFocused as jest.Mock).mockReturnValue(false);
    (navigation.getParent as jest.Mock).mockReturnValue(staleParentNavigation);
    const rootNavigation = (Object.assign(createNavigation(parentState), {
      getCurrentRoute: jest.fn(() => ({
        key: 'home-key',
        name: 'home',
      })),
      getRootState: jest.fn(() => parentState),
    }) as unknown) as NonNullable<Types.Props['rootNavigation']>;
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

    expect(rootNavigation.dispatch).toHaveBeenCalledWith(
      StackActions.push('card', routeParams),
    );
    expect(staleParentNavigation.dispatch).not.toHaveBeenCalled();
    expect(navigation.dispatch).not.toHaveBeenCalled();
  });

  test.each([NAV_ACTIONS.BACK, NAV_ACTIONS.CLOSE])(
    'does not %s the revealed route after its source route is removed',
    action => {
      const revealedState = {
        index: 1,
        key: 'stack-root',
        routeNames: ['home', 'card'],
        routes: [
          {
            key: 'home-key',
            name: 'home',
          },
          {
            key: 'revealed-card-key',
            name: 'card',
          },
        ],
        stale: false,
        type: 'stack',
      } as NavigationState;
      const navigation = createNavigation({
        index: 0,
        key: 'removed-stack',
        routeNames: ['removed-screen'],
        routes: [
          {
            key: 'removed-screen-key',
            name: 'removed-screen',
          },
        ],
        stale: false,
        type: 'stack',
      } as NavigationState);
      (navigation.isFocused as jest.Mock).mockReturnValue(false);
      const rootNavigation = (Object.assign(createNavigation(revealedState), {
        getCurrentRoute: jest.fn(() => ({
          key: 'revealed-card-key',
          name: 'card',
        })),
        getRootState: jest.fn(() => revealedState),
      }) as unknown) as NonNullable<Types.Props['rootNavigation']>;
      const navigator = new Navigator({
        entrypointUrl: 'https://example.com/index.xml',
        navigation,
        rootNavigation,
        route: {
          key: 'removed-screen-key',
          name: 'removed-screen',
        } as RouteProps,
        setElement: jest.fn(),
      });

      navigator.sendRequest(action);

      expect(rootNavigation.goBack).not.toHaveBeenCalled();
      expect(rootNavigation.dispatch).not.toHaveBeenCalled();
      expect(navigation.goBack).not.toHaveBeenCalled();
      expect(navigation.dispatch).not.toHaveBeenCalled();
    },
  );

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
    const parentNavigation = createNavigation(
      rootNavigation.getRootState() as NavigationState,
    );
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

  it('keeps navigation within a modal when root state omits nested native state', () => {
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
    const nativeRootState = {
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
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState;
    const rootNavigation = (Object.assign(createNavigation(nativeRootState), {
      getCurrentRoute: jest.fn(() => ({
        key: 'modal-key',
        name: 'modal',
      })),
      getRootState: jest.fn(() => nativeRootState),
    }) as unknown) as NonNullable<Types.Props['rootNavigation']>;
    const navigation = createNavigation(modalState);
    (navigation.getParent as jest.Mock).mockReturnValue(rootNavigation);
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
    expect(rootNavigation.dispatch).not.toHaveBeenCalled();

    navigator.sendRequest(NAV_ACTIONS.CLOSE);

    expect(navigation.goBack).toHaveBeenCalled();
    expect(rootNavigation.goBack).not.toHaveBeenCalled();
  });

  it('stacks a new modal from the root instead of reusing the presented one', () => {
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
    const rootStateOmittingNested = {
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
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState;
    const rootNavigation = (Object.assign(
      createNavigation(rootStateOmittingNested),
      {
        getRootState: jest.fn(() => rootStateOmittingNested),
      },
    ) as unknown) as NonNullable<Types.Props['rootNavigation']>;
    const navigation = createNavigation(modalState);
    (navigation.isFocused as jest.Mock).mockReturnValue(false);
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
      url: 'https://example.com/confirm.xml',
    };

    navigator.sendRequest(NAV_ACTIONS.NEW, routeParams);

    const params = {
      ...routeParams,
      isModal: true,
      needsSubStack: true,
    };
    expect(rootNavigation.dispatch).toHaveBeenCalledWith({
      ...CommonActions.navigate('modal', params),
      payload: {
        name: 'modal',
        params,
        pop: false,
      },
    });
    expect(navigation.dispatch).not.toHaveBeenCalled();
  });

  it('replaces a presented modal when a removed nested route opens a new modal', () => {
    const revealedState = {
      index: 0,
      key: 'modal-stack',
      routeNames: ['modal-screen'],
      routes: [
        {
          key: 'revealed-screen-key',
          name: 'modal-screen',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState;
    const rootStateOmittingNested = {
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
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState;
    const rootNavigation = (Object.assign(
      createNavigation(rootStateOmittingNested),
      {
        getRootState: jest.fn(() => rootStateOmittingNested),
      },
    ) as unknown) as NonNullable<Types.Props['rootNavigation']>;
    const navigation = createNavigation(revealedState);
    (navigation.isFocused as jest.Mock).mockReturnValue(false);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      rootNavigation,
      route: {
        key: 'removed-screen-key',
        name: 'card',
      } as RouteProps,
      setElement: jest.fn(),
    });
    const routeParams = {
      url: 'https://example.com/destination.xml',
    };

    navigator.sendRequest(NAV_ACTIONS.NEW, routeParams);

    const params = {
      ...routeParams,
      isModal: true,
      needsSubStack: true,
    };
    expect(rootNavigation.dispatch).toHaveBeenCalledWith({
      ...StackActions.replace('modal', params),
      target: 'stack-root',
    });
    expect(navigation.dispatch).not.toHaveBeenCalled();
  });

  it('unwinds to an existing route when navigating within the root stack', () => {
    const unwindState = {
      index: 2,
      key: 'stack-root',
      routeNames: ['step-1', 'step-2', 'step-3'],
      routes: [
        {
          key: 'step-1-key',
          name: 'step-1',
        },
        {
          key: 'step-2-key',
          name: 'step-2',
        },
        {
          key: 'step-3-key',
          name: 'step-3',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState;
    const navigation = Object.assign(createNavigation(unwindState), {
      getRootState: jest.fn(() => unwindState),
    });
    const rootNavigation = (navigation as unknown) as NonNullable<
      Types.Props['rootNavigation']
    >;
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      rootNavigation,
      route: {
        key: 'step-3-key',
        name: 'step-3',
      } as RouteProps,
      setElement: jest.fn(),
    });
    const routeParams = {
      targetId: 'step-1',
      url: 'https://example.com/step-1.xml',
    };

    navigator.sendRequest(NAV_ACTIONS.NAVIGATE, routeParams);

    expect(navigation.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ pop: true }),
      }),
    );
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
