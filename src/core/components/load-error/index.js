// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Dom from 'hyperview/src/services/dom';
import React, { PureComponent } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { Props } from './types';
import { encodeXml } from 'hyperview/src/services';
import styles from './styles';

export default class LoadError extends PureComponent<Props> {
  props: Props;

  getDetailsUri = () => {
    const error = this.props.error;
    if (!__DEV__ || !error || !(error instanceof Dom.ServerError)) {
      return null;
    }
    const { responseText, responseHeaders } = error;
    switch (responseHeaders.get(Dom.HTTP_HEADERS.CONTENT_TYPE)) {
      // Only support HTML server error responses for the time being
      case Dom.CONTENT_TYPE.TEXT_HTML: {
        const encodedHtml = encodeXml(responseText);
        const xml = `<doc xmlns="https://hyperview.org/hyperview">
          <screen>
            <styles>
              <style id="flex" flex="1" />
              <style id="mt-40" marginTop="40" />
              <style id="p-16" padding="16" />
            </styles>
            <body style="flex">
              <header style="mt-40">
                <text style="p-16" action="back" href="#">Back</text>
              </header>
              <web-view html="${encodedHtml}" xmlns="https://hyperview.org/hyperview" />
            </body>
          </screen>
        </doc>`;
        return `data:${Dom.CONTENT_TYPE.APPLICATION_XML};base64,${btoa(
          xml.replace(/[\u00A0-\u2666]/g, c => `&#${c.charCodeAt(0)};`),
        )}`;
      }
      default:
        return null;
    }
  };

  onPressViewDetails = () => {
    const detailsUri = this.getDetailsUri();
    if (detailsUri) {
      this.props.onPressViewDetails(detailsUri);
    }
  };

  getTitle = (): string => {
    if (__DEV__ && this.props.error) {
      return this.props.error.toString();
    }
    return 'An error occured';
  };

  Title = () => <Text>{this.getTitle()}</Text>;

  ReloadButton = () => (
    <TouchableOpacity onPress={this.props.onPressReload}>
      <Text style={styles.button}>Reload</Text>
    </TouchableOpacity>
  );

  ViewDetailsButton = () => {
    const detailsUri = this.getDetailsUri();
    if (detailsUri) {
      return (
        <TouchableOpacity onPress={this.onPressViewDetails}>
          <Text style={styles.button}>View details</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  render() {
    const { ReloadButton, Title, ViewDetailsButton } = this;
    return (
      <View style={styles.container}>
        <Title />
        <ReloadButton />
        <ViewDetailsButton />
      </View>
    );
  }
}
