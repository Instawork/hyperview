/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import HandleBack from './HandleBack';
import Hyperview from 'hyperview/src/core/components/hv-root';
import moment from 'moment';

type Props = { url: string };

/**
 * Provide external fetch and date format functions to Hyperview.
 */
export default class HyperviewScreen extends PureComponent<Props> {
  formatDate = (date: Date | null | undefined, format: string | undefined) =>
    moment(date).format(format);

  /**
   * fetch function used by Hyperview screens. By default, it adds
   * header to prevent caching requests.
   */
  fetchWrapper = (input: string, init = { headers: {} }) => {
    return fetch(input, {
      ...init,
      mode: 'cors',
      headers: {
        // Don't cache requests for the demo
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Expires: '0',
        Pragma: 'no-cache',
        ...init.headers,
      },
    });
  };

  render() {
    // Url is passed in from the navigator as a prop
    const entrypointUrl = this.props.url;

    // Only the relevant props are passed to Hyperview
    return (
      <Hyperview
        entrypointUrl={entrypointUrl}
        fetch={this.fetchWrapper}
        formatDate={this.formatDate}
        handleBack={HandleBack}
      />
    );
  }
}
