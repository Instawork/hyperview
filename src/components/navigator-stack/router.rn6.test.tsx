import * as DomErrors from 'hyperview/src/services/dom/errors';
import * as NavigatorService from 'hyperview/src/services/navigator';
import { CommonActions } from '@react-navigation/native';
import { DOMParser } from '@instawork/xmldom';
import { Router } from './router';
import { createStackNavigationState } from 'hyperview/test/helpers/navigation';

// Deliberately unmocked, unlike router.test.tsx: that file stubs `useLocale`
// so `isReactNavigation7` reads true while the installed router is still
// React Navigation 6, which cannot exercise the version-gated paths below.

const parser = new DOMParser({
  errorHandler: {
    error: (error: string) => {
      throw new DomErrors.XMLParserError(error);
    },
    fatalError: (error: string) => {
      throw new DomErrors.XMLParserFatalError(error);
    },
    warning: (error: string) => {
      throw new DomErrors.XMLParserWarning(error);
    },
  },
  locator: {},
});

const routerOptions = {
  routeGetIdList: {
    card: undefined,
    modal: undefined,
    'tabs-route': undefined,
  },
  routeNames: ['tabs-route', 'card', 'modal'],
  routeParamList: {
    card: undefined,
    modal: undefined,
    'tabs-route': {
      id: 'tabs-route',
    },
  },
};

const doc = parser.parseFromString(`
  <doc xmlns="https://hyperview.org/hyperview">
    <navigator id="root-navigator" type="stack">
      <nav-route id="tabs-route">
        <navigator id="tabs-navigator" type="tab">
          <nav-route id="shifts-route" href="/shifts" />
          <nav-route id="messages-route" href="/messages" />
        </navigator>
      </nav-route>
    </navigator>
  </doc>
`);

const router = Router({
  entrypointUrl: 'https://example.com',
  getDoc: () => doc,
  id: 'root-navigator',
});

describe('stack router under React Navigation 6', () => {
  it('detects the installed React Navigation 6 dependency', () => {
    expect(NavigatorService.isReactNavigation7).toBe(false);
  });

  describe('with a route stacked above the target navigator', () => {
    // The shape behind the storybook regression: a deep-linked card sits on
    // top of the tabs, and a bare navigate to a tab route must not discard it.
    const state = createStackNavigationState({
      index: 1,
      key: 'root-stack',
      routeNames: routerOptions.routeNames,
      routes: [
        {
          key: 'tabs-route-key',
          name: 'tabs-route',
          params: { id: 'tabs-route' },
        },
        {
          key: 'card-key',
          name: 'card',
        },
      ],
      stale: false,
      type: 'stack',
    });
    const action = CommonActions.navigate('messages-route');

    it('leaves the action for the mounted child without dropping the card', () => {
      const result = router.getStateForAction(state, action, routerOptions);

      expect(result).toBeNull();
    });
  });

  describe('with the target navigator on top', () => {
    const state = createStackNavigationState({
      index: 0,
      key: 'root-stack',
      routeNames: routerOptions.routeNames,
      routes: [
        {
          key: 'tabs-route-key',
          name: 'tabs-route',
          params: { id: 'tabs-route' },
        },
      ],
      stale: false,
      type: 'stack',
    });
    const action = CommonActions.navigate('messages-route');

    it('matches master by leaving the action for the mounted child', () => {
      const result = router.getStateForAction(state, action, routerOptions);

      expect(result).toBeNull();
    });
  });
});
