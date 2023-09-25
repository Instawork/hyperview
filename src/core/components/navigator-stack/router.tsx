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

/**
 * Provides a custom stack router that allows us to set the initial route
 */
export const Router = (stackOptions: Types.StackOptions) => {
  const router = StackRouter(stackOptions);

  /**
   * Inject all routes into the state and set the index to the last route
   */
  const mutateState = (
    state: StackNavigationState<Types.ParamListBase>,
    options: Types.RouterRenameOptions,
  ) => {
    const routes = Array.from(state.routes);

    const filteredNames = options.routeNames.filter((name: string) => {
      return (
        !options.routeKeyChanges?.includes(name) &&
        !NavigatorService.isDynamicRoute(name)
      );
    });

    filteredNames.forEach((name: string) => {
      const routeParams = options.routeParamList
        ? options.routeParamList[name]
        : undefined;
      const params = routeParams || {};
      if (!routes.find(route => route.name === name)) {
        routes.push({
          key: `${name}`,
          name,
          params,
        });
      }
    });

    return {
      ...state,
      index: routes.length - 1,
      routes,
    };
  };

  return {
    ...router,

    getInitialState(options: Types.RouterConfigOptions) {
      const initState = router.getInitialState(options);

      // console.log(
      //   '@@@@ getInitialState:',
      //   stackOptions.id,
      //   'options:',
      //   options,
      //   'initState:',
      //   initState,
      // );
      return mutateState(initState, { ...options, routeKeyChanges: [] });
    },

    getStateForRouteNamesChange(
      state: StackNavigationState<Types.ParamListBase>,
      options: Types.RouterRenameOptions,
    ) {
      const changeState = router.getStateForRouteNamesChange(state, options);

      // console.log(
      //   '@@@@ getStateForRouteNamesChange state:',
      //   state,
      //   'options:',
      //   options,
      //   'changeState:',
      //   changeState,
      // );

      return mutateState(changeState, options);
    },
  };
};
