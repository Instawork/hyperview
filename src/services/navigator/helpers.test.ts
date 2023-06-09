import * as DomErrors from '../dom/errors';
import * as Errors from './errors';
import * as Imports from './imports';
import * as Namespaces from '../namespaces';
import * as TypesLegacy from '../../types-legacy';
import { ID_DYNAMIC, ID_MODAL } from './types';
import {
  buildParams,
  buildRequest,
  cleanHrefFragment,
  findPath,
  getChildElements,
  getInitialNavRouteElement,
  getNavAction,
  getRouteId,
  getUrlFromHref,
  isNavigationElement,
  isUrlFragment,
  validateUrl,
} from './helpers';
import { DOMParser } from 'xmldom-instawork';

import StateSource from './test.state.json';

/**
 * Test document response
 * Includes a navigator with two routes, the second of which is marked as initial
 */
const navDocSource =
  '<doc xmlns="https://hyperview.org/hyperview"><navigator id="navigator"><nav-route id="route1" href="/route1" /><nav-route id="route2" href="/route2" initial="true" /></navigator></doc>';

/**
 * Alternate test document response
 * Includes a navigator with two routes, neither of which is marked as initial
 */
const navDocSourceAlt =
  '<doc xmlns="https://hyperview.org/hyperview"><navigator id="navigator"><nav-route id="route1" href="/route1" /><nav-route id="route2" href="/route2" /></navigator></doc>';

/**
 * Test document with screen
 */
const screenDocSource =
  '<doc xmlns="https://hyperview.org/hyperview"><screen><body></body></screen></doc>';

/**
 * Test blank document
 */
const blankDoc = '<doc xmlns="https://hyperview.org/hyperview"></doc>';

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

describe('getChildElements', () => {
  it('should find 2 route elements', () => {
    const doc: TypesLegacy.Document = parser.parseFromString(navDocSource);
    const navigators = doc.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'navigator',
    );
    const routes = getChildElements(navigators[0]);
    expect(routes.length).toEqual(2);
  });
  it('should find one element', () => {
    const doc: TypesLegacy.Document = parser.parseFromString(blankDoc);
    expect(getChildElements(doc).length).toEqual(1);
  });
  it('should find no elements', () => {
    const doc: TypesLegacy.Document = parser.parseFromString(blankDoc);
    const { firstChild } = doc;
    expect(getChildElements(firstChild).length).toEqual(0);
  });
  it('should throw a TypeError', () => {
    expect(() => getChildElements(undefined)).toThrow(TypeError);
  });
});

describe('isNavigationElement', () => {
  describe('navigator', () => {
    const doc: TypesLegacy.Document = parser.parseFromString(navDocSource);
    it('should not identify <doc> as navigation element', () => {
      expect(isNavigationElement(doc)).toBe(false);
    });
    it('should identify <navigator> as navigation element', () => {
      const navigators = doc.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        'navigator',
      );
      expect(navigators.length).toBeGreaterThan(0);
      Array.from(navigators).forEach(navigator => {
        expect(isNavigationElement(navigator)).toBe(true);
      });
    });
    it('should identify <nav-route> as navigation element', () => {
      const navigators = doc.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        'navigator',
      );
      const routes = getChildElements(navigators[0]);
      expect(routes.length).toBeGreaterThan(0);
      routes.forEach(route => {
        expect(isNavigationElement(route)).toBe(true);
      });
    });
  });
  describe('screen', () => {
    const doc: TypesLegacy.Document = parser.parseFromString(screenDocSource);
    it('should not identify <doc> as navigation element', () => {
      expect(isNavigationElement(doc)).toBe(false);
    });
    it('should not identify <screen> as navigation element', () => {
      const screens = doc.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        'screen',
      );
      expect(screens.length).toBeGreaterThan(0);
      Array.from(screens).forEach(screen => {
        expect(isNavigationElement(screen)).toBe(false);
      });
    });
  });
});

describe('getInitialNavRouteElement', () => {
  it('should find route2 as initial', () => {
    const doc: TypesLegacy.Document = parser.parseFromString(navDocSource);
    const navigators = doc.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'navigator',
    );
    const initial = getInitialNavRouteElement(navigators[0]);
    expect(initial?.getAttribute('id')).toEqual('route2');
  });
  it('should find route1 as initial', () => {
    const doc: TypesLegacy.Document = parser.parseFromString(navDocSourceAlt);
    const navigators = doc.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'navigator',
    );
    const initial = getInitialNavRouteElement(navigators[0]);
    expect(initial?.getAttribute('id')).toEqual('route1');
  });
  it('should not find an initial route', () => {
    const doc: TypesLegacy.Document = parser.parseFromString(
      '<doc xmlns="https://hyperview.org/hyperview"><navigator id="navigator"></navigator></doc>',
    );
    const navigators = doc.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'navigator',
    );
    const initial = getInitialNavRouteElement(navigators[0]);
    expect(initial).toBeUndefined();
  });
});

