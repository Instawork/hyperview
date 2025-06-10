import * as Events from 'hyperview/src/services/events';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { ActivityIndicator, StyleSheet } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import WebView from 'hyperview/src/core/components/web-view';
import { useProps } from 'hyperview/src/services';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const componentProps: any = useProps(element, stylesheets, options);

  const webViewProps = useMemo(() => {
    const loadBehavior = componentProps['show-loading-indicator'];
    let injectedJavaScript = componentProps['injected-java-script'];
    if (loadBehavior === 'document-only') {
      injectedJavaScript +=
        'window.ReactNativeWebView.postMessage("hv-web-view:render-loading:false");';
    }
    return {
      accessibilityLabel: componentProps.accessibilityLabel,
      allowsInlineMediaPlayback: componentProps['allows-inline-media-playback']
        ? componentProps['allows-inline-media-playback'] === 'true'
        : undefined,
      color: componentProps['activity-indicator-color'] || '#8d9494',
      injectedJavaScript,
      loadBehavior,
      sharedCookiesEnabled: componentProps['shared-cookies-enabled']
        ? componentProps['shared-cookies-enabled'] === 'true'
        : undefined,
      source: {
        html: componentProps.html,
        uri: componentProps.url,
      },
      testID: componentProps.testID,
    };
  }, [componentProps]);

  const onRenderLoading = useCallback(() => {
    return renderLoading ? (
      <ActivityIndicator
        color={webViewProps.color}
        style={StyleSheet.absoluteFillObject}
      />
    ) : (
      <></>
    );
  }, [renderLoading, webViewProps.color]);

  return (
    <WebView
      accessibilityLabel={webViewProps.accessibilityLabel}
      allowsInlineMediaPlayback={webViewProps.allowsInlineMediaPlayback}
      injectedJavaScript={webViewProps.injectedJavaScript}
      onMessage={onMessage}
      renderLoading={onRenderLoading}
      sharedCookiesEnabled={webViewProps.sharedCookiesEnabled}
      source={webViewProps.source}
      startInLoadingState
      testID={webViewProps.testID}
    />
  );
};

HvWebView.namespaceURI = Namespaces.HYPERVIEW;
HvWebView.localName = LOCAL_NAME.WEB_VIEW;

export default HvWebView;
