import type {
  ParamListBase,
  RouterConfigOptions,
} from '@react-navigation/routers';
import {
  expandNestedNavigate,
  findPathFromDom,
} from 'hyperview/src/services/navigator/helpers';
import type { TabNavigationState } from '@react-navigation/native';
import type { TabOptions } from './types';
import { TabRouter } from '@react-navigation/native';

export const Router = (options: TabOptions) => {
  const router = TabRouter(options);

  return {
    ...router,

    getStateForAction(
      state: TabNavigationState<ParamListBase>,
      action: Parameters<typeof router.getStateForAction>[1],
      routerOptions: RouterConfigOptions,
    ) {
      return router.getStateForAction(
        state,
        expandNestedNavigate(state, action, targetId =>
          findPathFromDom(options.getDoc?.(), options.id, targetId),
        ),
        routerOptions,
      );
    },
  };
};
