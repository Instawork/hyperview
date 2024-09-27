import { Dimensions } from 'react-native';
import React from 'react';
import type { WebViewProps } from 'react-native-webview';

// Currently partially implemented, should be brought to parity
// with mobile in https://github.com/Instawork/hyperview/issues/455
export default (props: WebViewProps) => {
  const windowDimensions = Dimensions.get('window');
  const windowHeight = windowDimensions.height;
  const windowWidth = windowDimensions.width;
  const { source } = props;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Property 'uri' does not exist on type 'WebViewSource'.ts(2339)
  if (source?.uri) {
    return (
      <iframe
        height={windowHeight}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Property 'uri' does not exist on type 'WebViewSource'.ts(2339)
        src={props.source?.uri}
        title="-"
        width={windowWidth}
      />
    );
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Property 'html' does not exist on type 'WebViewSourceHtml'.ts(2339)
  if (props.source?.html) {
    // eslint-disable-next-line react/no-danger
    return <div dangerouslySetInnerHTML={{ __html: props.source.html }} />;
  }
  return '';
};
