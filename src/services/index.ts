import * as Xml from 'hyperview/src/services/xml';
import { DEFAULT_PRESS_OPACITY, HV_TIMEOUT_ID_ATTR } from './types';
import type {
  DOMString,
  HvComponentOptions,
  StyleSheet,
  StyleSheets,
} from 'hyperview/src/types';
import { NODE_TYPE } from 'hyperview/src/types';
import { Platform } from 'react-native';

/**
 * This file is currently a dumping place for every functions used accross
 * various Hyperview components.
 */

export const createStyleProp = (
  element: Element,
  stylesheets: StyleSheets,
  options: HvComponentOptions,
): Array<StyleSheet> => {
  const styleAttr: string = options.styleAttr || 'style';
  if (!element.getAttribute(styleAttr)) {
    return [];
  }

  const styleValue: string = element.getAttribute(styleAttr) || '';
  const styleIds: Array<string> = Xml.splitAttributeList(styleValue);
  let styleRules: Array<StyleSheet> = styleIds.map(
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

/**
 * Sets the element's id attribute as a test id and accessibility label
 * (for testing automation purposes).
 */
export const createTestProps = (
  element: Element,
): {
  testID?: string;
  accessibilityLabel?: string;
} => {
  const testProps = {};
  const id: DOMString | null | undefined = element.getAttribute('id');
  if (!id) {
    return testProps;
  }
  if (Platform.OS === 'ios') {
    return { testID: id };
  }
  return { accessibilityLabel: id };
};

export const createProps = (
  element: Element,
  stylesheets: StyleSheets,
  options: HvComponentOptions,
) => {
  const numericRules = ['numberOfLines'];
  const booleanRules = ['multiline', 'selectable', 'adjustsFontSizeToFit'];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props: Record<string, any> = {};
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
      }
    }
  }

  props.style = createStyleProp(element, stylesheets, options);
  const testProps = createTestProps(element);
  return { ...props, ...testProps };
};

export const later = (delayMs: number): Promise<void> =>
  new Promise((resolve: (result?: Promise<never>) => void) =>
    setTimeout(resolve, delayMs),
  );

/**
 * Clones the element and moves all children from the original element
 * to the clone. The returned element will be a new object, but all of the child
 * nodes will be existing objects.
 */
export const shallowClone = (element: Element | Document): Element => {
  const newElement: Element = element.cloneNode(false) as Element;
  let childNode: Node | null | undefined = element.firstChild;
  while (childNode) {
    const nextChild: Node | null | undefined = childNode.nextSibling;
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
export const shallowCloneToRoot = (element: Element | Document): Document => {
  const elementClone: unknown = shallowClone(element);
  if (element.nodeType === 9) {
    return elementClone as Document;
  }

  // Need to check parentNode to satisfy Flow
  const { parentNode } = element;
  if (!parentNode) {
    return elementClone as Document;
  }

  parentNode.replaceChild(elementClone as Document, element);
  return shallowCloneToRoot(parentNode as Document);
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

  let childNode: Node | null | undefined = node.firstChild;
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
export const getElementByTimeoutId = (
  doc: Document,
  id: string,
): Element | null | undefined => {
  let foundElement: Element | null | undefined = null;
  const callback = (node: Node): boolean => {
    if (node.nodeType === NODE_TYPE.ELEMENT_NODE) {
      const element = node as Element;
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
): Element | null | undefined => {
  let { parentNode } = element;
  if (!parentNode) {
    return null;
  }

  while ((parentNode as Element).tagName !== tagName) {
    ({ parentNode } = parentNode);
    if (!parentNode) {
      return null;
    }
  }
  return parentNode as Element;
};

export const getNameValueFormInputValues = (
  element: Element,
): Array<[string, string]> => {
  const name = element.getAttribute('name');
  if (name) {
    return [[name, element.getAttribute('value') || '']];
  }
  return [];
};

export const encodeXml = (xml: string): string =>
  xml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
