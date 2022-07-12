// @flow

import { Dimensions } from 'react-native';
import React from 'react';

export default (props: any) => {
  const windowDimensions = Dimensions.get('window');
  const windowHeight = windowDimensions.height;
  const windowWidth = windowDimensions.width;
  if (props.source.uri) {
    return (
      <iframe
        height={windowHeight}
        src={props.source.uri}
        title="-"
        width={windowWidth}
      />
    );
  }
  if (props.source.html) {
    return props.source.html;
  }
  return '';
};
