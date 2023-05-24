/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const ANCHOR_ID_SEPARATOR = '#';
export const ID_DYNAMIC = 'dynamic';
export const ID_MODAL = 'modal';

/**
 * Definition of the available navigator types
 */
export const NAVIGATOR_TYPE = {
  BOTTOM_TAB: 'bottom-tab',
  STACK: 'stack',
  TOP_TAB: 'top-tab',
};

/**
 * Minimal local name type copy from 'hyperview/src/types.js'
 */
export const LOCAL_NAME = {
  DOC: 'doc',
  NAV_ROUTE: 'nav-route',
  NAVIGATOR: 'navigator',
  SCREEN: 'screen',
};

export type LocalName = typeof LOCAL_NAME[keyof typeof LOCAL_NAME];

/**
 * Minimal local name type copy from 'hyperview/src/types.js'
 */
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
};

export type NodeType = typeof NODE_TYPE[keyof typeof NODE_TYPE];

/**
 * Minimal local name type copy from 'hyperview/src/types.js'
 */
// https://hyperview.org/docs/reference_behavior_attributes#action
export const ACTIONS = {
  BACK: 'back',
  CLOSE: 'close',
  NAVIGATE: 'navigate',
  NEW: 'new',
  PUSH: 'push',
};

/**
 * Minimal local name type copy from 'hyperview/src/types.js'
 */
export const NAV_ACTIONS = {
  BACK: ACTIONS.BACK,
  CLOSE: ACTIONS.CLOSE,
  NAVIGATE: ACTIONS.NAVIGATE,
  NEW: ACTIONS.NEW,
  PUSH: ACTIONS.PUSH,
};

export type NavAction = typeof NAV_ACTIONS[keyof typeof NAV_ACTIONS];

export type DOMString = string;
export type NamespaceURI = string;

export type NodeList<T> = {
  length: number;
  item: (index: number) => T | null | undefined;
} & {
  [index: number]: T;
};

/**
 * Minimal Node type copy from 'hyperview/src/types.js'
 */
export type Node = {
  tagName: DOMString;
  localName: LocalName;
  // +attributes: ?NamedNodeMap,
  readonly childNodes: NodeList<Node> | null | undefined;
  readonly firstChild: Node | null | undefined;
  // +lastChild: ?Node,
  // +localName: ?LocalName,
  readonly namespaceURI: NamespaceURI | null | undefined;
  readonly nextSibling: Node | null | undefined;
  // +nodeName: DOMString,
  // ---> nodeType: typeof NODE_TYPE;
  readonly nodeType: NodeType;
  // nodeValue: ?string,
  // +ownerDocument: ?Document,
  // +parentNode: ?Node,
  // +previousSibling: ?Node,
  // appendChild: (newChild: Node) => Node,
  // hasAttributes: () => boolean,
  hasChildNodes: () => boolean;
  // insertBefore: (newChild: Node, refChild: Node) => Node,
  // isSupported: (feature: DOMString, version: DOMString) => boolean,
  // normalize: () => void,
  // removeChild: (oldChild: Node) => Node,
  // replaceChild: (newChild: Node, oldChild: Node) => Node,
};

/**
 * Minimal Element type copy from 'hyperview/src/types.js'
 */
export type Element = Node & {
  childNodes: NodeList<Element>;
  // cloneNode: (deep: boolean) => Element;
  getAttribute: (name: DOMString) => DOMString | null | undefined;
  // getAttributeNode: (name: DOMString) => ?Attribute;
  // getAttributeNodeNS: (
  //   namespaceURI: NamespaceURI,
  //   localName: LocalName,
  // ) => ?Attribute;
  // getAttributeNS: (
  //   namespaceURI: NamespaceURI,
  //   localName: LocalName,
  // ) => ?DOMString;
  // getElementsByTagName: (name: DOMString) => NodeList<Element>;
  getElementsByTagNameNS: (
    namespaceURI: NamespaceURI,
    localName: LocalName,
  ) => NodeList<Element>;
  // hasAttribute: (name: DOMString) => boolean;
  // hasAttributeNS: (namespaceURI: NamespaceURI, localName: LocalName) => boolean;
  // removeAttribute: (name: DOMString) => void;
  // removeAttributeNode: (attribute: Attribute) => Attribute;
  // removeAttributeNS: (namespaceURI: NamespaceURI, localName: LocalName) => void;
  // setAttribute: (name: DOMString, value: DOMString) => void;
  // setAttributeNode: (attribute: Attribute) => Attribute;
  // setAttributeNodeNS: (attribute: Attribute) => Attribute;
  // setAttributeNS: (
  //   namespaceURI: NamespaceURI,
  //   qualifiedName: LocalName,
  //   value: DOMString,
  // ) => void;
};

/**
 * Minimal Document type copy from 'hyperview/src/types.js'
 */
export type Document = Node & {
  // doctype: DocumentType;
  // documentElement: Element;
  // implementation: DOMImplementation;
  // createAttribute: (name: DOMString) => Attribute;
  // createAttributeNS: (
  //   namespaceURI: NamespaceURI,
  //   qualifiedName: DOMString,
  // ) => Attribute;
  // createCDATASection: (data: DOMString) => CDATASection;
  // createComment: (data: DOMString) => Comment;
  // createDocumentFragment: () => DocumentFragment;
  // createElement: (tagName: DOMString) => Element;
  // createElementNS: (
  //   namespaceURI: NamespaceURI,
  //   qualifiedName: DOMString,
  // ) => Node;
  // createEntityReference: (name: DOMString) => EntityReference;
  // createProcessingInstruction: (
  //   target: DOMString,
  //   data: DOMString,
  // ) => ProcessingInstruction;
  // createTextNode: (data: DOMString) => Node;
  // getElementById: (elementId: DOMString) => ?Element;
  // getElementsByTagName: (tagName: DOMString) => NodeList<Element>;
  getElementsByTagNameNS: (
    namespaceURI: NamespaceURI,
    localName: LocalName,
  ) => NodeList<Element>;
  // importNode: (importedNode: Node, deep: boolean) => Node;
};

/**
 * Minimal Document type copy from 'hyperview/src/types.js'
 */
export type NavigationRouteParams = {
  delay?: number;
  preloadScreen?: number;
  target?: string;
  url?: string;
};
