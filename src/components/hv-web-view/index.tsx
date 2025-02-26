import * as Events from 'hyperview/src/services/events';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { ActivityIndicator, StyleSheet } from 'react-native';
import React, { PureComponent } from 'react';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import WebView from 'hyperview/src/core/components/web-view';
import { createProps } from 'hyperview/src/services';

export default class HvWebView extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.WEB_VIEW;

  static localNameAliases = [];

  state = {
    renderLoading: true,
  };

  onMessage = (
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
      this.setState({ renderLoading: false });
    }
    const matches = event.nativeEvent.data.match(/^hyperview:(.*)$/);
    if (matches) {
      Events.dispatch(matches[1]);
    }
  };

  render() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props: any = createProps(
      this.props.element,
      this.props.stylesheets,
      this.props.options,
    );
    const allowsInlineMediaPlayback = props['allows-inline-media-playback']
      ? props['allows-inline-media-playback'] === 'true'
      : undefined;
    const color = props['activity-indicator-color'] || '#8d9494';
    const loadBehavior = props['show-loading-indicator'];
    let injectedJavaScript = props['injected-java-script'];
    if (loadBehavior === 'document-only') {
      injectedJavaScript +=
        'window.ReactNativeWebView.postMessage("hv-web-view:render-loading:false");';
    }
    const sharedCookiesEnabled = props['shared-cookies-enabled']
      ? props['shared-cookies-enabled'] === 'true'
      : undefined;
    const source = { html: props.html, uri: props.url } as const;
    return (
      <WebView
        allowsInlineMediaPlayback={allowsInlineMediaPlayback}
        injectedJavaScript={injectedJavaScript}
        onMessage={this.onMessage}
        renderLoading={() => {
          return this.state.renderLoading ? (
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
      />
    );
  }
}
