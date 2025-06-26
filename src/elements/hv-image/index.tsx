import * as Namespaces from 'hyperview/src/services/namespaces';
import React, { useMemo } from 'react';
import type { HvComponentProps } from 'hyperview/src/types';
import { Image } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import { createProps } from 'hyperview/src/services';
import urlParse from 'url-parse';

const HvImage = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, options, stylesheets } = props;
  const { screenUrl } = options;
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

  return React.createElement(Image, componentProps);
};

HvImage.namespaceURI = Namespaces.HYPERVIEW;
HvImage.localName = LOCAL_NAME.IMAGE;
HvImage.supportsHyperRef = true;

export default HvImage;
