import * as Events from 'hyperview/src/services/events';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { ActivityIndicator, StyleSheet } from 'react-native';
import React, { useCallback, useContext, useState } from 'react';
import { ContentInsetsContext } from 'hyperview/src/components/scroll/context';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import WebView from 'hyperview/src/components/web-view';
import { createProps } from 'hyperview/src/services';

const HvWebView = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, options, stylesheets } = props;

  const [renderLoading, setRenderLoading] = useState(true);
  const onMessage = useCallback(
    (
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
    },
    [],
  );

  const componentProps = createProps(element, stylesheets, options);
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
  const contentInsets = useContext(ContentInsetsContext);
  const contentInsetsRequested =
    element.getAttributeNS(Namespaces.HYPERVIEW_SCROLL, 'content-insets') ===
    'true';
  const contentInsetsEnabled = contentInsets !== null && contentInsetsRequested;
  if (contentInsetsEnabled) {
    injectedJavaScript ||= '';
    injectedJavaScript += `document.documentElement.style.setProperty('--hyperview-content-inset-bottom', '${contentInsets.bottom}px'); true;`;
  }
  const webviewDebuggingEnabled = componentProps.debug === 'true' || __DEV__;
  const source = {
    html: componentProps.html,
    uri: componentProps.url,
  } as const;
  return (
    <WebView
      accessibilityLabel={componentProps.accessibilityLabel}
      allowsInlineMediaPlayback={allowsInlineMediaPlayback}
      // The document handles the inset; automatic would add a second native scroll range.
      contentInsetAdjustmentBehavior={
        contentInsetsEnabled ? 'never' : undefined
      }
      injectedJavaScript={injectedJavaScript}
      onMessage={onMessage}
      renderLoading={() => {
        return renderLoading ? (
          <ActivityIndicator color={color} style={StyleSheet.absoluteFill} />
        ) : (
          <></>
        );
      }}
      sharedCookiesEnabled={sharedCookiesEnabled}
      source={source}
      startInLoadingState
      testID={componentProps.testID}
      webviewDebuggingEnabled={webviewDebuggingEnabled}
    />
  );
};

HvWebView.namespaceURI = Namespaces.HYPERVIEW;
HvWebView.localName = LOCAL_NAME.WEB_VIEW;

export default HvWebView;
