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

const stackWithTabsState = {
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

const createNavigation = (
  state: NavigationState,
  isFocused = true,
): NavigationProps => ({
  addListener: jest.fn(() => jest.fn()),
  dispatch: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(() => state),
  goBack: jest.fn(),
  isFocused: jest.fn(() => isFocused),
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

  it('closes a background modal and every route presented above it', () => {
    const state = {
      index: 2,
      key: 'stack-root',
      routeNames: ['home', 'modal'],
      routes: [
        {
          key: 'home-key',
          name: 'home',
        },
        {
          key: 'modal-one-key',
          name: 'modal',
          params: {
            isModal: true,
          },
        },
        {
          key: 'modal-two-key',
          name: 'modal',
          params: {
            isModal: true,
          },
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
        key: 'modal-one-key',
        name: 'modal',
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.routeBackRequest(navigation, NAV_ACTIONS.CLOSE, 'modal-one-key');

    expect(navigation.dispatch).toHaveBeenCalledWith(StackActions.pop(2));
    expect(navigation.goBack).not.toHaveBeenCalled();
  });

  it('does not identify a modal from its route name', () => {
    const state = {
      index: 2,
      key: 'stack-root',
      routeNames: ['home', 'modal-content', 'card'],
      routes: [
        {
          key: 'home-key',
          name: 'home',
        },
        {
          key: 'modal-content-key',
          name: 'modal-content',
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
        key: 'modal-content-key',
        name: 'modal-content',
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.routeBackRequest(
      navigation,
      NAV_ACTIONS.CLOSE,
      'modal-content-key',
    );

    expect(navigation.dispatch).not.toHaveBeenCalled();
    expect(navigation.goBack).toHaveBeenCalled();
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
          params: {
            isModal: true,
          },
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
          params: {
            isModal: true,
          },
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

  it('targets a mounted tab from a background route without changing the parent stack', () => {
    const tabsState = stackWithTabsState.routes[0].state as NavigationState;
    const navigation = createNavigation(tabsState, false);
    const rootNavigation = ({
      dispatch: jest.fn(),
      getRootState: jest.fn(() => stackWithTabsState),
    } as unknown) as NonNullable<Types.Props['rootNavigation']>;
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      rootNavigation,
      route: {
        key: 'home-key',
        name: 'home',
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.sendRequest(NAV_ACTIONS.NAVIGATE, {
      url: '#messages',
    });

    expect(navigation.dispatch).toHaveBeenCalledWith({
      ...TabActions.jumpTo('messages', {}),
      target: 'tabs-state',
    });
    expect(rootNavigation.dispatch).not.toHaveBeenCalled();
  });

  it('unwinds the focused stack when navigating to a mounted tab', () => {
    const navigation = createNavigation(stackWithTabsState);
    const rootNavigation = ({
      dispatch: jest.fn(),
      getRootState: jest.fn(() => stackWithTabsState),
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

    expect(navigation.dispatch).toHaveBeenCalledWith(
      CommonActions.navigate('messages', {}, { pop: true }),
    );
    expect(rootNavigation.dispatch).not.toHaveBeenCalled();
  });

  it('uses regular navigation when the target tab is not mounted', () => {
    const tabsState = stackWithTabsState.routes[0].state as NavigationState;
    const navigation = createNavigation(tabsState, false);
    const rootNavigation = ({
      dispatch: jest.fn(),
      getRootState: jest.fn(() => stackWithTabsState),
    } as unknown) as NonNullable<Types.Props['rootNavigation']>;
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      rootNavigation,
      route: {
        key: 'home-key',
        name: 'home',
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.sendRequest(NAV_ACTIONS.NAVIGATE, {
      url: '#settings',
    });

    expect(navigation.dispatch).toHaveBeenCalledWith(
      CommonActions.navigate('settings', {}, { pop: true }),
    );
    expect(rootNavigation.dispatch).not.toHaveBeenCalled();
  });

  it('limits background tab lookup to the active navigator', () => {
    const firstTabsState = {
      index: 0,
      key: 'first-tabs-state',
      routeNames: ['home', 'messages'],
      routes: [
        { key: 'first-home-key', name: 'home' },
        { key: 'first-messages-key', name: 'messages' },
      ],
      stale: false,
      type: 'tab',
    } as NavigationState;
    const secondTabsState = {
      index: 0,
      key: 'second-tabs-state',
      routeNames: ['home', 'messages'],
      routes: [
        { key: 'second-home-key', name: 'home' },
        { key: 'second-messages-key', name: 'messages' },
      ],
      stale: false,
      type: 'tab',
    } as NavigationState;
    const fullState = {
      index: 2,
      key: 'root-stack',
      routeNames: ['first-tabs', 'second-tabs', 'card'],
      routes: [
        {
          key: 'first-tabs-key',
          name: 'first-tabs',
          state: firstTabsState,
        },
        {
          key: 'second-tabs-key',
          name: 'second-tabs',
          state: secondTabsState,
        },
        { key: 'card-key', name: 'card' },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState;
    const navigation = createNavigation(secondTabsState, false);
    const rootNavigation = ({
      dispatch: jest.fn(),
      getRootState: jest.fn(() => fullState),
    } as unknown) as NonNullable<Types.Props['rootNavigation']>;
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      rootNavigation,
      route: {
        key: 'second-home-key',
        name: 'home',
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.sendRequest(NAV_ACTIONS.NAVIGATE, {
      url: '#messages',
    });

    expect(navigation.dispatch).toHaveBeenCalledWith({
      ...TabActions.jumpTo('messages', {}),
      target: 'second-tabs-state',
    });
    expect(rootNavigation.dispatch).not.toHaveBeenCalled();
  });

  it('uses the navigator resolved for an explicit navigation target', () => {
    const leafState = {
      index: 0,
      key: 'leaf-stack',
      routeNames: ['leaf'],
      routes: [{ key: 'leaf-key', name: 'leaf' }],
      stale: false,
      type: 'stack',
    } as NavigationState;
    const tabsState = {
      index: 0,
      key: 'tabs-state',
      routeNames: ['home', 'messages'],
      routes: [
        { key: 'home-key', name: 'home', state: leafState },
        { key: 'messages-key', name: 'messages' },
      ],
      stale: false,
      type: 'tab',
    } as NavigationState;
    const fullState = {
      ...stackWithTabsState,
      routes: [
        { key: 'tabs-key', name: 'tabs', state: tabsState },
        { key: 'card-key', name: 'card' },
      ],
    } as NavigationState;
    const navigation = createNavigation(leafState, false);
    const tabsNavigation = createNavigation(tabsState);
    (navigation.getParent as jest.Mock).mockReturnValue(tabsNavigation);
    const rootNavigation = ({
      dispatch: jest.fn(),
      getRootState: jest.fn(() => fullState),
    } as unknown) as NonNullable<Types.Props['rootNavigation']>;
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      rootNavigation,
      route: {
        key: 'leaf-key',
        name: 'leaf',
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.sendRequest(NAV_ACTIONS.NAVIGATE, {
      targetId: 'messages',
    });

    expect(tabsNavigation.dispatch).toHaveBeenCalledWith({
      ...TabActions.jumpTo('messages', {
        params: { targetId: 'messages' },
        screen: 'card',
      }),
      target: 'tabs-state',
    });
    expect(navigation.dispatch).not.toHaveBeenCalled();
    expect(rootNavigation.dispatch).not.toHaveBeenCalled();
  });
});

describe('Navigator.sendRequest', () => {
  it('propagates the modal host name to pushed routes', () => {
    const navigation = createNavigation({
      index: 0,
      key: 'stack-root',
      routeNames: ['home', 'card'],
      routes: [{ key: 'home-key', name: 'home' }],
      stale: false,
      type: 'stack',
    } as NavigationState);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      route: {
        key: 'home-key',
        name: 'home',
        params: {
          modalHostRouteName: '__modal-host-root',
        },
      } as RouteProps,
      setElement: jest.fn(),
    });
    const routeParams = {
      url: 'https://example.com/pushed.xml',
    };

    navigator.sendRequest(NAV_ACTIONS.PUSH, routeParams);

    expect(navigation.dispatch).toHaveBeenCalledWith(
      StackActions.push('card', {
        ...routeParams,
        modalHostRouteName: '__modal-host-root',
      }),
    );
  });

  it('opens new routes as nested modal hosts', () => {
    const navigation = createNavigation({
      index: 0,
      key: 'stack-root',
      routeNames: ['home', 'card', 'modal', '__modal-host-root'],
      routes: [
        {
          key: 'home-key',
          name: 'home',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      route: {
        key: 'home-key',
        name: 'home',
        params: {
          modalHostRouteName: '__modal-host-root',
        },
      } as RouteProps,
      setElement: jest.fn(),
    });
    const routeParams = {
      url: 'https://example.com/modal.xml',
    };

    navigator.sendRequest(NAV_ACTIONS.NEW, routeParams);

    expect(navigation.dispatch).toHaveBeenCalledWith(
      CommonActions.navigate(
        '__modal-host-root',
        {
          ...routeParams,
          isModal: true,
          isModalHost: true,
          needsSubStack: true,
        },
        { pop: true },
      ),
    );
  });

  it('opens subsequent new routes as nested modal flows', () => {
    const navigation = createNavigation({
      index: 0,
      key: 'modal-flow-stack',
      routeNames: ['modal-screen-flow', 'card', 'modal', '__modal-host-nested'],
      routes: [
        {
          key: 'modal-screen-flow-key',
          name: 'modal-screen-flow',
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      route: {
        key: 'modal-screen-flow-key',
        name: 'modal-screen-flow',
        params: {
          modalHostPath: ['first-modal-host-key'],
          modalHostRouteName: '__modal-host-nested',
        },
      } as RouteProps,
      setElement: jest.fn(),
    });
    const routeParams = {
      url: 'https://example.com/nested-modal.xml',
    };

    navigator.sendRequest(NAV_ACTIONS.NEW, routeParams);

    expect(navigation.dispatch).toHaveBeenCalledWith(
      CommonActions.navigate(
        '__modal-host-nested',
        {
          ...routeParams,
          isModal: true,
          isModalHost: true,
          modalHostPath: ['first-modal-host-key'],
          needsSubStack: true,
        },
        { pop: true },
      ),
    );
  });

  it('opens a modal host on the ancestor stack from a tab', () => {
    const tabNavigation = createNavigation({
      index: 0,
      key: 'tabs-state',
      routeNames: ['home'],
      routes: [{ key: 'home-key', name: 'home' }],
      stale: false,
      type: 'tab',
    } as NavigationState);
    const stackNavigation = createNavigation({
      index: 0,
      key: 'root-stack',
      routeNames: ['tabs', '__modal-host-root'],
      routes: [{ key: 'tabs-key', name: 'tabs' }],
      stale: false,
      type: 'stack',
    } as NavigationState);
    (tabNavigation.getParent as jest.Mock).mockReturnValue(stackNavigation);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation: tabNavigation,
      route: {
        key: 'home-key',
        name: 'home',
        params: {
          modalHostRouteName: '__modal-host-root',
        },
      } as RouteProps,
      setElement: jest.fn(),
    });
    const routeParams = {
      url: 'https://example.com/modal.xml',
    };

    navigator.sendRequest(NAV_ACTIONS.NEW, routeParams);

    expect(stackNavigation.dispatch).toHaveBeenCalledWith(
      CommonActions.navigate(
        '__modal-host-root',
        {
          ...routeParams,
          isModal: true,
          isModalHost: true,
          needsSubStack: true,
        },
        { pop: true },
      ),
    );
    expect(tabNavigation.dispatch).not.toHaveBeenCalled();
  });

  it('opens a modal host for an explicitly targeted nested route', () => {
    const tabState = {
      index: 0,
      key: 'tabs-state',
      routeNames: ['home'],
      routes: [
        {
          key: 'home-key',
          name: 'home',
          params: { modalHostRouteName: '__modal-host-root' },
        },
      ],
      stale: false,
      type: 'tab',
    } as NavigationState;
    const tabNavigation = createNavigation(tabState);
    const stackNavigation = createNavigation({
      index: 0,
      key: 'root-stack',
      routeNames: ['tabs', '__modal-host-root'],
      routes: [{ key: 'tabs-key', name: 'tabs', state: tabState }],
      stale: false,
      type: 'stack',
    } as NavigationState);
    (tabNavigation.getParent as jest.Mock).mockReturnValue(stackNavigation);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation: tabNavigation,
      route: {
        key: 'home-key',
        name: 'home',
      } as RouteProps,
      setElement: jest.fn(),
    });
    const routeParams = {
      targetId: 'home',
      url: 'https://example.com/modal.xml',
    };

    navigator.sendRequest(NAV_ACTIONS.NEW, routeParams);

    expect(stackNavigation.dispatch).toHaveBeenCalledWith(
      CommonActions.navigate(
        'tabs',
        {
          params: {
            params: {
              ...routeParams,
              isModal: true,
              isModalHost: true,
              needsSubStack: true,
            },
            screen: '__modal-host-root',
          },
          screen: 'home',
        },
        { pop: true },
      ),
    );
    expect(tabNavigation.dispatch).not.toHaveBeenCalled();
  });

  it('ignores a close after its complete modal host path detaches', () => {
    const navigation = createNavigation({
      index: 1,
      key: 'root-stack',
      routeNames: ['home', '__modal-host-current'],
      routes: [
        { key: 'home-key', name: 'home' },
        {
          key: 'current-modal-host-key',
          name: '__modal-host-current',
          params: { isModalHost: true },
        },
      ],
      stale: false,
      type: 'stack',
    } as NavigationState);
    const navigator = new Navigator({
      entrypointUrl: 'https://example.com/index.xml',
      navigation,
      route: {
        key: 'detached-screen-key',
        name: 'detached-screen',
        params: {
          modalHostPath: ['detached-modal-host-key'],
        },
      } as RouteProps,
      setElement: jest.fn(),
    });

    navigator.sendRequest(NAV_ACTIONS.CLOSE);

    expect(navigation.dispatch).not.toHaveBeenCalled();
    expect(navigation.goBack).not.toHaveBeenCalled();
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
