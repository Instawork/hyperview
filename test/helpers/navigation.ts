import type {
  ParamListBase,
  StackNavigationState,
} from '@react-navigation/native';

type StackState = Omit<StackNavigationState<ParamListBase>, 'preloadedRoutes'>;

export const createStackNavigationState = (
  state: StackState,
): StackNavigationState<ParamListBase> =>
  (({
    ...state,
    preloadedRoutes: [],
  } as unknown) as StackNavigationState<ParamListBase>);
