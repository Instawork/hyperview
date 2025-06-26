import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import React, { useCallback } from 'react';
import { LOCAL_NAME } from 'hyperview/src/types';
import { Text } from 'react-native';
import { createProps } from 'hyperview/src/services';

const HvText = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;

  const Component = useCallback(() => {
    const componentProps = createProps(element, stylesheets, options);

    // TODO: Replace with <HvChildren>
    return React.createElement(
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
  }, [element, onUpdate, options, stylesheets]);

  return <Component />;
};

HvText.namespaceURI = Namespaces.HYPERVIEW;
HvText.localName = LOCAL_NAME.TEXT;

export default HvText;
