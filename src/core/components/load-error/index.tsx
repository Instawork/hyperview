/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Dom from 'hyperview/src/services/dom';
import React, { PureComponent } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import type { Props } from './types';
import WebView from 'hyperview/src/core/components/web-view';
import styles from './styles';

export default class LoadError extends PureComponent<Props> {
  getHTML = (): string | null | undefined => {
    if (
      !__DEV__ ||
      !this.props.error ||
      !(this.props.error instanceof Dom.ServerError)
    ) {
      return null;
    }
    const { responseText, responseHeaders } = this.props.error;
    switch (responseHeaders.get(Dom.HTTP_HEADERS.CONTENT_TYPE)) {
      // Only support HTML server error responses for the time being
      case Dom.CONTENT_TYPE.TEXT_HTML:
        return responseText;
      default:
        return null;
    }
  };

  getTitle = () => {
    if (!__DEV__ || !this.props.error) {
      return 'An error occured';
    }
    return `${this.props.error.name}: ${this.props.error.message}`;
  };

  Header = () => {
    const title = this.getTitle();
    return (
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity onPress={this.props.onPressReload}>
          <Text style={styles.button}>Reload</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.back}>
          <Text style={styles.button}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  };

  Error = () => {
    const html = this.getHTML();
    if (!html) {
      return null;
    }
    return <WebView source={{ html }} style={{ flex: 1 }} />;
  };

  render() {
    const { Error, Header } = this;

    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <Error />
      </SafeAreaView>
    );
  }
}
