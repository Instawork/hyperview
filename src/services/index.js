// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import { DEFAULT_PRESS_OPACITY, STYLE_ATTRIBUTE_SEPARATOR } from './types';
import type {
  Document,
  Element,
  HvComponentOnUpdate,
  HvComponentOptions,
  LocalName,
  Node,
  StyleSheets,
} from 'hyperview/src/types';
import HyperRef from 'hyperview/src/core/hyper-ref';
import React from 'react';
import type { StyleSheet } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

/**
 * This file is currently a dumping place for every functions used accross
 * various Hyperview components.
 */

export const getBehaviorElements = (element: any) => {
  const behaviorElements = Array.from(element.childNodes).filter(
    n => n.tagName === 'behavior',
  );

  if (element.getAttribute('href') || element.getAttribute('action')) {
    behaviorElements.unshift(element);
  }

  return behaviorElements;
};

export const getFirstTag = (document: Document, localName: LocalName) => {
  const elements = document.getElementsByTagNameNS(
    Namespaces.HYPERVIEW,
    localName,
  );
  if (elements && elements[0]) {
    return elements[0];
  }
  return null;
};

/**
 * Clones the element and moves all children from the original element
 * to the clone. The returned element will be a new object, but all of the child
 * nodes will be existing objects.
 */
export const shallowClone = (element: Node): Node => {
  const newElement: Element = element.cloneNode(false);
  let childNode: ?Node = element.firstChild;
  while (childNode !== null) {
    // This if is redundant with the while condition but it's needed to make Flow happy
    // by verifying that childNode is not null
    if (childNode) {
      const nextChild = childNode.nextSibling;
      newElement.appendChild(childNode);
      childNode = nextChild;
    }
  }
  return newElement;
};

/**
 * Clones all elements from the given element up to the root of the DOM.
 * Returns the new root object. Essentially, this produces a new DOM object
 * that re-uses as many existing nodes as possible.
 */
export const shallowCloneToRoot = (element: Node): Node => {
  const elementClone: Node = shallowClone(element);
  if (element.nodeType === 9) {
    return elementClone;
  }
  const parentNode: ?Node = element.parentNode;
  if (parentNode) {
    parentNode.replaceChild(elementClone, element);
    const parentClone = shallowCloneToRoot(parentNode);
    return parentClone;
  }
  return elementClone;
};

export const createStyleProp = (
  element: Element,
  stylesheets: StyleSheets,
  options: HvComponentOptions,
): Array<StyleSheet<*>> => {
  const styleAttr: string = options.styleAttr || 'style';
  if (!element.getAttribute(styleAttr)) {
    return [];
  }

  const styleValue: string = element.getAttribute(styleAttr) || '';
  const styleIds: Array<string> = styleValue.split(STYLE_ATTRIBUTE_SEPARATOR);
  let styleRules: Array<StyleSheet<*>> = styleIds.map(
    styleId => stylesheets.regular[styleId],
  );

  if (options.pressed) {
    let pressedRules = styleIds
      .map(styleId => stylesheets.pressed[styleId])
      .filter(Boolean);
    if (pressedRules.length === 0) {
      pressedRules = [{ opacity: DEFAULT_PRESS_OPACITY }];
    }
    styleRules = styleRules.concat(pressedRules);
  }

  if (options.focused) {
    const focusedRules = styleIds
      .map(s => stylesheets.focused[s])
      .filter(Boolean);
    styleRules = styleRules.concat(focusedRules);
  }

  if (options.selected) {
    const selectedRules = styleIds
      .map(s => stylesheets.selected[s])
      .filter(Boolean);
    styleRules = styleRules.concat(selectedRules);
  }

  if (options.pressedSelected) {
    const pressedSelectedRules = styleIds
      .map(s => stylesheets.pressedSelected[s])
      .filter(Boolean);
    styleRules = styleRules.concat(pressedSelectedRules);
  }

  return styleRules;
};

export const createProps = (
  element: Element,
  stylesheets: StyleSheets,
  options: HvComponentOptions,
) => {
  const numericRules = ['numberOfLines'];
  const booleanRules = ['multiline'];

  const props = {};
  if (!element.attributes) {
    return props;
  }
  for (let i = 0; i < element.attributes.length; i += 1) {
    const attr = element.attributes.item(i);
    if (attr) {
      if (numericRules.indexOf(attr.name) >= 0) {
        const intValue = parseInt(attr.value, 10);
        props[attr.name] = intValue || 0;
      } else if (booleanRules.indexOf(attr.name) >= 0) {
        props[attr.name] = attr.value === 'true';
      } else {
        props[attr.name] = attr.value;

        // Add the id attribute as a test id
        // (for testing automation purposes).
        if (attr.name === 'id') {
          props.testId = attr.value;
        }
      }
    }
  }

  props.style = createStyleProp(element, stylesheets, options);
  return props;
};

export const later = (delayMs: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, delayMs));

export const addHref = (
  component: any,
  element: Element,
  stylesheets: StyleSheets,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
) => {
  const href = element.getAttribute('href');
  const childNodes = element.childNodes ? Array.from(element.childNodes) : [];
  const behaviorElements = childNodes.filter(
    n => n && n.nodeType === 1 && n.tagName === 'behavior',
  );
  const hasBehaviors = href || behaviorElements.length > 0;
  if (!hasBehaviors) {
    return component;
  }

  return React.createElement(
    HyperRef,
    { element, stylesheets, onUpdate, options },
    ...Render.renderChildren(element, stylesheets, onUpdate, options),
  );
};
