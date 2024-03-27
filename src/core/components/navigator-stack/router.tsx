import * as Types from './types';
import {
  CommonActions,
  StackActionType,
  StackNavigationState,
  StackRouter,
} from '@react-navigation/native';
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

    getStateForAction(
      state: StackNavigationState<Types.ParamListBase>,
      action: CommonActions.Action | StackActionType,
      options: Types.RouterConfigOptions,
    ) {
      if (action.source) {
        switch (action.type) {
          case 'GO_BACK':
            return closeSelf(action, state);
          default:
            break;
        }
      }
      return router.getStateForAction(state, action, options);
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

/**
 * Close the route which initiated the action
 */
const closeSelf = (
  action: CommonActions.Action | StackActionType,
  state: StackNavigationState<Types.ParamListBase>,
) => {
  const routes =
    state.routes.length < 2
      ? state.routes
      : state.routes.filter(route => route.key !== action.source);
  return {
    ...state,
    index: routes.length - 1,
    routes,
  };
};
