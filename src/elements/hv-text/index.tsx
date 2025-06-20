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
  const Component = () => {
    const componentProps = createProps(
      props.element,
      props.stylesheets,
      props.options,
    );

    // TODO: Replace with <HvChildren>
    return React.createElement(
      Text,
      componentProps,
      ...Render.renderChildren(
        props.element,
        props.stylesheets,
        props.onUpdate as HvComponentOnUpdate,
        {
          ...props.options,
          preformatted: props.element.getAttribute('preformatted') === 'true',
        },
      ),
    );
  };

  const { skipHref } = props.options || {};

  return skipHref ? (
    <Component />
  ) : (
    addHref(
      <Component />,
      props.element,
      props.stylesheets,
      props.onUpdate as HvComponentOnUpdate,
      props.options,
    )
  );
};

HvText.namespaceURI = Namespaces.HYPERVIEW;
HvText.localName = LOCAL_NAME.TEXT;

export default HvText;
