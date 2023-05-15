// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Contexts from 'hyperview/src/contexts';
import * as Events from 'hyperview/src/services/events';
import * as Namespaces from 'hyperview/src/services/namespaces';
import React, { PureComponent } from 'react';
import HvNavigator from 'hyperview/src/core/components/hv-navigator';
import HvScreen from 'hyperview/src/core/components/hv-screen';
import { Props } from 'hyperview/src/core/components/hv-navigator/types';

/**
 * Provides routing to the correct path based on the state passed in
 */
export default class Hyperview extends PureComponent<Props> {
  render() {
    if (this.props.navigation) {
      // Externally provided navigation will use the external navigation and action callbacks
      return (
        <HvScreen
          back={this.props.back}
          behaviors={this.props.behaviors}
          closeModal={this.props.closeModal}
          components={this.props.components}
          elementErrorComponent={this.props.elementErrorComponent}
          entrypointUrl={this.props.entrypointUrl}
          errorScreen={this.props.errorScreen}
          fetch={this.props.fetch}
          formatDate={this.props.formatDate}
          loadingScreen={this.props.loadingScreen}
          navigate={this.props.navigate}
          navigation={this.props.navigation}
          onParseAfter={this.props.onParseAfter}
          onParseBefore={this.props.onParseBefore}
          openModal={this.props.openModal}
          push={this.props.push}
          refreshControl={this.props.refreshControl}
          route={this.props.route}
        />
      );
    }

    // Without an external navigation, all navigation is handled internally
    return (
      <Contexts.DateFormatContext.Provider value={this.formatDate}>
        <Contexts.RefreshControlComponentContext.Provider
          value={this.props.refreshControl}
        >
          <Contexts.NavigationContext.Provider
            value={{
              behaviors: this.props.behaviors,
              components: this.props.components,
              elementErrorComponent: this.props.elementErrorComponent,
              entrypointUrl: this.props.entrypointUrl,
              errorScreen: this.props.errorScreen,
              fetch: this.props.fetch,
              formatDate: this.props.formatDate,
              handleBack: this.props.handleBack,
              loadingScreen: this.props.loadingScreen,
              onParseAfter: this.props.onParseAfter,
              onParseBefore: this.props.onParseBefore,
            }}
          >
            <HvNavigator />
          </Contexts.NavigationContext.Provider>
        </Contexts.RefreshControlComponentContext.Provider>
      </Contexts.DateFormatContext.Provider>
    );
  }
}

export * from 'hyperview/src/types';
export { Events, Namespaces };
