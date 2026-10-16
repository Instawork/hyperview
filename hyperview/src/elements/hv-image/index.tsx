import * as Namespaces from 'hyperview/src/services/namespaces';
import type { HvComponentProps } from 'hyperview/src/types';
import { Image } from 'react-native';
import type { ImageProps } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import React from 'react';
import { createProps } from 'hyperview/src/services';
import urlParse from 'url-parse';

const HvImage = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { options } = props;
  const { screenUrl } = options;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageProps: Record<string, any> = {};
  let source = props.element.getAttribute('source');
  if (source) {
    source = urlParse(source, screenUrl, true).toString();
    imageProps.source = { uri: source };
  }
  const componentProps = {
    ...createProps(props.element, props.stylesheets, props.options),
    ...imageProps,
  } as ImageProps;

  return React.createElement(Image, componentProps);
};

HvImage.namespaceURI = Namespaces.HYPERVIEW;
HvImage.localName = LOCAL_NAME.IMAGE;
HvImage.supportsHyperRef = true;

export default HvImage;