describe('isUrlFragment', () => {
  it('should identify `#url-test` as url fragment', () => {
    expect(isUrlFragment('#url-test')).toBe(true);
  });
  it('should not identify `url-test` as url fragment', () => {
    expect(isUrlFragment('url-test')).toBe(false);
  });
  it('should not identify `/url-test` as url fragment', () => {
    expect(isUrlFragment('/url-test')).toBe(false);
  });
  it('should not identify `` as url fragment', () => {
    expect(isUrlFragment('')).toBe(false);
  });
  it('should identify `#` as url fragment', () => {
    expect(isUrlFragment('#')).toBe(true);
  });
});

describe('cleanHrefFragment', () => {
  it('should remove starting # from `#url-test`', () => {
    expect(cleanHrefFragment('#url-test')).toEqual('url-test');
  });
  it('should not remove # from `/#url-test`', () => {
    expect(cleanHrefFragment('/#url-test')).toEqual('/#url-test');
  });
  it('should not change `url-test`', () => {
    expect(cleanHrefFragment('url-test')).toEqual('url-test');
  });
  it('should not change `/url-test`', () => {
    expect(cleanHrefFragment('/url-test')).toEqual('/url-test');
  });
  it('should not change ``', () => {
    expect(cleanHrefFragment('')).toEqual('');
  });
  it('should remove starting # from `#`', () => {
    expect(cleanHrefFragment('#')).toEqual('');
  });
});

describe('getUrlFromHref', () => {
  describe('with entrypoint', () => {
    const entrypoint = 'http://entrypoint';
    const entrypointReturn = 'http://entrypoint/';
    it('should concatenate entrypoint and cleaned url from `#url-test`', () => {
      expect(getUrlFromHref('#url-test', entrypoint)).toEqual(
        'http://entrypoint/url-test',
      );
    });
    it('should concatenate entrypoint and unchanged url from `url-test`', () => {
      expect(getUrlFromHref('url-test', entrypoint)).toEqual(
        'http://entrypoint/url-test',
      );
    });
    it('should concatenate entrypoint and url without double slash from `/url-test`', () => {
      expect(getUrlFromHref('/url-test', entrypoint)).toEqual(
        'http://entrypoint/url-test',
      );
    });
    it('should return entrypoint from url `#`', () => {
      expect(getUrlFromHref('#', entrypoint)).toEqual(entrypointReturn);
    });
    it('should return entrypoint from url ``', () => {
      expect(getUrlFromHref('', entrypoint)).toEqual(entrypointReturn);
    });
    it('should return entrypoint from null url', () => {
      expect(getUrlFromHref(null, entrypoint)).toEqual(entrypointReturn);
    });
    it('should return entrypoint from undefined url', () => {
      expect(getUrlFromHref(undefined, entrypoint)).toEqual(entrypointReturn);
    });
  });
  describe('without entrypoint', () => {
    const entrypoint = undefined;
    it('should return cleaned url from `#url-test`', () => {
      expect(getUrlFromHref('#url-test', entrypoint)).toEqual('url-test');
    });
    it('should return unchanged url from `url-test`', () => {
      expect(getUrlFromHref('url-test', entrypoint)).toEqual('url-test');
    });
    it('should return unchanged url from `/url-test`', () => {
      expect(getUrlFromHref('/url-test', entrypoint)).toEqual('/url-test');
    });
    it('should return `` from url `#`', () => {
      expect(getUrlFromHref('#', entrypoint)).toEqual('');
    });
    it('should return `` from url ``', () => {
      expect(getUrlFromHref('', entrypoint)).toEqual('');
    });
    it('should return `` from null url', () => {
      expect(getUrlFromHref(null, entrypoint)).toEqual('');
    });
    it('should return `` from undefined url', () => {
      expect(getUrlFromHref(undefined, entrypoint)).toEqual('');
    });
  });
});

