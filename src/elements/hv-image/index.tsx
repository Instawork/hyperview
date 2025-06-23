import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import React, { useMemo } from 'react';
import { Image } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import { addHref } from 'hyperview/src/core/components/hyper-ref';
import { createProps } from 'hyperview/src/services';
import urlParse from 'url-parse';

const HvImage = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;
  const { screenUrl, skipHref } = options;
  const componentProps = useMemo(() => {
    const baseProps = createProps(element, stylesheets, options);
    const source = element.getAttribute('source');
    if (!source) {
      return baseProps;
    }
    return {
      ...baseProps,
      source: { uri: urlParse(source, screenUrl, true).toString() },
    };
  }, [element, screenUrl, stylesheets, options]);

  const component = React.createElement(Image, componentProps);

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

HvImage.namespaceURI = Namespaces.HYPERVIEW;
HvImage.localName = LOCAL_NAME.IMAGE;

export default HvImage;
