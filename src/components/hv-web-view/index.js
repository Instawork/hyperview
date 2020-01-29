// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import React, { PureComponent } from 'react';
import { ActivityIndicator } from 'react-native';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import WebView from 'react-native-webview';
import { createProps } from 'hyperview/src/services';

export default class HvWebView extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.WEB_VIEW;
  props: HvComponentProps;
  render() {
    const props: any = createProps(
      this.props.element,
      this.props.stylesheets,
      this.props.options,
    );
    const color = props['activity-indicator-color'];
    const injectedJavaScript = props['injected-java-script'];
    const source = { uri: props.url };
    return (
      <WebView
        injectedJavaScript={injectedJavaScript}
        renderLoading={() => <ActivityIndicator color={color} />}
        source={source}
        startInLoadingState
      />
    );
  }
}
