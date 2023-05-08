// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Navigation } from '@react-navigation/native';
import { cleanHrefFragment } from 'hyperview/src/navigator-helpers';

export default class NavLogic {
  navigation: Navigation;

  constructor(navigation: Navigation) {
    if (!navigation) {
      throw new Error('NavLogic requires a navigation object');
    }
    this.navigation = navigation;
  }

  /**
   * Recursively search for the target in state and build a path to it
   */
  findPath = (state: Object, target: string, path: string[]) => {
    const { routes } = state;
    if (routes) {
      for (let i = 0; i < routes.length; i += 1) {
        const route: Object = routes[i];
        if (route.name === target) {
          path.push(route.name);
        } else if (route.state) {
          this.findPath(route.state, target, path);
          if (path.length) {
            path.push(route.name);
          }
        }
        if (path.length) {
          break;
        }
      }
    }
  };

  /**
   * Continue up the hierarchy until a navigation is found which contains the target
   * If the target is not found, no navigation is returned
   */
  getNavigatorAndPath = (target: string): [Navigation, string[]] => {
    let { navigation }: Navigation = this;
    if (!target) {
      return [navigation, null];
    }
    while (navigation) {
      const id = navigation.getId();
      if (id === target) {
        return [navigation, null];
      }
      const path: string[] = [];
      this.findPath(navigation.getState(), target, path);
      if (path.length) {
        return [navigation, path];
      }
      navigation = navigation.getParent();
    }
    return [null, null];
  };

  /**
   * Generate a nested param hierarchy with instructions for each screen to step through to the target
   */
  buildParams = (
    path: string[],
    routeId: string,
    routeParams: Object,
  ): Object => {
    const prms: Object = {};
    if (path.length) {
      prms.screen = path.pop();
      prms.params = this.buildParams(path, routeId, routeParams);
    } else {
      prms.screen = routeId;
      prms.params = routeParams;
    }
    return prms;
  };

  /**
   * Build the request structure including finding the navigation, building params, and determining screen id
   */
  buildRequest = (
    action: string,
    routeParams: Object,
  ): [Navigation, Object, string] => {
    const [navigation, path] = this.getNavigatorAndPath(routeParams.target);
    let routeId: string = cleanHrefFragment(routeParams.url);
    const cleanedParams: Object = { ...routeParams };
    delete cleanedParams.target;
    delete cleanedParams.url;
    let params: Object;
    if (!path || !path.length) {
      params = cleanedParams;
    } else {
      params = this.buildParams(path, routeId, cleanedParams);
      routeId = navigation.getId();
    }

    return [navigation, routeId, params];
  };

  /**
   * Prepare and send the request
   */
  sendRequest = (action: string, routeParams: Object) => {
    if (!routeParams) {
      return;
    }

    const [navigation, routeId, params] = this.buildRequest(
      action,
      routeParams,
    );
    if (!navigation) {
      return;
    }

    switch (action) {
      case 'back':
        navigation.goBack(params);
        break;
      case 'closeModal':
        navigation.goBack(params);
        break;
      case 'navigate':
        navigation.navigate(routeId, params);
        break;
      case 'openModal':
        navigation.navigate(routeId, params);
        break;
      case 'push':
        navigation.navigate(routeId, params);
        break;
      default:
    }
  };

  back = routeParams => {
    this.sendRequest('back', routeParams);
  };

  closeModal = routeParams => {
    this.sendRequest('closeModal', routeParams);
  };

  navigate = routeParams => {
    this.sendRequest('navigate', routeParams);
  };

  openModal = routeParams => {
    this.sendRequest('openModal', routeParams);
  };

  push = routeParams => {
    this.sendRequest('push', routeParams);
  };
}
