import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import { Image, ImageProps } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import React from 'react';
import { addHref } from 'hyperview/src/core/hyper-ref';
import urlParse from 'url-parse';
import { useProps } from 'hyperview/src/services';

const HvImage = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;
  const { screenUrl, skipHref } = options;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageProps: Record<string, any> = {};
  let source = element.getAttribute('source');
  if (source) {
    source = urlParse(source, screenUrl, true).toString();
    imageProps.source = { uri: source };
  }
  const componentProps = {
    ...useProps(element, stylesheets, options),
    ...imageProps,
  } as ImageProps;
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
