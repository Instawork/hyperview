import * as Types from './types';
import { CommonActions, NavigationState } from '@react-navigation/native';
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
});

describe('Navigator.sendRequest', () => {
  it('closes the navigator containing a nested modal screen', () => {
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

    expect(parentNavigation.goBack).toHaveBeenCalled();
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
