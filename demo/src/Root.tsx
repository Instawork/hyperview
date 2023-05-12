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
import NavigatorLegacy from './NavigatorLegacy';
import Navigator from './Navigator';

/**
 * Branch the demo/example to use new navigation or old navigation
 */
export default class Root extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      useLegacy: false,
    };
  }

  /**
   * Provide the selection UI
   */
  BranchSelection = () => (
    <View style={{ flexDirection: 'row', textAlign: 'justify' }}>
      <Button
        title="Updated"
        onPress={() => this.setState({ useLegacy: false })}
      />
      <Button
        title="Legacy"
        onPress={() => this.setState({ useLegacy: true })}
      />
    </View>
  );

  render() {
    const { BranchSelection } = this;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <BranchSelection />
        {this.state.useLegacy ? <NavigatorLegacy /> : <Navigator />}
      </SafeAreaView>
    );
  }
}
