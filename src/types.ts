import * as Components from 'hyperview/src/services/components';
import * as Logging from 'hyperview/src/services/logging';
import * as Stylesheets from './services/stylesheets';
import type {
  NavigationState,
  Route as NavigatorRoute,
} from '@react-navigation/native';
import React, { ComponentType } from 'react';
import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading';
import type { NavigationComponents } from 'hyperview/src/services/navigator';
import type { RefreshControlProps } from 'react-native';
import type { XResponseStaleReason } from './services/dom/types';

export type DOMString = string;
export type NamespaceURI = string;

export const LOCAL_NAME = {
  ANIMATED: 'animated',
  BEHAVIOR: 'behavior',
  BODY: 'body',
  DATE_FIELD: 'date-field',
  DIALOG_TITLE: 'dialog-title',
  DOC: 'doc',
  FORM: 'form',
  HEADER: 'header',
  IMAGE: 'image',
  ITEM: 'item',
  ITEMS: 'items',
  LABEL: 'label',
  LIST: 'list',
  MESSAGE: 'message',
  MODIFIER: 'modifier',
  NAV_ROUTE: 'nav-route',
  NAVIGATOR: 'navigator',
  OFFSET: 'offset',
  OPTION: 'option',
  PICKER_FIELD: 'picker-field',
  PICKER_ITEM: 'picker-item',
  POSITION: 'position',
  SCREEN: 'screen',
  SECTION: 'section',
  SECTION_LIST: 'section-list',
  SECTION_TITLE: 'section-title',
  SELECT_MULTIPLE: 'select-multiple',
  SELECT_SINGLE: 'select-single',
  SPINNER: 'spinner',
  STYLE: 'style',
  STYLES: 'styles',
  SUBJECT: 'subject',
  SWITCH: 'switch',
  TEXT: 'text',
  TEXT_FIELD: 'text-field',
  TITLE: 'title',
  URL: 'url',
  VIEW: 'view',
  WEB_VIEW: 'web-view',
} as const;

export const NODE_TYPE = {
  ATTRIBUTE_NODE: 2,
  CDATA_SECTION_NODE: 4,
  COMMENT_NODE: 8,
  DOCUMENT_FRAGMENT_NODE: 11,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  ELEMENT_NODE: 1,
  ENTITY_NODE: 6,
  ENTITY_REFERENCE_NODE: 5,
  NOTATION_NODE: 12,
  PROCESSING_INSTRUCTION_NODE: 7,
  TEXT_NODE: 3,
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StyleSheet = any;

export type StyleSheets = {
  regular: StyleSheet;
  selected: StyleSheet;
  pressed: StyleSheet;
  focused: StyleSheet;
  pressedSelected: StyleSheet;
};

export type HvComponentOptions = {
  behaviorElement?: Element | null | undefined;
  componentRegistry?: Components.Registry;
  delay?: DOMString | null | undefined;
  focused?: boolean | null | undefined;
  hideIndicatorIds?: DOMString | null | undefined;
  staleHeaderType?: XResponseStaleReason;
  once?: DOMString | null | undefined;
  onEnd?: (() => void | null | undefined) | null | undefined;
  onSelect?: (value?: DOMString | null | undefined) => void | null | undefined;
  onToggle?: (value?: DOMString | null | undefined) => void | null | undefined;
  preformatted?: boolean | null | undefined;
  pressed?: boolean | null | undefined;
  pressedSelected?: boolean | null | undefined;
  registerInputHandler?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref?: React.ElementRef<any> | null | undefined,
  ) => void;
  screenUrl?: string | object | undefined;
  selected?: boolean | null | undefined;
  skipHref?: boolean | null | undefined;
  showIndicatorIds?: DOMString | null | undefined;
  styleAttr?: DOMString | null | undefined;
  targetId?: DOMString | null | undefined;
  inlineFormattingContext?: [Node[], string[]] | null | undefined;
  verb?: DOMString | null | undefined;
  custom?: boolean;
  newElement?: Element | null | undefined;
  showIndicatorId?: string | null | undefined;
  onUpdateCallbacks?: OnUpdateCallbacks;
};

export type HvComponentOnUpdate = (
  href: DOMString | null | undefined,
  action: DOMString | null | undefined,
  element: Element,
  options: HvComponentOptions,
) => void;

export type HvComponentProps = {
  element: Element;
  onUpdate: HvComponentOnUpdate;
  options: HvComponentOptions;
  stylesheets: StyleSheets;
};

type HvComponentStatics = {
  localName: string;
  localNameAliases?: Array<string>;
  namespaceURI: NamespaceURI;
};

export type HvComponent = (
  | React.ComponentClass<HvComponentProps, unknown>
  | React.FunctionComponent<HvComponentProps>
) &
  HvComponentStatics;

export type HvGetRoot = () => Document | null;

export type HvUpdateRoot = (root: Document, updateStylesheet?: boolean) => void;

export type HvBehavior = {
  action: string;
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot,
  ) => void;
};

export type BehaviorRegistry = {
  [key: string]: HvBehavior;
};

// https://hyperview.org/docs/reference_behavior_attributes
export const BEHAVIOR_ATTRIBUTES = {
  ACTION: 'action',
  DELAY: 'delay',
  EVENT_NAME: 'event-name',
  HIDE_DURING_LOAD: 'hide-during-load',
  HREF: 'href',
  HREF_STYLE: 'href-style',
  IMMEDIATE: 'immediate',
  NetworkRetryAction: 'network-retry-action',
  NetworkRetryEvent: 'network-retry-event',
  NEW_VALUE: 'new-value',
  ONCE: 'once',
  SHOW_DURING_LOAD: 'show-during-load',
  TARGET: 'target',
  TRIGGER: 'trigger',
  VERB: 'verb',
} as const;

