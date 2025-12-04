import * as InlineContext from 'hyperview/src/services/inline-context';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  HvComponentOnUpdate,
  HvComponentOptions,
  HvComponentProps,
  StyleSheets,
} from 'hyperview/src/types';
import { LOCAL_NAME, NODE_TYPE } from 'hyperview/src/types';
import HvElement from 'hyperview/src/components/hv-element';
import React from 'react';

/**
 * Checks if an element should be rendered based on the element type and options
 * Logging warnings for unexpected conditions
 * @param {Element} element
 * @param {HvComponentOptions} options
 * @param {InlineContext} inlineFormattingContext
 * @returns {boolean}
 */
export const isRenderableElement = (
  element: Element,
  options: HvComponentOptions,
  inlineFormattingContext: [Node[], string[]] | null | undefined,
): boolean => {
  if (!element) {
    return false;
  }
  if (
    element.nodeType === NODE_TYPE.ELEMENT_NODE &&
    element.getAttribute('hide') === 'true'
  ) {
    // Hidden elements don't get rendered
    return false;
  }
  if (element.nodeType === NODE_TYPE.COMMENT_NODE) {
    // XML comments don't get rendered.
    return false;
  }
  if (
    element.nodeType === NODE_TYPE.ELEMENT_NODE &&
    element.namespaceURI === Namespaces.HYPERVIEW
  ) {
    switch (element.localName) {
      case LOCAL_NAME.BEHAVIOR:
      case LOCAL_NAME.MODIFIER:
      case LOCAL_NAME.STYLES:
      case LOCAL_NAME.STYLE:
        // Non-UI elements don't get rendered
        return false;
      default:
        break;
    }
  }

  if (element.nodeType === NODE_TYPE.ELEMENT_NODE) {
    if (!element.namespaceURI) {
      Logging.warn('`namespaceURI` missing for node:', element.toString());
      return false;
    }
    if (!element.localName) {
      Logging.warn('`localName` missing for node:', element.toString());
      return false;
    }

    if (
      options.componentRegistry?.getComponent(
        element.namespaceURI,
        element.localName,
      )
    ) {
      // Has a component registered for the namespace/local name.
      return true;
    }
    // No component registered for the namespace/local name.
    // Log an info event in case this was an unintended mistake.
    Logging.info(
      `No component registered for tag <${element.localName}> (namespace: ${element.namespaceURI})`,
    );
  }

  if (element.nodeType === NODE_TYPE.TEXT_NODE) {
    // Render non-empty text nodes, when wrapped inside a <text> element
    if (element.nodeValue) {
      if (
        ((element.parentNode as Element)?.namespaceURI ===
          Namespaces.HYPERVIEW &&
          (element.parentNode as Element)?.localName === LOCAL_NAME.TEXT) ||
        (element.parentNode as Element)?.namespaceURI !== Namespaces.HYPERVIEW
      ) {
        if (options.preformatted) {
          return true;
        }
        // When inline formatting context exists, lookup formatted value using node's index.
        if (inlineFormattingContext) {
          return true;
        }
      }
    }
  }

  if (element.nodeType === NODE_TYPE.CDATA_SECTION_NODE) {
    return true;
  }
  return false;
};

export const renderElement = (
  element: Element | null | undefined,
  stylesheets: StyleSheets,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
): React.ReactElement<HvComponentProps> | null | string => {
  if (!element) {
    return null;
  }

  const inlineFormattingContext =
    !options.preformatted &&
    !options.inlineFormattingContext &&
    element.nodeType === NODE_TYPE.ELEMENT_NODE &&
    element.localName === LOCAL_NAME.TEXT
      ? InlineContext.formatter(element)
      : options.inlineFormattingContext;

  // Check if the element is renderable before rendering the component
  if (!isRenderableElement(element, options, inlineFormattingContext)) {
    return null;
  }

  const key = element.getAttribute?.('key');
  if (key && key !== '') {
    return (
      <HvElement
        key={key}
        element={element}
        onUpdate={onUpdate}
        options={options}
        stylesheets={stylesheets}
      />
    );
  }
  return (
    <HvElement
      element={element}
      onUpdate={onUpdate}
      options={options}
      stylesheets={stylesheets}
    />
  );
};

export const renderChildren = (
  element: Element,
  stylesheets: StyleSheets,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
): Array<React.ReactElement<HvComponentProps> | null | string> => {
  if (element.childNodes) {
    return renderChildNodes(
      Array.from(element.childNodes),
      stylesheets,
      onUpdate,
      options,
    );
  }
  return [];
};

/**
 * This alternate renderChildren function allows for passing an external
 * childNodes array, which can be useful when filtering out specific nodes.
 */
export const renderChildNodes = (
  childNodes: ChildNode[],
  stylesheets: StyleSheets,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
): Array<React.ReactElement<HvComponentProps> | null | string> => {
  const children = [];
  for (let i = 0; i < childNodes.length; i += 1) {
    const e = renderElement(childNodes[i] as Element, stylesheets, onUpdate, {
      ...options,
      skipHref: false,
    });
    if (e) {
      children.push(e);
    }
  }
  return children;
};