describe('validateUrl', () => {
  describe('ignored', () => {
    const urls = ['url', '/url', '#url', '', '#', undefined, null];
    [
      TypesLegacy.NAV_ACTIONS.BACK,
      TypesLegacy.NAV_ACTIONS.CLOSE,
      TypesLegacy.NAV_ACTIONS.NAVIGATE,
    ].forEach(action => {
      describe(`action:${action}`, () => {
        it('should ignore object without url', () => {
          expect(() => validateUrl(action, {})).not.toThrow(
            Errors.HvNavigatorError,
          );
        });
        urls.forEach(url => {
          it(`should ignore url: ${url}`, () => {
            expect(() => validateUrl(action, { url })).not.toThrow(
              Errors.HvNavigatorError,
            );
          });
        });
      });
    });
  });
  describe('processed', () => {
    [TypesLegacy.NAV_ACTIONS.PUSH, TypesLegacy.NAV_ACTIONS.NEW].forEach(
      action => {
        describe(`action:${action}`, () => {
          it('should throw when no url is present', () => {
            expect(() => validateUrl(action, {})).toThrow(
              Errors.HvNavigatorError,
            );
          });
          ['url', '/url', '#url'].forEach(url => {
            it(`should validate url:${url}`, () => {
              expect(() => validateUrl(action, { url })).not.toThrow(
                Errors.HvNavigatorError,
              );
            });
          });
          ['', '#', undefined, null].forEach(url => {
            it(`should not validate url:${url}`, () => {
              expect(() => validateUrl(action, {})).toThrow(
                Errors.HvNavigatorError,
              );
            });
          });
        });
      },
    );
  });
});

describe('findPath', () => {
  const state = StateSource as Imports.NavigationState;
  describe('found', () => {
    const path = findPath(state, 'performance_2');
    it('should find the path 3 levels from the top', () => {
      expect(path.length).toEqual(3);
    });
    it('should start at home', () => {
      expect(path[0]).toEqual('screen_stack_root_home');
    });
    it('should find performance under home', () => {
      expect(path[1]).toEqual('performance');
    });
    it('should find performance_2 under performace', () => {
      expect(path[2]).toEqual('performance_2');
    });
  });
  describe('not found', () => {
    const path = findPath(state, 'to_be_found');
    it('should not find a path to `to_be_found`', () => {
      expect(path.length).toEqual(0);
    });
  });
});

// TODO getNavigatorAndPath
// - build navigator hierarchy

describe('buildParams', () => {
  describe('valid path', () => {
    // Expected response:
    //  {screen: 'a', params:
    //    {screen: 'b', params:
    //      {screen: 'c', params:
    //        {screen: 'd', params: {url: 'url'}}}}
    const path = ['a', 'b', 'c'];
    const params = buildParams('d', path, { url: 'url' });
    it('should return a value', () => {
      expect(params).not.toBeUndefined();
    });
    it('should contain `a` as first screen', () => {
      expect(params.screen).toEqual('a');
    });
    it('should contain `b` as second screen', () => {
      expect(params.params.screen).toEqual('b');
    });
    it('should contain `c` as third screen', () => {
      expect(params.params.params.screen).toEqual('c');
    });
    it('should contain `d` as fourth screen', () => {
      expect(params.params.params.params.screen).toEqual('d');
    });
    it('should assign params to the last screen', () => {
      expect(params.params.params.params.params.url).toEqual('url');
    });
  });
  describe('invalid path', () => {
    const path = [];
    const params = buildParams('a', path, { url: 'url' });
    it('should return a value', () => {
      expect(params).not.toBeUndefined();
    });
    it('should contain `a` as first screen', () => {
      expect(params.screen).toEqual('a');
    });
    it('should assign params to the last screen', () => {
      expect(params.params.url).toEqual('url');
    });
  });
});

