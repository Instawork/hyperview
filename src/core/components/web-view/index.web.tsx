import { Dimensions } from 'react-native';
import React from 'react';

// Currently partially implemented, should be brought to parity
// with mobile in https://github.com/Instawork/hyperview/issues/455
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    return <div dangerouslySetInnerHTML={{ __html: props.source.html }} />;
  }
  return '';
};
