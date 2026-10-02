import * as DomErrors from 'hyperview/src/services/dom/errors';
import { CommonActions } from '@react-navigation/native';
import { DOMParser } from '@instawork/xmldom';
import { Router } from './router';
import { createStackNavigationState } from 'hyperview/test/helpers/navigation';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useLocale: () => ({ direction: 'ltr' }),
}));

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

describe('custom stack router', () => {
  it('preserves the current state when the DOM has no routes', () => {
    const state = createStackNavigationState({
      index: 0,
      key: 'root-stack',
      routeNames: routerOptions.routeNames,
      routes: [
        {
          key: 'card-key',
          name: 'card',
        },
      ],
      stale: false,
      type: 'stack',
    });
    const router = Router({
      entrypointUrl: 'https://example.com',
      getDoc: () =>
        parser.parseFromString(
          '<doc xmlns="https://hyperview.org/hyperview" />',
        ),
      id: 'root-navigator',
    });

    expect(
      router.getStateForRouteNamesChange(state, {
        ...routerOptions,
        routeKeyChanges: [],
      }),
    ).toEqual(state);
  });

  it('routes a bare navigate through an unmounted HXML navigator', () => {
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
        <navigator id="other-navigator" type="stack">
          <nav-route id="outside-route" href="/outside" />
        </navigator>
      </doc>
    `);
    const state = createStackNavigationState({
      index: 1,
      key: 'root-stack',
      routeNames: routerOptions.routeNames,
      routes: [
        {
          key: 'tabs-route-key',
          name: 'tabs-route',
          params: {
            id: 'tabs-route',
          },
        },
        {
          key: 'card-key',
          name: 'card',
        },
      ],
      stale: false,
      type: 'stack',
    });
    const router = Router({
      entrypointUrl: 'https://example.com',
      getDoc: () => doc,
      id: 'root-navigator',
    });

    expect(
      router.getStateForAction(
        state,
        CommonActions.navigate('messages-route'),
        routerOptions,
      ),
    ).toEqual({
      ...state,
      index: 0,
      routes: [
        {
          key: 'tabs-route-key',
          name: 'tabs-route',
          params: {
            id: 'tabs-route',
            params: undefined,
            screen: 'messages-route',
          },
          path: undefined,
        },
      ],
    });
    expect(
      router.getStateForAction(
        state,
        CommonActions.navigate('outside-route'),
        routerOptions,
      ),
    ).toBeNull();
  });
});
