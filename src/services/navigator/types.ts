/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Minimal local name type copy from 'hyperview/src/types.js'
 */
export const LOCAL_NAME = {
  DOC: 'doc',
  NAV_ROUTE: 'nav-route',
  NAVIGATOR: 'navigator',
  SCREEN: 'screen',
};

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

export const NAVIGATOR_TYPE = {
  BOTTOM_TAB: 'bottom-tab',
  STACK: 'stack',
  TOP_TAB: 'top-tab',
};

export type DOMString = string | null | undefined;
export type NamespaceURI = string | null | undefined;

/**
 * Minimal Node type copy from 'hyperview/src/types.js'
 */
export type Node = {
  tagName: DOMString;
  // ---> localName: typeof LOCAL_NAME;
  localName: string;
  // +attributes: ?NamedNodeMap,
  // +childNodes: ?NodeList<Node>,
  firstChild: Node | undefined;
  // +lastChild: ?Node,
  // +localName: ?LocalName,
  namespaceURI: NamespaceURI;
  nextSibling: Node | undefined;
  // +nodeName: DOMString,
  // ---> nodeType: typeof NODE_TYPE;
  nodeType: number;
  // nodeValue: ?string,
  // +ownerDocument: ?Document,
  // +parentNode: ?Node,
  // +previousSibling: ?Node,
  // appendChild: (newChild: Node) => Node,
  // hasAttributes: () => boolean,
  // hasChildNodes: () => boolean,
  // insertBefore: (newChild: Node, refChild: Node) => Node,
  // isSupported: (feature: DOMString, version: DOMString) => boolean,
  // normalize: () => void,
  // removeChild: (oldChild: Node) => Node,
  // replaceChild: (newChild: Node, oldChild: Node) => Node,
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
  // getElementsByTagNameNS: (
  //   namespaceURI: NamespaceURI,
  //   localName: LocalName,
  // ) => NodeList<Element>;
  // importNode: (importedNode: Node, deep: boolean) => Node;
};

/**
 * Minimal Element type copy from 'hyperview/src/types.js'
 */
export type Element = Node & {
  // cloneNode: (deep: boolean) => Element;
  // getAttribute: (name: DOMString) => ?DOMString;
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
  // getElementsByTagNameNS: (
  //   namespaceURI: NamespaceURI,
  //   localName: LocalName,
  // ) => NodeList<Element>;
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
