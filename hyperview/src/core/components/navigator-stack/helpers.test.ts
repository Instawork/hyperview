import * as DomErrors from 'hyperview/src/services/dom/errors';
import { DOMParser } from '@instawork/xmldom';
import type { ParamListBase } from '@react-navigation/routers';
import { StackNavigationState } from '@react-navigation/native';
import { buildRoutesFromDom } from './helpers';

/**
 * Test document response
 * Includes a navigator with two routes
 */
const navDocSource =
  '<doc xmlns="https://hyperview.org/hyperview"><navigator id="navigator" type="stack"><nav-route id="route1" href="/route1" /><nav-route id="route2" href="/route2" /></navigator></doc>';

/**
 * Test document response
 * Includes a navigator with three routes
 */
const navDocSourceThreeRoute =
  '<doc xmlns="https://hyperview.org/hyperview"><navigator id="navigator" type="stack"><nav-route id="route1" href="/route1" /><nav-route id="route2" href="/route2" /><nav-route id="route3" href="/route3"  /></navigator></doc>';

/**
 * Test document response
 * Includes a navigator with two routes, the second being card, the third as modal
 */
const navDocSourceModal =
  '<doc xmlns="https://hyperview.org/hyperview"><navigator id="navigator" type="stack"><nav-route id="route1" href="/route1" /><nav-route id="route2" href="/route2" modal="false" /><nav-route id="route3" href="/route3" modal="true" /></navigator></doc>';

/**
 * Test document response
 * Includes a navigator with two routes, the second being card, the third as card
 */
const navDocSourceCard =
  '<doc xmlns="https://hyperview.org/hyperview"><navigator id="navigator" type="stack"><nav-route id="route1" href="/route1" /><nav-route id="route2" href="/route2" modal="false" /><nav-route id="route3" href="/route3" modal="false" /></navigator></doc>';

/**
 * Parser used to parse the document
 */
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

