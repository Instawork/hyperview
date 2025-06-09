import * as Xml from 'hyperview/src/services/xml';
import { DEFAULT_PRESS_OPACITY, HV_TIMEOUT_ID_ATTR } from './types';
import type {
  HvComponentOptions,
  StyleSheet,
  StyleSheets,
} from 'hyperview/src/types';
import { NODE_TYPE } from 'hyperview/src/types';
import { Platform } from 'react-native';
import { useMemo } from 'react';

/**
 * This file is currently a dumping place for every functions used accross
 * various Hyperview components.
 */

type StyleRule = Record<string, unknown>;

const getStyleRules = (
  styleIds: string[],
  stylesheet: Record<string, StyleRule>,
  fallback?: StyleRule,
): StyleRule[] => {
  if (styleIds.length === 0) {
    return [];
  }
  const rules = styleIds.map(styleId => stylesheet[styleId]).filter(Boolean);
  if (rules.length > 0) {
    return rules;
  }
  return fallback ? [fallback] : [];
};

export const useStyleProp = (
  element: Element,
  stylesheets: StyleSheets,
  options: HvComponentOptions,
): Array<StyleSheet> => {
  const { styleAttr, focused, pressed, pressedSelected, selected } = options;

  const styleIds = useMemo(() => {
    const value = element.getAttribute(styleAttr || 'style');
    if (typeof value !== 'string') {
      return [];
    }
    return Xml.splitAttributeList(value);
  }, [element, styleAttr]);

  const baseStyleRules = useMemo(() => {
    return styleIds.map(styleId => stylesheets.regular[styleId]);
  }, [styleIds, stylesheets.regular]);

  const pressedRules = useMemo(() => {
    if (!pressed) {
      return [];
    }
    return getStyleRules(styleIds, stylesheets.pressed, {
      opacity: DEFAULT_PRESS_OPACITY,
    });
  }, [pressed, styleIds, stylesheets.pressed]);

  const focusedRules = useMemo(() => {
    if (!focused) {
      return [];
    }
    return getStyleRules(styleIds, stylesheets.focused);
  }, [focused, styleIds, stylesheets.focused]);

  const selectedRules = useMemo(() => {
    if (!selected) {
      return [];
    }
    return getStyleRules(styleIds, stylesheets.selected);
  }, [selected, styleIds, stylesheets.selected]);

  const pressedSelectedRules = useMemo(() => {
    if (!pressedSelected) {
      return [];
    }
    return getStyleRules(styleIds, stylesheets.pressedSelected);
  }, [pressedSelected, styleIds, stylesheets.pressedSelected]);

  return useMemo(() => {
    return [
      ...baseStyleRules,
      ...pressedRules,
      ...focusedRules,
      ...selectedRules,
      ...pressedSelectedRules,
    ];
  }, [
    baseStyleRules,
    pressedRules,
    focusedRules,
    selectedRules,
    pressedSelectedRules,
  ]);
};

/**
 * This is the legacy createStyleProp function. Replace implementations
 * with useStyleProp for better performance.
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
export const createTestProps = (element: Element) => {
  const id = element.getAttribute('id');
  if (!id) {
    return {};
  }
  return Platform.OS === 'ios' ? { testID: id } : { accessibilityLabel: id };
};

const ATTRIBUTE_TYPES: Record<
  string,
  'numeric' | 'boolean' | 'float' | 'string'
> = {
  adjustsFontSizeToFit: 'boolean',
  allowFontScaling: 'boolean',
  maxFontSizeMultiplier: 'float',
  minimumFontScale: 'float',
  multiline: 'boolean',
  numberOfLines: 'numeric',
  selectable: 'boolean',
};

const parseAttributeValue = (attr: Attr) => {
  const type = ATTRIBUTE_TYPES[attr.name];
  if (!type) {
    return attr.value;
  }

  switch (type) {
    case 'numeric':
      return parseInt(attr.value, 10) || 0;
    case 'boolean':
      return attr.value === 'true';
    case 'float':
      return parseFloat(attr.value) || 0;
    default:
      return attr.value;
  }
};

export const useProps = (
  element: Element,
  stylesheets: StyleSheets,
  options: HvComponentOptions,
) => {
  const { attributes } = element;
  const { focused, pressed, pressedSelected, selected, styleAttr } = options;

  const style = useStyleProp(element, stylesheets, {
    focused,
    pressed,
    pressedSelected,
    selected,
    styleAttr,
  });

  const testProps = useMemo(() => createTestProps(element), [element]);

  const parsedAttributes = useMemo(() => {
    if (!attributes) {
      return {};
    }

    const props: Record<string, unknown> = {};
    Array.from(attributes).forEach(attr => {
      props[attr.name] = parseAttributeValue(attr);
    });
    return props;
  }, [attributes]);

  return useMemo(
    () => ({
      ...parsedAttributes,
      style,
      ...testProps,
    }),
    [parsedAttributes, style, testProps],
  );
};

/**
 * This is the legacy createProps function. Replace implementations
 * with useProps for better performance.
 */
export const createProps = (
  element: Element,
  stylesheets: StyleSheets,
  options: HvComponentOptions,
) => {
  const numericRules = ['numberOfLines'];
  const booleanRules = [
    'adjustsFontSizeToFit',
    'allowFontScaling',
    'multiline',
    'selectable',
  ];
  const floatRules = ['maxFontSizeMultiplier', 'minimumFontScale'];

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
      } else if (floatRules.indexOf(attr.name) >= 0) {
        const floatValue = parseFloat(attr.value);
        props[attr.name] = floatValue || 0;
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
