import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import React from 'react';
import { Text } from 'react-native';
import { addHref } from 'hyperview/src/core/hyper-ref';
import { createProps } from 'hyperview/src/services';

const HvText = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;

  const componentProps = createProps(element, stylesheets, options);

  // TODO: Replace with <HvChildren>
  const component = React.createElement(
    Text,
    componentProps,
    ...Render.renderChildren(
      element,
      stylesheets,
      onUpdate as HvComponentOnUpdate,
      {
        ...options,
        preformatted: element.getAttribute('preformatted') === 'true',
      },
    ),
  );

  const { skipHref } = options || {};
  return skipHref
    ? component
    : addHref(
        component,
        element,
        stylesheets,
        onUpdate as HvComponentOnUpdate,
        options,
      );
};

HvText.namespaceURI = Namespaces.HYPERVIEW;
HvText.localName = LOCAL_NAME.TEXT;

export default HvText;
