/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import Hyperview from 'hyperview';
import moment from 'moment';
import LRU from 'lru-cache';

const fetchCache = new LRU({
  length: (n, key) => {
    return n.size;
  },
  max: 5e7, // 50 MB
  updateAgeOnGet: false,
});

export default class HyperviewScreen extends React.PureComponent {
  goBack = (params, key) => {
    const navigation = this.props.navigation;
    navigation.pop();
  }

  closeModal = (params, key) => {
    const navigation = this.props.navigation;
    navigation.pop();
  }

  push = (params, key) => {
    // If we're in a modal stack, push the next screen on the modal stack.
    // If we're in the main stack, push the next screen in the main stack.
    // Modal stacks will have modal param set.
    const navigation = this.props.navigation;
    const modal = navigation.getParam('modal', false);
    navigation.push(
      modal ? 'ModalStack' : 'MainStack',
      {
        modal,
        ...params,
      }
    );
  }

  navigate = (params, key) => {
    const navigation = this.props.navigation;
    navigation.navigate({ routeName: 'MainStack', params, key });
  }

  openModal = (params, key) => {
    const navigation = this.props.navigation;
    navigation.push('Modal', params);
  }

  formatDate = (date, format) => moment(date).format(format);

  cachedFetch = (url, options) => {
    console.log(`cache size: ${fetchCache.length}`);
    let cacheKey = url;
    let cached = fetchCache.get(cacheKey);
    if (cached !== undefined) {
      console.log('found in cache!');
      let response = cached.response.clone();
      response.headers.set('warning', '110 hyperview "Response is stale"');
      return Promise.resolve(response);
    }

    console.log('not in cache, fetching...');
    return fetch(url, options).then(response => {
      // todo: check here if cacheable  
      if (!response.ok) {
        return response;
      }

      const clonedResponse = response.clone();
      response.blob().then(blob => {
        const cacheValue = {
          response: clonedResponse,
          size: blob.size,
        };

        let expiry = 1 * 60 * 1000; // 5 min default
        if (typeof options === 'number') {
          expiry = options;
          options = undefined;
        } else if (typeof options === 'object') {
          expiry = options.seconds || expiry;
        }

        console.log('caching...');
        fetchCache.set(cacheKey, cacheValue, expiry);
      });

      return clonedResponse;
    });
  };

  /**
   * fetch function used by Hyperview screens. By default, it adds
   * header to prevent caching requests.
   */
  fetchWrapper = (input, init = { headers: {} }) => {
    return this.cachedFetch(input, {
      ...init,
      headers: {
        // Don't cache requests for the demo
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0,
        ...init.headers,
      }
    });
  }

  render() {
    const navigation = this.props.navigation;
    const entrypointUrl = navigation.state.params.url;

    return (
      <Hyperview
        back={this.goBack}
        closeModal={this.closeModal}
        entrypointUrl={entrypointUrl}
        fetch={this.fetchWrapper}
        navigate={this.navigate}
        navigation={navigation}
        openModal={this.openModal}
        push={this.push}
        replace={navigation.replace}
        formatDate={this.formatDate}
      />
    );
  }
}
