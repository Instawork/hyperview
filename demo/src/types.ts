import type { NavigationRouteParams } from 'hyperview';
import type { StackScreenProps } from '@react-navigation/stack';

export type RouteParams = NavigationRouteParams & { modal?: boolean };

export type RootStackParamList = {
  Main: RouteParams;
  Modal: RouteParams;
};

export type Props = StackScreenProps<RootStackParamList>;
