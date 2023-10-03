/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type React from 'react';

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
  TEXT_AREA: 'text-area',
  TEXT_FIELD: 'text-field',
  TITLE: 'title',
  URL: 'url',
  VIEW: 'view',
  WEB_VIEW: 'web-view',
} as const;

export type LocalName = typeof LOCAL_NAME[keyof typeof LOCAL_NAME];

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

export type NodeType = typeof NODE_TYPE[keyof typeof NODE_TYPE];

export type Attribute = Node & {
  value: DOMString;
  nodeType: typeof NODE_TYPE.ATTRIBUTE_NODE;
  readonly name: DOMString;
  readonly specified: true;
  ownerElement: Element;
};

export type DocumentType = {
  entities: NamedNodeMap;
  internalSubset: DOMString;
  name: DOMString;
  notations: NamedNodeMap;
  publicId: DOMString;
  systemId: DOMString;
};

export type DOMImplementation = {
  createDocument: (
    namespaceURI: NamespaceURI,
    qualifiedName: DOMString,
    doctype: DocumentType,
  ) => Document;
  createDocumentType: (
    qualifiedName: DOMString,
    publicId: DOMString,
    systemId: DOMString,
  ) => DocumentType;
  hasFeature: (feature: DOMString, version: DOMString) => boolean;
};

export type DocumentFragment = Node;

export type EntityReference = Node;

export type ProcessingInstruction = Node & {
  data: DOMString;
  readonly target: DOMString;
};

export type CharacterData = Node & {
  data: DOMString;
  appendData: (data: DOMString) => void;
  deleteData: (offset: number, count: number) => void;
  insertData: (offset: number, data: DOMString) => void;
  replaceData: (offset: number, count: number, data: DOMString) => void;
  substringData: (offset: number, count: number) => DOMString;
};

export type Text = CharacterData & {
  nodeName: '#text';
  nodeType: typeof NODE_TYPE.TEXT_NODE;
  splitText: (offset: number) => Text;
};

export type Comment = CharacterData & {
  nodeName: '#comment';
  nodeType: typeof NODE_TYPE.COMMENT_NODE;
};

export type CDATASection = CharacterData & {
  nodeName: '#cdata-section';
  nodeType: typeof NODE_TYPE.CDATA_SECTION_NODE;
};

export type NamedNodeMap = {
  getNamedItem: (key: string) => Attribute | null | undefined;
  getNamedItemNS: (
    namespaceURI: NamespaceURI,
    localName: LocalName,
  ) => Attribute | null | undefined;
  item: (index: number) => Attribute | null | undefined;
  length: number;
  removeNamedItem: (key: string) => Attribute | null | undefined;
  removeNamedItemNS: (
    namespaceURI: NamespaceURI,
    localName: LocalName,
  ) => Attribute | null | undefined;
  setNamedItem: (attribute: Attribute) => Attribute | null | undefined;
  setNamedItemNS: (attribute: Attribute) => Attribute | null | undefined;
};

export type StyleSheet = any;

export type StyleSheets = {
  regular: StyleSheet;
  selected: StyleSheet;
  pressed: StyleSheet;
  focused: StyleSheet;
  pressedSelected: StyleSheet;
};

export type ComponentRegistry = {
  [key: string]: {
    [key: string]: HvComponent;
  };
};

export type HvComponentOptions = {
  behaviorElement?: Element | null | undefined;
  componentRegistry?: ComponentRegistry;
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
};

export type HvComponentOnUpdate = (
  href: DOMString | null | undefined,
  action: DOMString | null | undefined,
  element: Element,
  options: HvComponentOptions,
) => void;

export type HvGetRoot = () => Document;

export type HvUpdateRoot = (root: Document, updateStylesheet?: boolean) => void;

export type HvComponentProps = {
  element: Element;
  onUpdate: HvComponentOnUpdate | null;
  options: HvComponentOptions;
  stylesheets: StyleSheets;
};

// This type exists for casting since our current version of Flow
// does not support optional static properties. Otherwise this would
// be added as an optional property in HvComponentStatics
export type HvFormValues = {
  getFormInputValues: (element: Element) => Array<[string, string]>;
};

export type HvComponentStatics = {
  localName: LocalName;
  localNameAliases: Array<LocalName | string>;
  namespaceURI: NamespaceURI;
};

export type HvComponent = (
  | React.ComponentClass<HvComponentProps, unknown>
  | React.FunctionComponent<HvComponentProps>
) &
  HvComponentStatics;

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

// https://hyperview.org/docs/reference_behavior_attributes#trigger
export const TRIGGERS = Object.freeze({
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

export type Trigger = typeof TRIGGERS[keyof typeof TRIGGERS];

export const PRESS_TRIGGERS = Object.freeze([
  TRIGGERS.LONG_PRESS,
  TRIGGERS.PRESS_IN,
  TRIGGERS.PRESS_OUT,
  TRIGGERS.PRESS,
]);

export type PressTrigger = 'longPress' | 'pressIn' | 'pressOut' | 'press';

export type TextContextType =
  | 'none'
  | 'URL'
  | 'addressCity'
  | 'addressCityAndState'
  | 'addressState'
  | 'countryName'
  | 'creditCardNumber'
  | 'emailAddress'
  | 'familyName'
  | 'fullStreetAddress'
  | 'givenName'
  | 'jobTitle'
  | 'location'
  | 'middleName'
  | 'name'
  | 'namePrefix'
  | 'nameSuffix'
  | 'nickname'
  | 'organizationName'
  | 'postalCode'
  | 'streetAddressLine1'
  | 'streetAddressLine2'
  | 'sublocality'
  | 'telephoneNumber'
  | 'username'
  | 'password'
  | 'newPassword'
  | 'oneTimeCode'
  | undefined;

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

export type BehaviorOptions = {
  newElement: Element;
  behaviorElement: Element;
  showIndicatorId?: string;
  delay?: number;
  targetId?: string;
};

export type NavigationRouteParams = {
  delay: number | null | undefined;
  preloadScreen: number | null | undefined;
  url: string | null | undefined;
  targetId?: string | null | undefined;
};

export type NavigationProps = {
  back: (routeParams?: NavigationRouteParams | null | undefined) => void;
  closeModal: (routeParams?: NavigationRouteParams | null | undefined) => void;
  navigate: (
    routeParams: NavigationRouteParams,
    key?: string | null | undefined,
  ) => void;
  openModal: (routeParams?: NavigationRouteParams | null | undefined) => void;
  push: (routeParams: NavigationRouteParams) => void;
};

export const ON_EVENT_DISPATCH = 'hyperview:on-event';
