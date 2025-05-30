import * as InlineContext from 'hyperview/src/services/inline-context';
import type {
  HvComponentOnUpdate,
  HvComponentOptions,
  HvComponentProps,
  StyleSheets,
} from 'hyperview/src/types';
import { LOCAL_NAME, NODE_TYPE } from 'hyperview/src/types';
import HvElement from 'hyperview/src/core/components/hv-element';
import React from 'react';
import { isRenderableElement } from 'hyperview/src/core/utils';

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

/**
 * Converts an element's childNodes into an array of HvElement components.
 * @returns An array of HvElement components.
 */
export const buildChildArray = (
  element: Element,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
  stylesheets: StyleSheets,
): Array<React.ReactElement<HvComponentProps> | null | string> => {
  if (!element || !element.childNodes) {
    return [];
  }
  return Array.from(element.childNodes).map(node => {
    const nodeElement = node as Element;
    const key = nodeElement?.getAttribute?.('key');
    if (key && key !== '') {
      return (
        <HvElement
          key={key}
          element={nodeElement}
          onUpdate={onUpdate}
          options={options}
          stylesheets={stylesheets}
        />
      );
    }
    return (
      <HvElement
        element={nodeElement}
        onUpdate={onUpdate}
        options={options}
        stylesheets={stylesheets}
      />
    );
  });
};
