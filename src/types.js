// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ComponentType, ElementRef } from 'react';
import type { StyleSheet } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export type DOMString = string;
export type NamespaceURI = string;

export const LOCAL_NAME = {
  BEHAVIOR: 'behavior',
  BODY: 'body',
  FORM: 'form',
  HEADER: 'header',
  IMAGE: 'image',
  ITEM: 'item',
  LIST: 'list',
  MODIFIER: 'modifier',
  OPTION: 'option',
  PICKER_FIELD: 'picker-field',
  PICKER_ITEM: 'picker-item',
  SECTION_LIST: 'section-list',
  SECTION_TITLE: 'section-title',
  SELECT_MULTIPLE: 'select-multiple',
  SELECT_SINGLE: 'select-single',
  SPINNER: 'spinner',
  STYLE: 'style',
  STYLES: 'styles',
  TEXT: 'text',
  TEXT_AREA: 'text-area',
  TEXT_FIELD: 'text-field',
  VIEW: 'view',
  WEB_VIEW: 'web-view',
};

export const FORM_NAMES = [
  LOCAL_NAME.TEXT_AREA,
  LOCAL_NAME.TEXT_FIELD,
  LOCAL_NAME.SELECT_SINGLE,
  LOCAL_NAME.SELECT_MULTIPLE,
  LOCAL_NAME.PICKER_FIELD,
];

export type LocalName = $Values<typeof LOCAL_NAME>;

export const NODE_TYPE = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  CDATA_SECTION_NODE: 4,
  ENTITY_REFERENCE_NODE: 5,
  ENTITY_NODE: 6,
  PROCESSING_INSTRUCTION_NODE: 7,
  COMMENT_NODE: 8,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  DOCUMENT_FRAGMENT_NODE: 11,
  NOTATION_NODE: 12,
};

export type NodeType = $Values<typeof NODE_TYPE>;

export type Node = {
  +attributes: ?NamedNodeMap,
  +childNodes: ?NodeList<Node>,
  +firstChild: ?Node,
  +lastChild: ?Node,
  +localName: ?LocalName,
  +namespaceURI: ?NamespaceURI,
  +nextSibling: ?Node,
  +nodeName: DOMString,
  +nodeType: NodeType,
  nodeValue: ?string,
  +ownerDocument: ?Document,
  +parentNode: ?Node,
  +previousSibling: ?Node,
  appendChild: (newChild: Node) => Node,
  hasAttributes: () => boolean,
  hasChildNodes: () => boolean,
  insertBefore: (newChild: Node, refChild: Node) => Node,
  isSupported: (feature: DOMString, version: DOMString) => boolean,
  normalize: () => void,
  removeChild: (oldChild: Node) => Node,
  replaceChild: (newChild: Node, oldChild: Node) => Node,
};

export type Attribute = Node & {
  value: DOMString,
  nodeType: typeof NODE_TYPE.ATTRIBUTE_NODE,
  +name: DOMString,
  +specified: true,
  ownerElement: Element,
};

export type DocumentType = {
  entities: NamedNodeMap,
  internalSubset: DOMString,
  name: DOMString,
  notations: NamedNodeMap,
  publicId: DOMString,
  systemId: DOMString,
};

export type DOMImplementation = {
  createDocument: (
    namespaceURI: NamespaceURI,
    qualifiedName: DOMString,
    doctype: DocumentType,
  ) => Document,
  createDocumentType: (
    qualifiedName: DOMString,
    publicId: DOMString,
    systemId: DOMString,
  ) => DocumentType,
  hasFeature: (feature: DOMString, version: DOMString) => boolean,
};

