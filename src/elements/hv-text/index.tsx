import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import React from 'react';
import { Text } from 'react-native';
import { addHref } from 'hyperview/src/core/components/hyper-ref';
import { createProps } from 'hyperview/src/services';

const HvText = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;
  const { skipHref } = options || {};

  const Component = (p: { element: Element }) => {
    const componentProps = createProps(element, stylesheets, options);

    // TODO: Replace with <HvChildren>
    return React.createElement(
      Text,
      componentProps,
      ...Render.renderChildren(
        p.element,
        stylesheets,
        onUpdate as HvComponentOnUpdate,
        {
          ...options,
          preformatted: p.element.getAttribute('preformatted') === 'true',
        },
      ),
    );
  };

  return skipHref ? (
    <Component element={element} />
  ) : (
    addHref(
      <Component element={element} />,
      element,
      stylesheets,
      onUpdate as HvComponentOnUpdate,
      options,
    )
  );
};

HvText.namespaceURI = Namespaces.HYPERVIEW;
HvText.localName = LOCAL_NAME.TEXT;

export default HvText;
