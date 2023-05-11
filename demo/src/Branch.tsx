// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PureComponent, useState } from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';
import Navigator from './Navigator';
import Navigator_updated from './Navigator_updated';

/**
 * Branch the demo/example to use new navigation or old navigation
 */
export default class Branch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      useNew: false,
    };
  }

  /**
   * Provide the selection UI
   */
  branchSelection = () => {
    return (
      <View style={{ flexDirection: 'row', textAlign: 'justify' }}>
        <Button
          title="Legacy"
          onPress={() => this.setState({ useNew: false })}
        />
        <Button
          title="Updated"
          onPress={() => this.setState({ useNew: true })}
        />
      </View>
    );
  };

  render() {
    if (this.state.useNew) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          {this.branchSelection()}
          <Navigator_updated />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          {this.branchSelection()}
          <Navigator />
        </SafeAreaView>
      );
    }
  }
}
