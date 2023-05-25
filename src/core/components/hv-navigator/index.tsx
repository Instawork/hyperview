/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Dom from 'hyperview/src/services/dom';
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import LoadError from 'hyperview/src/core/components/load-error';
import Loading from 'hyperview/src/core/components/loading';

export default class HvNavigator extends PureComponent {
  parser: Dom.Parser;

  constructor(props, context) {
    super(props, context);
    this.parser = new Dom.Parser(
      this.context.fetch,
      this.context.onParseBefore,
      this.context.onParseAfter,
    );
  }

  render() {
    if (this.state.error) {
      const errorScreen = this.context.errorScreen || LoadError;
      return React.createElement(errorScreen, {
        // back: () => this.getNavigation().back(),
        error: this.state.error,
        // onPressReload: () => this.reload(), // Make sure reload() is called without any args
        // onPressViewDetails: uri => this.props.openModal({ url: uri }),
      });
    }
    if (!this.state.doc) {
      const loadingScreen = this.context.loadingScreen || Loading;
      return React.createElement(loadingScreen);
    }

    return (
      <View>
        <Text>NAVIGATOR</Text>
      </View>
    );
  }
}
