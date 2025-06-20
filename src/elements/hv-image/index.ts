import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import { Image, ImageProps } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import React from 'react';
import { addHref } from 'hyperview/src/core/components/hyper-ref';
import { createProps } from 'hyperview/src/services';
import urlParse from 'url-parse';

const HvImage = (props: HvComponentProps) => {
  const { skipHref } = props.options || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageProps: Record<string, any> = {};
  let source = props.element.getAttribute('source');
  if (source) {
    source = urlParse(source, props.options.screenUrl, true).toString();
    imageProps.source = { uri: source };
  }
  const componentProps = {
    ...createProps(props.element, props.stylesheets, props.options),
    ...imageProps,
  } as ImageProps;
  const component = React.createElement(Image, componentProps);
  return skipHref
    ? component
    : addHref(
        component,
        props.element,
        props.stylesheets,
        props.onUpdate as HvComponentOnUpdate,
        props.options,
      );
};

HvImage.namespaceURI = Namespaces.HYPERVIEW;
HvImage.localName = LOCAL_NAME.IMAGE;

export default HvImage;
