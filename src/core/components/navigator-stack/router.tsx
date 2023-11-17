/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as NavigatorService from 'hyperview/src/services/navigator';
import * as Types from './types';
import { StackNavigationState, StackRouter } from '@react-navigation/native';
import { LOCAL_NAME } from 'hyperview/src/types';

type Route = {
  key: string;
  name: string;
  params?: {
    id?: string;
    url?: string;
  };
};

/**
 * Provides a custom stack router that allows us to set the initial route
 */
export const Router = (stackOptions: Types.StackOptions) => {
  const router = StackRouter(stackOptions);

  return {
    ...router,

    getInitialState(options: Types.RouterConfigOptions) {
      const initState = router.getInitialState(options);
      return mutateState(initState, stackOptions, {
        ...options,
        routeKeyChanges: [],
      });
    },

    getStateForRouteNamesChange(
      state: StackNavigationState<Types.ParamListBase>,
      options: Types.RouterRenameOptions,
    ) {
      const changeState = router.getStateForRouteNamesChange(state, options);
      return mutateState(changeState, stackOptions, options);
    },
  };
};

/**
 * Inject all routes into the state and set the index to the last route
 */
const mutateState = (
  state: StackNavigationState<Types.ParamListBase>,
  stackOptions: Types.StackOptions,
  options: Types.RouterRenameOptions,
) => {
  const entrypointUrl = stackOptions.navContextProps?.entrypointUrl;
  const doc = stackOptions.docContextProps?.getDoc();
  const element = doc
    ? NavigatorService.getNavigatorById(doc, stackOptions.id)
    : null;
  const elementRoutes = element
    ? NavigatorService.getChildElements(element).filter(
        e => e.localName === LOCAL_NAME.NAV_ROUTE,
      )
    : [];

  const routes: Route[] = [];
  const routeIds = state.routes.map((r: Route) => r.params?.id);
  const routeHrefs = state.routes.map((r: Route) => {
    return r.params?.url
      ? NavigatorService.getUrlFromHref(r.params.url, entrypointUrl)
      : undefined;
  });

  let sequenceBroken = false;
  for (let i = 0; i < elementRoutes.length; i += 1) {
    const routeElement = elementRoutes[i];
    const href = routeElement.getAttribute('href');
    const id = routeElement.getAttribute('id');
    const isModal = routeElement.getAttribute('modal') === 'true';
    if (id) {
      const existingIndex = href
        ? routeHrefs.indexOf(
            NavigatorService.getUrlFromHref(href, entrypointUrl),
          )
        : routeIds.indexOf(id);
      // Ensure each existing route is in the same order and hasn't been disrupted
      if (!sequenceBroken && existingIndex !== i) {
        sequenceBroken = true;
      }
      if (
        existingIndex > -1 &&
        !sequenceBroken &&
        // Ensure the presentation matches
        (isModal
          ? state.routes[existingIndex].name === NavigatorService.ID_MODAL
          : state.routes[existingIndex].name === NavigatorService.ID_CARD)
      ) {
        routes.push(state.routes[existingIndex]);
      } else {
        const params = options.routeParamList[id] || {};
        routes.push({
          key: id,
          name: id,
          params,
        });
      }
    }
  }

  return {
    ...state,
    index: routes.length - 1,
    routes,
  };
};
