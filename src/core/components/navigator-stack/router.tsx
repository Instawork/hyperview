import type {
  ParamListBase,
  RouterConfigOptions,
} from '@react-navigation/routers';
import type { RouterRenameOptions, StackOptions } from './types';
import { StackNavigationState, StackRouter } from '@react-navigation/native';
import { buildRoutesFromDom } from './helpers';

/**
 * Provides a custom stack router that allows us to set the initial route
 */
export const Router = (stackOptions: StackOptions) => {
  const router = StackRouter(stackOptions);

  return {
    ...router,

    getInitialState(options: RouterConfigOptions) {
      const initState = router.getInitialState(options);
      return mutateState(initState, stackOptions, {
        ...options,
        routeKeyChanges: [],
      });
    },

    getStateForRouteNamesChange(
      state: StackNavigationState<ParamListBase>,
      options: RouterRenameOptions,
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
  state: StackNavigationState<ParamListBase>,
  stackOptions: StackOptions,
  options: RouterRenameOptions,
) => {
  const entrypointUrl = stackOptions.dependencies?.entrypointUrl;
  const doc = stackOptions.getDoc?.();
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
