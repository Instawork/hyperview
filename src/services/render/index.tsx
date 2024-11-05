import * as InlineContext from 'hyperview/src/services/inline-context';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  HvComponent,
  HvComponentOnUpdate,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';
import { LOCAL_NAME, NODE_TYPE } from 'hyperview/src/types';
import React from 'react';

export const renderElement = (
  element: Element | null | undefined,
  stylesheets: StyleSheets,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): React.ReactElement<any> | null | string => {
  if (!element) {
    return null;
  }
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

  if (element.nodeType === NODE_TYPE.ELEMENT_NODE) {
    if (!element.namespaceURI) {
      Logging.warn('`namespaceURI` missing for node:', element.toString());
      return null;
    }
    if (!element.localName) {
      Logging.warn('`localName` missing for node:', element.toString());
      return null;
    }

    const Component:
      | HvComponent
      | undefined = options.componentRegistry?.getComponent(
      element.namespaceURI,
      element.localName,
    );

    if (Component) {
      // Prepare props for the component
      const props = {
        element,
        onUpdate,
        options: {
          ...options,
          inlineFormattingContext,
        },
        stylesheets,
      };

      // Conditionally render the component with a key if it exists, to avoid
      // warnings with current React versions, when the key attribute is set
      // using the spread operator.
      const key = element.getAttribute('key');

      if (key) {
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <Component {...props} key={key} />;
      }
      return <Component {...props} />; // eslint-disable-line react/jsx-props-no-spreading
    }

    // No component registered for the namespace/local name.
    // Warn in case this was an unintended mistake.
    Logging.warn(
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
          Logging.warn(
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
) => {
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
