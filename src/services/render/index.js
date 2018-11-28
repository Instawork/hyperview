
// @flow

import * as Namespaces from 'hyperview/src/services/namespaces';
import type { Animations, Element, HvComponentOnUpdate, HvComponentOptions, StyleSheets } from 'hyperview/src/types';
import { LOCAL_NAME, NODE_TYPE } from 'hyperview/src/types';
import { image, text, view } from 'hyperview/App';
import React from 'react';

export const renderElement = (
  element: Element,
  stylesheets: StyleSheets,
  animations: Animations,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
) => {
  if (element.nodeType === NODE_TYPE.ELEMENT_NODE) {
    if (element.getAttribute('hide') === 'true') {
      return null;
    }
  }
  if (element.namespaceURI === Namespaces.HYPERVIEW) {
    switch (element.localName) {
      case LOCAL_NAME.BODY:
      case LOCAL_NAME.VIEW:
      case LOCAL_NAME.FORM:
      case LOCAL_NAME.HEADER:
      case LOCAL_NAME.ITEM:
      case LOCAL_NAME.SECTION_TITLE:
        // TODO: Create HvView component
        return view(element, stylesheets, animations, onUpdate, options);
      case LOCAL_NAME.IMAGE:
        // TODO: Create HvImage component
        return image(element, stylesheets, animations, onUpdate, options);
      case LOCAL_NAME.TEXT:
        // TODO: Create HvText component
        return text(element, stylesheets, animations, onUpdate, options);
      default:
        break;
    }
  }

  if (
    element.namespaceURI
    && element.localName
    && options.componentRegistry
    && options.componentRegistry[element.namespaceURI]
    && options.componentRegistry[element.namespaceURI][element.localName]
  ) {
    const Component = options.componentRegistry[element.namespaceURI][element.localName];
    return (
      <Component
        element={element}
        stylesheets={stylesheets}
        animations={animations}
        onUpdate={onUpdate}
        options={options}
      />
    );
  }

  if (element.nodeValue && element.nodeValue.trim().length > 0) {
    return element.nodeValue.trim();
  }
  return null;
};

export const renderChildren = (
  element: Element,
  stylesheets: StyleSheets,
  animations: Animations,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
) => {
  const children = [];
  // $FlowFixMe
  if (element.childNodes !== null) {
    for (let i = 0; i < element.childNodes.length; i += 1) {
      const e = renderElement(
        element.childNodes.item(i),
        stylesheets,
        animations,
        onUpdate,
        { ...options, skipHref: false },
      );
      if (e) {
        children.push(e);
      }
    }
  }
  return children;
};
