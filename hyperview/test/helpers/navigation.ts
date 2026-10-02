import type {
  ParamListBase,
  StackNavigationState,
} from '@react-navigation/native';

type CompatibleStackState = StackNavigationState<ParamListBase> & {
  preloadedRoutes: StackNavigationState<ParamListBase>['routes'];
};

type StackStateWithoutPreloadedRoutes = Omit<
  CompatibleStackState,
  'preloadedRoutes'
>;

export const createStackNavigationState = (
  state: StackStateWithoutPreloadedRoutes,
): CompatibleStackState => ({
  ...state,
  preloadedRoutes: [],
});
