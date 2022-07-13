// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as InlineContext from 'hyperview/src/services/inline-context';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  Element,
  HvComponentOnUpdate,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';
import { LOCAL_NAME, NODE_TYPE } from 'hyperview/src/types';
import React from 'react';

export const renderElement = (
  element: Element,
  stylesheets: StyleSheets,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
): ?React$Element<any> | ?string => {
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

  // Initialize inline formatting context for <text> elements when not already defined
  let { inlineFormattingContext } = options;
  if (
    !options.preformatted &&
    !inlineFormattingContext &&
    element.nodeType === NODE_TYPE.ELEMENT_NODE &&
    element.localName === LOCAL_NAME.TEXT
  ) {
    inlineFormattingContext = InlineContext.formatter(element);
  }

  const componentOptions = {
    ...options,
    inlineFormattingContext,
  };

  if (element.nodeType === NODE_TYPE.ELEMENT_NODE) {
    if (!element.namespaceURI) {
      console.warn('`namespaceURI` missing for node:', element.toString());
      return null;
    }
    if (!element.localName) {
      console.warn('`localName` missing for node:', element.toString());
      return null;
    }

    if (
      options.componentRegistry &&
      options.componentRegistry[element.namespaceURI] &&
      options.componentRegistry[element.namespaceURI][element.localName]
    ) {
      const Component =
        options.componentRegistry[element.namespaceURI][element.localName];

      // Use object spreading instead of explicitly setting the key (to potentially undefined values)
      // Explicitly setting the key causes collision when several components render with `undefined` value for `key`
      // Object spreading will define the prop only when its value is truthy
      const extraProps = {
        key: element.getAttribute('key'),
      };
      if (!extraProps.key) {
        delete extraProps.key;
      }
      return (
        <Component
          element={element}
          onUpdate={onUpdate}
          options={componentOptions}
          stylesheets={stylesheets}
          {...extraProps} // eslint-disable-line react/jsx-props-no-spreading
        />
      );
    }

    // No component registered for the namespace/local name.
    // Warn in case this was an unintended mistake.
    console.warn(
      `No component registered for tag <${element.localName}> (namespace: ${element.namespaceURI})`,
    );
  }

  if (element.nodeType === NODE_TYPE.TEXT_NODE) {
    // Render non-empty text nodes, when wrapped inside a <text> element
    if (element.nodeValue) {
      if (
        (element.parentNode?.namespaceURI === Namespaces.HYPERVIEW &&
          element.parentNode?.localName === LOCAL_NAME.TEXT) ||
        element.parentNode?.namespaceURI !== Namespaces.HYPERVIEW
      ) {
        if (options.preformatted) {
          return element.nodeValue;
        }
        // When inline formatting context exists, lookup formatted value using node's index.
        if (inlineFormattingContext) {
          const index = inlineFormattingContext[0].indexOf(element);
          return inlineFormattingContext[1][index];
        }

        // Other strings might be whitespaces in non text elements, which we ignore
        // However we raise a warning when the string isn't just composed of whitespaces.
        const trimmedValue = element.nodeValue.trim();
        if (trimmedValue.length > 0) {
          console.warn(
            `Text string "${trimmedValue}" must be rendered within a <text> element`,
          );
        }
      }
    }
  }

  if (element.nodeType === NODE_TYPE.CDATA_SECTION_NODE) {
    return element.nodeValue;
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
  if (element.childNodes) {
    const { childNodes } = element;
    for (let i = 0; i < childNodes.length; i += 1) {
      const e = renderElement(
        // $FlowFixMe
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