export type Document = Node & {
  doctype: DocumentType,
  documentElement: Element,
  implementation: DOMImplementation,
  createAttribute: (name: DOMString) => Attribute,
  createAttributeNS: (
    namespaceURI: NamespaceURI,
    qualifiedName: DOMString,
  ) => Attribute,
  createCDATASection: (data: DOMString) => CDATASection,
  createComment: (data: DOMString) => Comment,
  createDocumentFragment: () => DocumentFragment,
  createElement: (tagName: DOMString) => Element,
  createElementNS: (
    namespaceURI: NamespaceURI,
    qualifiedName: DOMString,
  ) => Node,
  createEntityReference: (name: DOMString) => EntityReference,
  createProcessingInstruction: (
    target: DOMString,
    data: DOMString,
  ) => ProcessingInstruction,
  createTextNode: (data: DOMString) => Node,
  getElementById: (elementId: DOMString) => ?Element,
  getElementsByTagName: (tagName: DOMString) => NodeList<Element>,
  getElementsByTagNameNS: (
    namespaceURI: NamespaceURI,
    localName: LocalName,
  ) => NodeList<Element>,
  importNode: (importedNode: Node, deep: boolean) => Node,
};

export type Element = Node & {
  cloneNode: (deep: boolean) => Element,
  tagName: DOMString,
  localName: LocalName,
  getAttribute: (name: DOMString) => ?DOMString,
  getAttributeNode: (name: DOMString) => ?Attribute,
  getAttributeNodeNS: (
    namespaceURI: NamespaceURI,
    localName: LocalName,
  ) => ?Attribute,
  getAttributeNS: (
    namespaceURI: NamespaceURI,
    localName: LocalName,
  ) => ?DOMString,
  getElementsByTagName: (name: DOMString) => NodeList<Element>,
  getElementsByTagNameNS: (
    namespaceURI: NamespaceURI,
    localName: LocalName,
  ) => NodeList<Element>,
  hasAttribute: (name: DOMString) => boolean,
  hasAttributeNS: (namespaceURI: NamespaceURI, localName: LocalName) => boolean,
  removeAttribute: (name: DOMString) => void,
  removeAttributeNode: (attribute: Attribute) => Attribute,
  removeAttributeNS: (namespaceURI: NamespaceURI, localName: LocalName) => void,
  setAttribute: (name: DOMString, value: DOMString) => void,
  setAttributeNode: (attribute: Attribute) => Attribute,
  setAttributeNodeNS: (attribute: Attribute) => Attribute,
  setAttributeNS: (
    namespaceURI: NamespaceURI,
    qualifiedName: LocalName,
    value: DOMString,
  ) => void,
};

export type DocumentFragment = Node;

export type EntityReference = Node;

export type ProcessingInstruction = Node & {
  data: DOMString,
  +target: DOMString,
};

export type CharacterData = Node & {
  data: DOMString,
  appendData: (data: DOMString) => void,
  deleteData: (offset: number, count: number) => void,
  insertData: (offset: number, data: DOMString) => void,
  replaceData: (offset: number, count: number, data: DOMString) => void,
  substringData: (offset: number, count: number) => DOMString,
};

export type Text = CharacterData & {
  nodeName: '#text',
  nodeType: typeof NODE_TYPE.TEXT_NODE,
  splitText: (offset: number) => Text,
};

export type Comment = CharacterData & {
  nodeName: '#comment',
  nodeType: typeof NODE_TYPE.COMMENT_NODE,
};

export type CDATASection = CharacterData & {
  nodeName: '#cdata-section',
  nodeType: typeof NODE_TYPE.CDATA_SECTION_NODE,
};

export type NodeList<T> = {
  length: number,
  item: (index: number) => ?T,
};

export type NamedNodeMap = {
  getNamedItem: (key: string) => ?Attribute,
  getNamedItemNS: (
    namespaceURI: NamespaceURI,
    localName: LocalName,
  ) => ?Attribute,
  item: (index: number) => ?Attribute,
  length: number,
  removeNamedItem: (key: string) => ?Attribute,
  removeNamedItemNS: (
    namespaceURI: NamespaceURI,
    localName: LocalName,
  ) => ?Attribute,
  setNamedItem: (attribute: Attribute) => ?Attribute,
  setNamedItemNS: (attribute: Attribute) => ?Attribute,
};

export type StyleSheets = {
  regular: StyleSheet<*>,
  selected: StyleSheet<*>,
  pressed: StyleSheet<*>,
  focused: StyleSheet<*>,
  pressedSelected: StyleSheet<*>,
};

