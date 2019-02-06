// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  Element,
  HvComponentOnUpdate,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';
import { LOCAL_NAME, NODE_TYPE } from 'hyperview/src/types';
import { image, text, view } from 'hyperview/src';
import React from 'react';

export const renderElement = (
  element: Element,
  stylesheets: StyleSheets,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
) => {
  if (element.nodeType === NODE_TYPE.ELEMENT_NODE) {
    // Hidden elements don't get rendered
    if (element.getAttribute('hide') === 'true') {
      return null;
    }
  }
  if (element.nodeType === NODE_TYPE.COMMENT_NODE) {
    // XML comments don't get rendered.
    return null;
  }
  if (
    element.nodeType === NODE_TYPE.ELEMENT_NODE &&
    element.namespaceURI === Namespaces.HYPERVIEW
  ) {
    switch (element.localName) {
      case LOCAL_NAME.BODY:
      case LOCAL_NAME.VIEW:
      case LOCAL_NAME.FORM:
      case LOCAL_NAME.HEADER:
      case LOCAL_NAME.ITEM:
      case LOCAL_NAME.SECTION_TITLE:
        // TODO: Create HvView component
        return view(element, stylesheets, onUpdate, options);
      case LOCAL_NAME.IMAGE:
        // TODO: Create HvImage component
        return image(element, stylesheets, onUpdate, options);
      case LOCAL_NAME.TEXT:
        // TODO: Create HvText component
        return text(element, stylesheets, onUpdate, options);
      case LOCAL_NAME.BEHAVIOR:
      case LOCAL_NAME.MODIFIER:
      case LOCAL_NAME.STYLES:
      case LOCAL_NAME.STYLE:
        // Non-UI elements don't get rendered
        return null;
      default:
        break;
    }
  }

  if (
    element.nodeType === NODE_TYPE.ELEMENT_NODE &&
    element.namespaceURI &&
    element.localName
  ) {
    if (
      options.componentRegistry &&
      options.componentRegistry[element.namespaceURI] &&
      options.componentRegistry[element.namespaceURI][element.localName]
    ) {
      const Component =
        options.componentRegistry[element.namespaceURI][element.localName];
      return (
        <Component
          element={element}
          stylesheets={stylesheets}
          onUpdate={onUpdate}
          options={options}
        />
      );
    }

    // No component registered for the namespace/local name.
    // Warn in case this was an unintended mistake.
    console.warn(
      `No component registered for tag <${element.localName}> (namespace: ${
        element.namespaceURI
      })`,
    );
  }

  if (element.nodeType === NODE_TYPE.TEXT_NODE) {
    // Render non-empty text nodes
    if (element.nodeValue && element.nodeValue.trim().length > 0) {
      return element.nodeValue.trim();
    }
  }
  return null;
};

export const renderChildren = (
  element: Element,
  stylesheets: StyleSheets,
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
