// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Events from 'hyperview/src/services/events';
import * as Namespaces from 'hyperview/src/services/namespaces';
import React, { PureComponent } from 'react';
import HvNavigator from 'hyperview/src/components/hv-navigator';
import HvScreen from 'hyperview/src/components/hv-screen';
import ViewProps from './types';

/**
 * Provides routing to the correct path based on the state passed in
 */
export default class Hyperview extends PureComponent<ViewProps> {
  render() {
    if (this.props.navigation) {
      // Externally provided navigation will use the external navigation and action callbacks
      return (
        <HvScreen
          back={this.props.back}
          closeModal={this.props.closeModal}
          entrypointUrl={this.props.entrypointUrl}
          fetch={this.props.fetch}
          formatDate={this.props.formatDate}
          navigate={this.props.navigate}
          navigation={this.props.navigation}
          openModal={this.props.openModal}
          push={this.props.push}
          route={this.props.route}
        />
      );
    }

    // Without an external navigation, all navigation is handled internally
    return (
      <HvNavigator
        entrypointUrl={this.props.entrypointUrl}
        fetch={this.props.fetch}
        formatDate={this.props.formatDate}
        onParseAfter={this.props.onParseAfter}
        onParseBefore={this.props.onParseBefore}
      />
    );
  }
}

export * from 'hyperview/src/types';
export { Events, Namespaces };