// https://hyperview.org/docs/reference_behavior_attributes#trigger
export const TRIGGERS = Object.freeze({
  BACK: 'back',
  DESELECT: 'deselect',
  LOAD: 'load',
  LOAD_STALE_ERROR: 'load-stale-error',
  LONG_PRESS: 'longPress',
  ON_EVENT: 'on-event',
  PRESS: 'press',
  PRESS_IN: 'pressIn',
  PRESS_OUT: 'pressOut',
  REFRESH: 'refresh',
  SELECT: 'select',
  VISIBLE: 'visible',
});

// https://hyperview.org/docs/reference_behavior_attributes#action
export const ACTIONS = {
  APPEND: 'append',
  BACK: 'back',
  CLOSE: 'close',
  DEEP_LINK: 'deep-link',
  DISPATCH_EVENT: 'dispatch-event',
  NAVIGATE: 'navigate',
  NEW: 'new',
  PREPEND: 'prepend',
  PUSH: 'push',
  RELOAD: 'reload',
  REPLACE: 'replace',
  REPLACE_INNER: 'replace-inner',
  SELECT_ALL: 'select-all',
  SWAP: 'swap',
  UNSELECT_ALL: 'unselect-all',
} as const;

export const NAV_ACTIONS = {
  BACK: ACTIONS.BACK,
  CLOSE: ACTIONS.CLOSE,
  DEEP_LINK: ACTIONS.DEEP_LINK,
  NAVIGATE: ACTIONS.NAVIGATE,
  NEW: ACTIONS.NEW,
  PUSH: ACTIONS.PUSH,
} as const;

export type NavAction = typeof NAV_ACTIONS[keyof typeof NAV_ACTIONS];

export const UPDATE_ACTIONS = {
  APPEND: ACTIONS.APPEND,
  PREPEND: ACTIONS.PREPEND,
  REPLACE: ACTIONS.REPLACE,
  REPLACE_INNER: ACTIONS.REPLACE_INNER,
} as const;

export type UpdateAction = typeof UPDATE_ACTIONS[keyof typeof UPDATE_ACTIONS];

export type ListenerEvent = {
  data: { state: NavigationState | undefined } | undefined;
  preventDefault: () => void;
};

type ListenerCallback = (event: ListenerEvent) => void;

/**
 * Minimal representation of the 'NavigationProp' used by react-navigation
 */
export type NavigationProps = {
  navigate: (options: object) => void;
  dispatch: (options: object) => void;
  goBack: () => void;
  getState: () => NavigationState;
  getParent: (id?: string) => NavigationProps | undefined;
  addListener: (eventName: string, callback: ListenerCallback) => () => void;
  isFocused: () => boolean;
};

export type RouteParams = {
  behaviorElementId?: number | null;
  delay?: number;
  id?: string;
  isModal?: boolean;
  needsSubStack?: boolean;
  preloadScreen?: number | null;
  routeId?: string;
  targetId?: string;
  url?: DOMString;
};

export type Route = NavigatorRoute<string, RouteParams | undefined>;

export type Fetch = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
) => Promise<Response>;

export type BehaviorOptions = {
  newElement?: Element;
  behaviorElement?: Element;
  showIndicatorId?: string;
  delay?: number;
  targetId?: string;
};

export type NavigationProvider = {
  backAction: (params?: RouteParams | undefined) => void;
  navigate: (
    href: string,
    action: NavAction,
    element: Element,
    componentRegistry: Components.Registry,
    opts: BehaviorOptions,
    stateUrl?: string | null,
    doc?: Document | null,
  ) => void;
  openModalAction: (params: RouteParams) => void;
};

export type OnUpdateCallbacks = {
  clearElementError: () => void;
  getNavigation: () => NavigationProvider;
  getOnUpdate: () => HvComponentOnUpdate;
  getDoc: () => Document | null;
  getState: () => ScreenState;
  setState: (state: ScreenState) => void;
  updateUrl: (url: string) => void;
};

export type ScreenState = {
  doc?: Document | null;
  elementError?: Error | null;
  error?: Error | null;
  staleHeaderType?: XResponseStaleReason | null;
  styles?: Stylesheets.StyleSheets | null;
  url?: string | null;
};

export type ExperimentalFeatures = {
  // Delay the mutation of the navigation state until after the screen has been rendered
  // This is intended to improve the performance of navigation actions
  navStateMutationsDelay?: number;
};

/**
 * All of the props used by hyperview
 */
export type Props = {
  formatDate: (
    date: Date | null | undefined,
    format: string | undefined,
  ) => string | undefined;
  refreshControl?: ComponentType<RefreshControlProps>;
  navigationComponents?: NavigationComponents;
  entrypointUrl: string;
  fetch: Fetch;
  onError?: (error: Error) => void;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
  onRouteBlur?: (route: Route) => void;
  onRouteFocus?: (route: Route) => void;
  behaviors?: HvBehavior[];
  components?: HvComponent[];
  elementErrorComponent?: ComponentType<ErrorProps>;
  errorScreen?: ComponentType<ErrorProps>;
  loadingScreen?: ComponentType<LoadingProps>;
  logger?: Logging.Logger;
  experimentalFeatures?: ExperimentalFeatures;
};