describe('buildRoutesFromDom', () => {
  const routeParamList: Record<string, object | undefined> = {
    route1: { href: '/route1', id: 'route1' },
    route2: { href: '/route2', id: 'route2' },
  };

  it('should add one route', () => {
    const doc = parser.parseFromString(navDocSource);
    const state: StackNavigationState<ParamListBase> = {
      index: 0,
      key: 'key1',
      routeNames: ['route1'],
      routes: [
        {
          key: 'key1',
          name: 'card',
          params: { id: 'route1', url: '/route1' },
        },
      ],
      stale: false,
      type: 'stack',
    };
    const routes = buildRoutesFromDom(
      doc,
      state,
      'navigator',
      routeParamList,
      'http://foo.com',
    );
    // The dom contains one more route than the state
    expect(routes.length).toEqual(2);
    // The first route is the same as the state
    expect(routes[0].key).toEqual('key1');
    // The second route is the new route and has a key assigned by name
    expect(routes[1].key).toEqual('route2');
  });

  it('should ignore same order route', () => {
    // When the incoming dom contains the same url as one already in state, don't change
    const doc = parser.parseFromString(navDocSource);
    const state: StackNavigationState<ParamListBase> = {
      index: 0,
      key: 'key1',
      routeNames: ['route1'],
      routes: [
        {
          key: 'key1',
          name: 'card',
          params: { id: 'route1', url: '/route1' },
        },
        {
          key: 'key2',
          name: 'card',
          params: { id: 'route2', url: '/route2' },
        },
      ],
      stale: false,
      type: 'stack',
    };
    const routes = buildRoutesFromDom(
      doc,
      state,
      'navigator',
      routeParamList,
      'http://foo.com',
    );
    // The number of routes is uncahnged
    expect(routes.length).toEqual(2);
    // The keys are unchanged indicating the routes were not replaced
    expect(routes[0].key).toEqual('key1');
    expect(routes[1].key).toEqual('key2');
  });

  it('should replace out of order routes', () => {
    const doc = parser.parseFromString(navDocSource);
    const state: StackNavigationState<ParamListBase> = {
      index: 0,
      key: 'key1',
      routeNames: ['route1'],
      routes: [
        {
          key: 'key2',
          name: 'card',
          params: { id: 'route2', url: '/route2' },
        },
        {
          key: 'key1',
          name: 'card',
          params: { id: 'route1', url: '/route1' },
        },
      ],
      stale: false,
      type: 'stack',
    };
    const routes = buildRoutesFromDom(
      doc,
      state,
      'navigator',
      routeParamList,
      'http://foo.com',
    );
    // There are still two routes, but the order has changed
    expect(routes.length).toEqual(2);
    // The names are replaced because the routes were re-added
    expect(routes[0].key).toEqual('route1');
    expect(routes[1].key).toEqual('route2');
  });

  it('should ignore same order with additional route', () => {
    // When the incoming dom contains the same order as state but adds new ones after,
    // leave the current one intact and add a new ones
    const doc = parser.parseFromString(navDocSourceThreeRoute);
    const state: StackNavigationState<ParamListBase> = {
      index: 0,
      key: 'key1',
      routeNames: ['route1'],
      routes: [
        {
          key: 'key1',
          name: 'card',
          params: { id: 'route1', url: '/route1' },
        },
        {
          key: 'key2',
          name: 'card',
          params: { id: 'route2', url: '/route2' },
        },
      ],
      stale: false,
      type: 'stack',
    };
    const routes = buildRoutesFromDom(
      doc,
      state,
      'navigator',
      routeParamList,
      'http://foo.com',
    );
    // The new route was added
    expect(routes.length).toEqual(3);
    // The first two routes are unchanged
    expect(routes[0].key).toEqual('key1');
    expect(routes[1].key).toEqual('key2');
    // The third route is the new one
    expect(routes[2].key).toEqual('route3');
  });

  it('should change presentation to modal', () => {
    const doc = parser.parseFromString(navDocSourceModal);
    const state: StackNavigationState<ParamListBase> = {
      index: 0,
      key: 'key1',
      routeNames: ['route1'],
      routes: [
        {
          key: 'key1',
          name: 'route-1',
          params: { id: 'route1', url: '/route1' },
        },
        {
          key: 'key2',
          name: 'card',
          params: { id: 'route2', url: '/route2' },
        },
        {
          key: 'key3',
          name: 'card',
          params: { id: 'route3', url: '/route3' },
        },
      ],
      stale: false,
      type: 'stack',
    };
    const routes = buildRoutesFromDom(
      doc,
      state,
      'navigator',
      routeParamList,
      'http://foo.com',
    );
    // There are still three routes
    expect(routes.length).toEqual(3);
    // The first two are unchanged
    expect(routes[0].key).toEqual('key1');
    expect(routes[1].key).toEqual('key2');
    // The third has been changed due to presentation difference
    expect(routes[2].key).toEqual('route3');
  });

  it('should change presentation to card', () => {
    const doc = parser.parseFromString(navDocSourceCard);
    const state: StackNavigationState<ParamListBase> = {
      index: 0,
      key: 'key1',
      routeNames: ['route1'],
      routes: [
        {
          key: 'key1',
          name: 'route-1',
          params: { id: 'route1', url: '/route1' },
        },
        {
          key: 'key2',
          name: 'card',
          params: { id: 'route2', url: '/route2' },
        },
        {
          key: 'key3',
          name: 'modal',
          params: { id: 'route3', url: '/route3' },
        },
      ],
      stale: false,
      type: 'stack',
    };
    const routes = buildRoutesFromDom(
      doc,
      state,
      'navigator',
      routeParamList,
      'http://foo.com',
    );
    // There are still three routes
    expect(routes.length).toEqual(3);
    // The first two are unchanged
    expect(routes[0].key).toEqual('key1');
    expect(routes[1].key).toEqual('key2');
    // The third has been changed due to presentation difference
    expect(routes[2].key).toEqual('route3');
  });
});
