import * as InlineContext from 'hyperview/src/services/inline-context';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { LOCAL_NAME, NODE_TYPE } from 'hyperview/src/types';
import React, { useMemo } from 'react';
import type { HvComponentProps } from 'hyperview/src/types';

export default (
  props: HvComponentProps,
): React.ReactElement<HvComponentProps> | null | string => {
  if (!props.element) {
    return null;
  }

  if (props.element.nodeType === NODE_TYPE.ELEMENT_NODE) {
    // Hidden elements don't get rendered
    if (props.element.getAttribute('hide') === 'true') {
      return null;
    }
  }
  if (props.element.nodeType === NODE_TYPE.COMMENT_NODE) {
    // XML comments don't get rendered.
    return null;
  }
  if (
    props.element.nodeType === NODE_TYPE.ELEMENT_NODE &&
    props.element.namespaceURI === Namespaces.HYPERVIEW
  ) {
    switch (props.element.localName) {
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

  const formattingContext = useMemo(() => {
    let { inlineFormattingContext } = props.options;
    if (
      !props.options.preformatted &&
      !inlineFormattingContext &&
      props.element.nodeType === NODE_TYPE.ELEMENT_NODE &&
      props.element.localName === LOCAL_NAME.TEXT
    ) {
      inlineFormattingContext = InlineContext.formatter(props.element);
    }
    return inlineFormattingContext;
  }, [props.element, props.options]);

  const componentProps = useMemo(() => {
    return {
      element: props.element,
      onUpdate: props.onUpdate,
      options: {
        ...props.options,
        inlineFormattingContext: formattingContext,
      },
      stylesheets: props.stylesheets,
    };
  }, [
    props.element,
    formattingContext,
    props.onUpdate,
    props.options,
    props.stylesheets,
  ]);

  const Component = useMemo(() => {
    if (
      props.element.nodeType === NODE_TYPE.ELEMENT_NODE &&
      props.element.namespaceURI &&
      props.element.localName
    ) {
      return props.options.componentRegistry?.getComponent(
        props.element.namespaceURI,
        props.element.localName,
      );
    }
    return undefined;
  }, [props.element, props.options.componentRegistry]);

  if (props.element.nodeType === NODE_TYPE.ELEMENT_NODE) {
    if (!props.element.namespaceURI) {
      Logging.warn(
        '`namespaceURI` missing for node:',
        props.element.toString(),
      );
      return null;
    }
    if (!props.element.localName) {
      Logging.warn('`localName` missing for node:', props.element.toString());
      return null;
    }

    if (Component) {
      // Prepare props for the component

      // Conditionally render the component with a key if it exists, to avoid
      // warnings with current React versions, when the key attribute is set
      // using the spread operator.
      const key = props.element.getAttribute('key');

      if (key) {
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <Component {...componentProps} key={key} />;
      }
      return <Component {...componentProps} />; // eslint-disable-line react/jsx-props-no-spreading
    }

    // No component registered for the namespace/local name.
    // Warn in case this was an unintended mistake.
    Logging.warn(
      `No component registered for tag <${props.element.localName}> (namespace: ${props.element.namespaceURI})`,
    );
  }

  if (props.element.nodeType === NODE_TYPE.TEXT_NODE) {
    // Render non-empty text nodes, when wrapped inside a <text> element
    if (props.element.nodeValue) {
      if (
        ((props.element.parentNode as Element)?.namespaceURI ===
          Namespaces.HYPERVIEW &&
          (props.element.parentNode as Element)?.localName ===
            LOCAL_NAME.TEXT) ||
        (props.element.parentNode as Element)?.namespaceURI !==
          Namespaces.HYPERVIEW
      ) {
        if (props.options.preformatted) {
          return props.element.nodeValue;
        }
        // When inline formatting context exists, lookup formatted value using node's index.
        if (formattingContext) {
          const index = formattingContext[0].indexOf(props.element);
          return formattingContext[1][index];
        }

        // Other strings might be whitespaces in non text elements, which we ignore
        // However we raise a warning when the string isn't just composed of whitespaces.
        const trimmedValue = props.element.nodeValue.trim();
        if (trimmedValue.length > 0) {
          Logging.warn(
            `Text string "${trimmedValue}" must be rendered within a <text> element`,
          );
        }
      }
    }
  }

  if (props.element.nodeType === NODE_TYPE.CDATA_SECTION_NODE) {
    return props.element.nodeValue;
  }
  return null;
};
