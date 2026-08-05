import type {
  ParamListBase,
  RouterConfigOptions,
} from '@react-navigation/routers';
import type {
  TabNavigationState,
  TabRouterOptions,
} from '@react-navigation/native';
import {
  expandNestedNavigate,
  findPathFromDom,
} from 'hyperview/src/services/navigator/helpers';
import { TabRouter } from '@react-navigation/native';

export type Options = TabRouterOptions & {
  getDoc?: () => Document | undefined;
  id: string;
};

export const Router = (options: Options) => {
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
