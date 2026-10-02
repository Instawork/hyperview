import * as NavigatorService from 'hyperview/src/services/navigator';
import type {
  ParamListBase,
  RouterConfigOptions,
} from '@react-navigation/routers';
import type { TabNavigationState } from '@react-navigation/native';
import type { TabOptions } from './types';
import { TabRouter } from '@react-navigation/native';

export const Router = (options: TabOptions): ReturnType<typeof TabRouter> => {
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
        NavigatorService.expandNestedNavigate(state, action, targetId =>
          NavigatorService.findPathFromDom(
            options.getDoc?.(),
            options.id,
            targetId,
          ),
        ),
        routerOptions,
      );
    },
  };
};
