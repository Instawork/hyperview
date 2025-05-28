import * as InlineContext from 'hyperview/src/services/inline-context';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { LOCAL_NAME, NODE_TYPE } from 'hyperview/src/types';
import React, { useMemo } from 'react';
import type { HvComponentProps } from 'hyperview/src/types';
import { isRenderableElement } from 'hyperview/src/core/utils';

export default (props: HvComponentProps): JSX.Element | null | string => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;
  const { localName, namespaceURI, nodeType } = element;
  const { componentRegistry, inlineFormattingContext, preformatted } = options;

  const formattingContext = useMemo(() => {
    if (
      !preformatted &&
      !inlineFormattingContext &&
      nodeType === NODE_TYPE.ELEMENT_NODE &&
      localName === LOCAL_NAME.TEXT
    ) {
      return InlineContext.formatter(element);
    }
    return inlineFormattingContext;
  }, [element, inlineFormattingContext, localName, nodeType, preformatted]);

  const componentProps = useMemo(() => {
    return {
      element,
      onUpdate,
      options: {
        ...options,
        inlineFormattingContext: formattingContext,
      },
      stylesheets,
    };
  }, [element, formattingContext, onUpdate, options, stylesheets]);

  const Component = useMemo(() => {
    if (nodeType === NODE_TYPE.ELEMENT_NODE && namespaceURI && localName) {
      return componentRegistry?.getComponent(namespaceURI, localName);
    }
    return undefined;
  }, [localName, namespaceURI, nodeType, componentRegistry]);

  // Check if the element is renderable before rendering the component
  if (!isRenderableElement(element, options, formattingContext)) {
    return null;
  }

  if (nodeType === NODE_TYPE.ELEMENT_NODE) {
    if (Component) {
      // Prepare props for the component

      // Conditionally render the component with a key if it exists, to avoid
      // warnings with current React versions, when the key attribute is set
      // using the spread operator.
      const key = element.getAttribute('key');

      if (key) {
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <Component {...componentProps} key={key} />;
      }
      return <Component {...componentProps} />; // eslint-disable-line react/jsx-props-no-spreading
    }
  }

  if (nodeType === NODE_TYPE.TEXT_NODE) {
    // Render non-empty text nodes, when wrapped inside a <text> element
    if (element.nodeValue) {
      if (
        ((element.parentNode as Element)?.namespaceURI ===
          Namespaces.HYPERVIEW &&
          (element.parentNode as Element)?.localName === LOCAL_NAME.TEXT) ||
        (element.parentNode as Element)?.namespaceURI !== Namespaces.HYPERVIEW
      ) {
        if (preformatted) {
          return element.nodeValue;
        }
        // When inline formatting context exists, lookup formatted value using node's index.
        if (formattingContext) {
          const index = formattingContext[0].indexOf(element);
          return formattingContext[1][index];
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

  if (nodeType === NODE_TYPE.CDATA_SECTION_NODE) {
    return element.nodeValue;
  }
  return null;
};
