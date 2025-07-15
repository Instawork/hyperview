import type {
  NavigationProps,
  RouteParams,
  RouteProps,
} from 'hyperview/src/types';
import { NavigationContainerRefContext } from '@react-navigation/native';

export const ANCHOR_ID_SEPARATOR = '#';
export const ID_CARD = 'card';
export const ID_MODAL = 'modal';
export const KEY_MERGE = 'merge';
export const KEY_SELECTED = 'selected';
export const KEY_MODAL = 'modal';
export const KEY_ID = 'id';
export const KEY_TYPE = 'type';
export const KEY_HREF = 'href';

export type Props = {
  navigation?: NavigationProps;
  route?: RouteProps;
  entrypointUrl: string;
  rootNavigation?:
    | React.ContextType<typeof NavigationContainerRefContext>
    | undefined;
  setElement: (key: number, element: Element) => void;
};

/**
 * Mapping of screens and params for navigation
 */
export type NavigateParams = {
  screen?: string;
  params?: NavigateParams | RouteParams;
};

/**
 * Type defining a map of <id, element>
 */
export type RouteMap = {
  [key: string]: Element;
};
