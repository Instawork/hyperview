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
import {
  DEFAULT_PRESS_OPACITY,
  HV_TIMEOUT_ID_ATTR,
  STYLE_ATTRIBUTE_SEPARATOR,
} from './types';
import type {
  Document,
  Element,
  HvComponentOnUpdate,
  HvComponentOptions,
  LocalName,
  Node,
  NodeList,
  StyleSheets,
} from 'hyperview/src/types';
import { FORM_NAMES, LOCAL_NAME, NODE_TYPE } from 'hyperview/src/types';
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
  const booleanRules = ['multiline', 'selectable'];

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

        // Add the id attribute as a test id and accessibility label
        // (for testing automation purposes).
        if (attr.name === 'id') {
          props.testID = attr.value;
          props.accessibilityLabel = attr.value;
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
  const action = element.getAttribute('action');
  const childNodes = element.childNodes ? Array.from(element.childNodes) : [];
  const behaviorElements = childNodes.filter(
    n => n && n.nodeType === 1 && n.tagName === 'behavior',
  );
  const hasBehaviors = href || action || behaviorElements.length > 0;
  if (!hasBehaviors) {
    return component;
  }

  return React.createElement(
    HyperRef,
    { element, stylesheets, onUpdate, options },
    ...Render.renderChildren(element, stylesheets, onUpdate, options),
  );
};

/**
 * Clones the element and moves all children from the original element
 * to the clone. The returned element will be a new object, but all of the child
 * nodes will be existing objects.
 */
export const shallowClone = (element: Element): Element => {
  const newElement: Element = element.cloneNode(false);
  let childNode: ?Node = element.firstChild;
  while (childNode) {
    const nextChild: ?Node = childNode.nextSibling;
    newElement.appendChild(childNode);
    childNode = nextChild;
  }
  return newElement;
};

/**
 * Clones all elements from the given element up to the root of the DOM.
 * Returns the new root object. Essentially, this produces a new DOM object
 * that re-uses as many existing nodes as possible.
 */
export const shallowCloneToRoot = (element: Element): Document => {
  const elementClone: Element = shallowClone(element);
  if (element.nodeType === 9) {
    // Need to typecast here because Flow doesn't know that nodeType of 9 is a Document.
    return (elementClone: any);
  }

  // Need to check parentNode to satisfy Flow
  const parentNode: ?Node = element.parentNode;
  if (!parentNode) {
    return (elementClone: any);
  }

  parentNode.replaceChild(elementClone, element);
  return shallowCloneToRoot((parentNode: any));
};

/**
 * Taken from internals of xmldom library. Allows us to run a callback on a node tree.
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
const visitNode = (node: Node, callback: (n: Node) => boolean): boolean => {
  if (callback(node)) {
    return true;
  }

  let childNode: ?Node = node.firstChild;
  while (childNode) {
    if (visitNode(childNode, callback)) {
      return true;
    }
    childNode = childNode.nextSibling;
  }
  return false;
};

/**
 * Returns the element with the given timeout id.
 * Note this is different from the element's regular id, this is
 * used for tracking delayed behaviors.
 */
export const getElementByTimeoutId = (doc: Document, id: string): ?Element => {
  let foundElement: ?Element = null;
  const callback = (node: Node): boolean => {
    if (node.nodeType === NODE_TYPE.ELEMENT_NODE) {
      // We know the node is an element, so we can safely cast it.
      const element: Element = (node: any);
      if (element.getAttribute(HV_TIMEOUT_ID_ATTR) === id) {
        foundElement = element;
        return true;
      }
    }
    return false;
  };
  visitNode(doc, callback);
  return foundElement;
};

/**
 * Sets a timeout id on the given element.
 */
export const setTimeoutId = (element: Element, id: string) => {
  element.setAttribute(HV_TIMEOUT_ID_ATTR, id);
};

/**
 * Removed the timeout id from the given element.
 */
export const removeTimeoutId = (element: Element) => {
  element.removeAttribute(HV_TIMEOUT_ID_ATTR);
};

/**
 * Searches the parent chain from the given element until it finds an
 * element with the given tag name. If no ancestor with the tagName is found,
 * returns null.
 */
export const getAncestorByTagName = (
  element: Element,
  tagName: string,
): ?Element => {
  let parentNode: ?Node = element.parentNode;
  if (!parentNode) {
    return null;
  }

  while (parentNode.tagName !== tagName) {
    parentNode = parentNode.parentNode;
    if (!parentNode) {
      return null;
    }
  }
  return ((parentNode: any): Element);
};

/**
 * Creates a FormData object for the given element. Finds the closest form element ancestor
 * and adds data for all inputs contained in the form. Returns null if the element has no
 * form ancestor, or if there is no form data to send.
 * If the given element is a form element, its form data will be returned.
 */
export const getFormData = (element: Element): ?FormData => {
  const formElement: ?Element =
    element.tagName === 'form'
      ? element
      : getAncestorByTagName(element, 'form');
  if (!formElement) {
    return null;
  }

  const formData: FormData = new FormData();
  let formHasData = false;

  // TODO: It would be more flexible to grab any element with a name and value.
  FORM_NAMES
    // Get all inputs in the form
    .reduce((acc: Array<Element>, tag: LocalName) => {
      const inputElements: NodeList<Element> = formElement.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        tag,
      );
      for (let i = 0; i < inputElements.length; i += 1) {
        const inputElement = inputElements.item(i);
        if (inputElement) {
          acc.push(inputElement);
        }
      }
      return acc;
    }, [])
    // Append the form data for each input
    .forEach((input: Element) => {
      const name: ?string = input.getAttribute('name');
      if (!name) {
        return;
      }
      if (
        input.tagName === LOCAL_NAME.SELECT_SINGLE ||
        input.tagName === LOCAL_NAME.SELECT_MULTIPLE
      ) {
        // Add each selected option to the form data
        const optionElements: NodeList<Element> = input.getElementsByTagNameNS(
          Namespaces.HYPERVIEW,
          LOCAL_NAME.OPTION,
        );
        for (let i = 0; i < optionElements.length; i += 1) {
          const optionElement = optionElements.item(i);
          if (
            optionElement &&
            optionElement.getAttribute('selected') === 'true'
          ) {
            formData.append(name, optionElement.getAttribute('value') || '');
            formHasData = true;
          }
        }
      } else {
        // Add the text input to the form data
        formData.append(name, input.getAttribute('value') || '');
        formHasData = true;
      }
    });

  // Ensure that we only return form data with content in it. Otherwise, it will crash on Android
  return formHasData ? formData : null;
};

export const encodeXml = (xml: string): string =>
  xml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
