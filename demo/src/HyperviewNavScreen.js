/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import * as Contexts from 'hyperview/src/contexts';
// import HandleBack from './HandleBack';
import HyperviewRoute from 'hyperview/src/hv-nav-route';
import moment from 'moment';

export default class HyperviewNavScreen extends PureComponent {
  formatDate = (date, format) => moment(date).format(format);

  /**
   * fetch function used by Hyperview screens. By default, it adds
   * header to prevent caching requests.
   */
  fetchWrapper = (input, init = { headers: {} }) => {
    // console.log('--->fetchWrapper', input);
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
      <Contexts.DateFormatContext.Provider value={this.formatDate}>
        <Contexts.FetchContext.Provider value={{
          fetch:this.fetchWrapper,
          onParseBefore: null,
          onParseAfter: null}}>
          <HyperviewRoute
              entrypointUrl={entrypointUrl}

              //TODO
            // back={this.goBack}
            // closeModal={this.closeModal}
            // navigate={this.navigate}
            // navigation={this.props.navigation}
            // openModal={this.openModal}
            // push={this.push}
            // route={this.props.route}

            />
          </Contexts.FetchContext.Provider>
        </Contexts.DateFormatContext.Provider>
        // </HandleBack>
    );
  }
}
