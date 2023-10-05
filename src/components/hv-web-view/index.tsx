/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
    const color = props['activity-indicator-color'] || '#8d9494';
    const injectedJavaScript = props['injected-java-script'];
    const source = { html: props.html, uri: props.url } as const;
    return (
      <WebView
        injectedJavaScript={injectedJavaScript}
        onMessage={this.onMessage}
        renderLoading={() => (
          <ActivityIndicator
            color={color}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        source={source}
        startInLoadingState
      />
    );
  }
}
