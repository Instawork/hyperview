import * as Events from 'hyperview/src/services/events';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { PureComponent } from 'react';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import WebView from 'hyperview/src/core/components/web-view';
import { createProps } from 'hyperview/src/services';

export default class HvWebView extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.WEB_VIEW;

  static localNameAliases = [];

  behaviorMapping: { [key: string]: string } = {
    stopLoader: 'window.ReactNativeWebView.postMessage("stopLoader");',
  }

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
    const matches = event.nativeEvent.data.match(/^hyperview:(.*)$/);
    const stopLoaderEvent = event.nativeEvent.data.match(/^stopLoader$/);
    if (matches) {
      Events.dispatch(matches[1]);
    } else if (stopLoaderEvent) {
      this.setState({renderLoading: false});
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
    const documentLoadBehavior = props['document-load-behavior'];
    const injectedJavaScript = props['injected-java-script'] + (this.behaviorMapping[documentLoadBehavior] || "");
    const source = { html: props.html, uri: props.url } as const;
    return (
      <WebView
        allowsInlineMediaPlayback={allowsInlineMediaPlayback}
        injectedJavaScript={injectedJavaScript}
        onMessage={this.onMessage}
        renderLoading={() => this.state.renderLoading ? 
          <ActivityIndicator
            color={color}
            style={StyleSheet.absoluteFillObject}
          /> : <View/>}
        source={source}
        startInLoadingState
      />
    );
  }
}