describe('getRouteId', () => {
  const urls = ['url', '/url', '#url', '', '#', undefined];
  describe('simple', () => {
    describe('action:push', () => {
      urls.forEach(url => {
        it(`should return type 'dynamic' from url with static: ${url}`, () => {
          expect(getRouteId(TypesLegacy.NAV_ACTIONS.PUSH, url, true)).toEqual(
            ID_DYNAMIC,
          );
        });
        it(`should return type 'dynamic' from url with non-static: ${url}`, () => {
          expect(getRouteId(TypesLegacy.NAV_ACTIONS.PUSH, url, false)).toEqual(
            ID_DYNAMIC,
          );
        });
      });
    });

    describe('action:new', () => {
      urls.forEach(url => {
        it(`should return type 'modal' from url with static: ${url}`, () => {
          expect(getRouteId(TypesLegacy.NAV_ACTIONS.NEW, url, true)).toEqual(
            ID_MODAL,
          );
        });
        it(`should return type 'modal' from url with non-static: ${url}`, () => {
          expect(getRouteId(TypesLegacy.NAV_ACTIONS.NEW, url, false)).toEqual(
            ID_MODAL,
          );
        });
      });
    });
  });

  describe('processed', () => {
    [
      TypesLegacy.NAV_ACTIONS.BACK,
      TypesLegacy.NAV_ACTIONS.CLOSE,
      TypesLegacy.NAV_ACTIONS.NAVIGATE,
    ].forEach(action => {
      describe(`action:${action}`, () => {
        ['#url', '#'].forEach(url => {
          it(`should return cleaned url with static: ${url}`, () => {
            expect(getRouteId(action, url, true)).toEqual(url.slice(1));
          });
          it(`should return type 'dynamic' from url with non-static: ${url}`, () => {
            expect(getRouteId(action, url, false)).toEqual(ID_DYNAMIC);
          });
        });
        ['url', '/url', '', undefined].forEach(url => {
          it(`should return cleaned url with static: ${url}`, () => {
            expect(getRouteId(action, url, true)).toEqual(ID_DYNAMIC);
          });
          it(`should return type 'dynamic' from url with non-static: ${url}`, () => {
            expect(getRouteId(action, url, false)).toEqual(ID_DYNAMIC);
          });
        });
      });
    });
  });
});

describe('getNavAction', () => {
  describe('ignored', () => {
    const urls = ['url', '/url', '#url', '', '#', undefined, null];
    [
      TypesLegacy.NAV_ACTIONS.BACK,
      TypesLegacy.NAV_ACTIONS.CLOSE,
      TypesLegacy.NAV_ACTIONS.NAVIGATE,
      TypesLegacy.NAV_ACTIONS.NEW,
    ].forEach(action => {
      describe(`action:${action}`, () => {
        it('should ignore object without params', () => {
          expect(getNavAction(action)).toEqual(action);
        });
        it('should ignore object without url', () => {
          expect(getNavAction(action, {})).toEqual(action);
        });
        urls.forEach(url => {
          it(`should ignore url: ${url}`, () => {
            expect(getNavAction(action, { url })).toEqual(action);
          });
        });
      });
    });
  });
  describe('processed', () => {
    [TypesLegacy.NAV_ACTIONS.PUSH].forEach(action => {
      describe(`action:${action}`, () => {
        it('should ignore object without params', () => {
          expect(getNavAction(action)).toEqual(action);
        });
        it('should ignore object without url', () => {
          expect(getNavAction(action, {})).toEqual(action);
        });
        ['url', '/url', '', undefined, null].forEach(url => {
          it(`should ignore url: ${url}`, () => {
            expect(getNavAction(action)).toEqual(action);
          });
        });
        ['#url', '#'].forEach(url => {
          it(`should use navigation for url:${url}`, () => {
            expect(getNavAction(action, { url })).toEqual(
              TypesLegacy.NAV_ACTIONS.NAVIGATE,
            );
          });
        });
      });
    });
  });
});

describe('buildRequest', () => {
  const actions = [
    TypesLegacy.NAV_ACTIONS.BACK,
    TypesLegacy.NAV_ACTIONS.CLOSE,
    TypesLegacy.NAV_ACTIONS.NAVIGATE,
    TypesLegacy.NAV_ACTIONS.NEW,
    TypesLegacy.NAV_ACTIONS.PUSH,
  ];
  describe('ignored', () => {
    actions.forEach(action => {
      describe(`action:${action}`, () => {
        const params = { url: 'url' };
        it('should ignore object without params', () => {
          expect(buildRequest(undefined, action, undefined)).toEqual([
            undefined,
            '',
            {},
          ]);
        });
        it('should ignore object without navigator', () => {
          expect(buildRequest(undefined, action, params)).toEqual([
            undefined,
            '',
            params,
          ]);
        });
      });
    });
  });
  describe('back', () => {
    const params = { url: 'url' };
    it('should ignore back actions', () => {
      expect(
        buildRequest(undefined, TypesLegacy.NAV_ACTIONS.BACK, params),
      ).toEqual([undefined, '', params]);
    });
  });
  // TODO buildRequest tests
  // - invalid navigator
  // - invalid path
  // - success
});
