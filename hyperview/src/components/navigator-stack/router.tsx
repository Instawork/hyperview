import * as NavigatorService from 'hyperview/src/services/navigator';
import type {
  ParamListBase,
  RouterConfigOptions,
} from '@react-navigation/routers';
import type { RouterRenameOptions, StackOptions } from './types';
import type { StackNavigationState } from '@react-navigation/native';
import { StackRouter } from '@react-navigation/native';
import { buildRoutesFromDom } from './helpers';

/**
 * Provides a custom stack router that allows us to set the initial route
 */
export const Router = (
  stackOptions: StackOptions,
): ReturnType<typeof StackRouter> => {
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

    getStateForAction(
      state: StackNavigationState<ParamListBase>,
      action: Parameters<typeof router.getStateForAction>[1],
      options: RouterConfigOptions,
    ) {
      return router.getStateForAction(
        state,
        NavigatorService.expandNestedNavigate(state, action, targetId =>
          NavigatorService.findPathFromDom(
            stackOptions.getDoc?.(),
            stackOptions.id,
            targetId,
          ),
        ),
        options,
      );
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
  const { entrypointUrl, getDoc } = stackOptions;
  const doc = getDoc?.();
  const routes = buildRoutesFromDom(
    doc,
    state,
    stackOptions.id,
    options.routeParamList,
    entrypointUrl,
  );

  if (!routes.length) {
    return state;
  }

  return {
    ...state,
    index: routes.length - 1,
    routes,
  };
};
