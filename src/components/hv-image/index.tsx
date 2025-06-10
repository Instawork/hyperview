import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import React, { useMemo } from 'react';
import { Image } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import { addHref } from 'hyperview/src/core/hyper-ref';
import urlParse from 'url-parse';
import { useProps } from 'hyperview/src/services';

const HvImage = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;
  const { screenUrl, skipHref } = options;
  const baseProps = useProps(element, stylesheets, options);
  const source = useMemo(() => element.getAttribute('source'), [element]);
  const componentProps = useMemo(() => {
    if (!source) {
      return baseProps;
    }
    return {
      ...baseProps,
      source: { uri: urlParse(source, screenUrl, true).toString() },
    };
  }, [baseProps, screenUrl, source]);

  const component = useMemo(() => React.createElement(Image, componentProps), [
    componentProps,
  ]);
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
