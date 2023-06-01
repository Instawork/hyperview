/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Contexts from './contexts';
import * as HvScreenProps from './core/components/hv-screen/types';
import * as NavContexts from './contexts/navigation';

import React, { PureComponent } from 'react';
import HvRoute from 'hyperview/src/core/components/hv-route';
import HvScreen from 'hyperview/src/core/components/hv-screen';

/**
 * Provides routing to the correct path based on the state passed in
 */
export default class Hyperview extends PureComponent<HvScreenProps.Props> {
  render() {
    if (this.props.navigation) {
      // Externally provided navigation will use the provided navigation and action callbacks
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
      <Contexts.DateFormatContext.Provider value={this.props.formatDate}>
        <Contexts.RefreshControlComponentContext.Provider
          value={this.props.refreshControl}
        >
          <NavContexts.NavigationContext.Provider
            value={{
              behaviors: this.props.behaviors,
              components: this.props.components,
              elementErrorComponent: this.props.elementErrorComponent,
              entrypointUrl: this.props.entrypointUrl,
              errorScreen: this.props.errorScreen,
              fetch: this.props.fetch,
              handleBack: this.props.handleBack,
              loadingScreen: this.props.loadingScreen,
              onParseAfter: this.props.onParseAfter,
              onParseBefore: this.props.onParseBefore,
            }}
          >
            <HvRoute />
          </NavContexts.NavigationContext.Provider>
        </Contexts.RefreshControlComponentContext.Provider>
      </Contexts.DateFormatContext.Provider>
    );
  }
}
