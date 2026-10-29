import type {
  ParamListBase,
  StackNavigationState,
} from '@react-navigation/native';

type StackStateWithoutPreloadedRoutes = Omit<
  StackNavigationState<ParamListBase>,
  'preloadedRoutes'
>;

export const createStackNavigationState = (
  state: StackStateWithoutPreloadedRoutes,
): StackNavigationState<ParamListBase> => ({
  ...state,
  preloadedRoutes: [],
});
