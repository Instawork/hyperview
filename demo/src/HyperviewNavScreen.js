/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
// import HandleBack from './HandleBack';
import HyperviewRoute from 'hyperview/src/hv-nav-route';
import moment from 'moment';
import { NavProvider } from 'hyperview/src/hv-nav-context';
import { View } from 'react-native';

export default class HyperviewNavScreen extends PureComponent {
  formatDate = (date, format) => moment(date).format(format);

  /**
   * fetch function used by Hyperview screens. By default, it adds
   * header to prevent caching requests.
   */
  fetchWrapper = (input, init = { headers: {} }) => {
    console.log('--->fetchWrapper', input);
    return fetch(input, {
      ...init,
      mode: "cors",
      headers: {
        // Don't cache requests for the demo
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Expires: 0,
        Pragma: 'no-cache',
        ...init.headers,
      }
    });
  }

  render() {
    const entrypointUrl = this.props.url;

    return (
      // <HandleBack>
      <View style={{ flex: 1, alignItems: "center" }}>
        <HyperviewRoute
            url={entrypointUrl}
            fetch={this.fetchWrapper}
            formatDate={this.formatDate}
          />
        </View>
        // </HandleBack>
    );
  }
}
