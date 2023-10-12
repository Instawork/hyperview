/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// THIS FILE CONTAINS TS VERSIONS OF TYPES AND CONSTANTS FROM /src/types.js
// THE COMPLETE TS MIGRATION OF THE TYPES FILE WILL REPLACE THIS
// CHANGES MADE TO ANY IMPLEMENTATIONS ARE NOTEDED BELOW AND MARKED WITH ***** ADDED *****

/**
 * Minimal local name type copy from 'hyperview/src/types.js'
 */
export const LOCAL_NAME = {
  DOC: 'doc',
  // ***** ADDED *****
  NAV_ROUTE: 'nav-route',
  // ***** ADDED *****
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

export type NamespaceURI = string;

export type NodeList<T> = {
  length: number;
  item: (index: number) => T | null | undefined;
} & {
  [index: number]: T;
};

/**
 * Minimal NavigationRouteParams type copy from 'hyperview/src/types.js'
 */
export type NavigationRouteParams = {
  delay?: number;
  preloadScreen?: number;
  // ***** ADDED *****
  targetId?: string;
  url?: string;
};

export type HvBehavior = {
  action: string;
  callback: (
    element: Element,
    onUpdate: unknown,
    getRoot: unknown,
    updateRoot: unknown,
  ) => void;
};

export type HvComponent = unknown;

export type ComponentRegistry = {
  [key: string]: {
    [key: string]: HvComponent;
  };
};

export type StyleSheet = unknown;