export type ComponentRegistry = {
  [string]: {
    [string]: HvComponent<*>,
  },
};

export type HvComponentOptions = {
  behaviorElement?: ?Element,
  componentRegistry?: ComponentRegistry,
  delay?: ?DOMString,
  focused?: ?boolean,
  hideIndicatorIds?: ?DOMString,
  once?: ?DOMString,
  onEnd?: ?() => void,
  onSelect?: ?(value: ?DOMString) => void,
  onToggle?: ?(value: ?DOMString) => void,
  pressed?: ?boolean,
  pressedSelected?: ?boolean,
  registerInputHandler?: (ref: ?ElementRef<*>) => void,
  screenUrl?: ?string,
  selected?: ?boolean,
  skipHref?: ?boolean,
  showIndicatorIds?: ?DOMString,
  styleAttr?: ?DOMString,
  targetId?: ?DOMString,
};

export type HvComponentOnUpdate = (
  path: ?DOMString,
  action: ?DOMString,
  element: Element,
  options: HvComponentOptions,
) => void;

export type HvComponentProps = {|
  element: Element,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
  stylesheets: StyleSheets,
|};

export type HvComponent<Props> = ComponentType<Props> & {
  localName: LocalName | string,
  namespaceURI: NamespaceURI,
};

export type HvBehavior = {
  action: string,
  callback: (element: Element, onUpdate: HvComponentOnUpdate) => void,
};

export type BehaviorRegistry = {
  [string]: HvBehavior,
};

// https://hyperview.org/docs/reference_behavior_attributes#trigger
export const TRIGGERS = Object.freeze({
  DESELECT: 'deselect',
  LOAD: 'load',
  LONG_PRESS: 'longPress',
  ON_EVENT: 'on-event',
  PRESS_IN: 'pressIn',
  PRESS_OUT: 'pressOut',
  PRESS: 'press',
  REFRESH: 'refresh',
  SELECT: 'select',
  VISIBLE: 'visible',
});

export type Trigger = $Values<typeof TRIGGERS>;

export const PRESS_TRIGGERS = Object.freeze([
  TRIGGERS.LONG_PRESS,
  TRIGGERS.PRESS_IN,
  TRIGGERS.PRESS_OUT,
  TRIGGERS.PRESS,
]);

export type PressTrigger = 'longPress' | 'pressIn' | 'pressOut' | 'press';

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
  REPLACE_INNER: 'replace-inner',
  REPLACE: 'replace',
  SWAP: 'swap',
};

export const NAV_ACTIONS = {
  BACK: ACTIONS.BACK,
  CLOSE: ACTIONS.CLOSE,
  DEEP_LINK: ACTIONS.DEEP_LINK,
  NAVIGATE: ACTIONS.NAVIGATE,
  NEW: ACTIONS.NEW,
  PUSH: ACTIONS.PUSH,
};

export type NavAction = $Values<typeof NAV_ACTIONS>;

export const UPDATE_ACTIONS = {
  REPLACE: ACTIONS.REPLACE,
  REPLACE_INNER: ACTIONS.REPLACE_INNER,
  APPEND: ACTIONS.APPEND,
  PREPEND: ACTIONS.PREPEND,
};

export type UpdateAction = $Values<typeof UPDATE_ACTIONS>;

export type BehaviorOptions = {|
  newElement: Element,
  behaviorElement: Element,
  showIndicatorId?: string,
  delay?: number,
|};

export type NavigationRouteParams = {|
  delay: ?number,
  preloadScreen: ?number,
  url: string,
|};

export type NavigationProps = {|
  back: (routeParams: ?NavigationRouteParams) => void,
  closeModal: (routeParams: ?NavigationRouteParams) => void,
  navigate: (routeParams: NavigationRouteParams, key: ?string) => void,
  openModal: (routeParams: ?NavigationRouteParams) => void,
  push: (routeParams: NavigationRouteParams) => void,
  replace: (routeParams: NavigationRouteParams) => void,
|};

export const ON_EVENT_DISPATCH = 'hyperview:on-event';
