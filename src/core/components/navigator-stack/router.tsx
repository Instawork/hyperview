/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Types from './types';
import { StackNavigationState, StackRouter } from '@react-navigation/native';
import { buildRoutesFromDom } from './helpers';

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
  const routes = buildRoutesFromDom(
    doc,
    state,
    stackOptions.id,
    options.routeParamList,
    entrypointUrl,
  );

  return {
    ...state,
    index: routes.length - 1,
    routes,
  };
};
