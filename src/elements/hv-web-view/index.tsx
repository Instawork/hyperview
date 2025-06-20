import * as Events from 'hyperview/src/services/events';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import WebView from 'hyperview/src/core/components/web-view';
import { createProps } from 'hyperview/src/services';

const HvWebView = (props: HvComponentProps) => {
  const [renderLoading, setRenderLoading] = useState(true);
  const onMessage = (
    event: {
      nativeEvent: {
        data: string;
      };
    } | null,
  ) => {
    if (!event) {
      return;
    }

    if (event.nativeEvent.data === 'hv-web-view:render-loading:false') {
      setRenderLoading(false);
    }
    const matches = event.nativeEvent.data.match(/^hyperview:(.*)$/);
    if (matches) {
      Events.dispatch(matches[1]);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const componentProps: any = createProps(
    props.element,
    props.stylesheets,
    props.options,
  );
  const allowsInlineMediaPlayback = componentProps[
    'allows-inline-media-playback'
  ]
    ? componentProps['allows-inline-media-playback'] === 'true'
    : undefined;
  const color = componentProps['activity-indicator-color'] || '#8d9494';
  const loadBehavior = componentProps['show-loading-indicator'];
  let injectedJavaScript = componentProps['injected-java-script'];
  if (loadBehavior === 'document-only') {
    injectedJavaScript +=
      'window.ReactNativeWebView.postMessage("hv-web-view:render-loading:false");';
  }
  const sharedCookiesEnabled = componentProps['shared-cookies-enabled']
    ? componentProps['shared-cookies-enabled'] === 'true'
    : undefined;
  const source = {
    html: componentProps.html,
    uri: componentProps.url,
  } as const;
  return (
    <WebView
      accessibilityLabel={componentProps.accessibilityLabel}
      allowsInlineMediaPlayback={allowsInlineMediaPlayback}
      injectedJavaScript={injectedJavaScript}
      onMessage={onMessage}
      renderLoading={() => {
        return renderLoading ? (
          <ActivityIndicator
            color={color}
            style={StyleSheet.absoluteFillObject}
          />
        ) : (
          <></>
        );
      }}
      sharedCookiesEnabled={sharedCookiesEnabled}
      source={source}
      startInLoadingState
      testID={componentProps.testID}
    />
  );
};

HvWebView.namespaceURI = Namespaces.HYPERVIEW;
HvWebView.localName = LOCAL_NAME.WEB_VIEW;

export default HvWebView;
