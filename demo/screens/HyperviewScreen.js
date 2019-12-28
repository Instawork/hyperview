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


const fetchCache = {};


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
    let expiry = 1 * 60; // 5 min default
    if (typeof options === 'number') {
      expiry = options;
      options = undefined;
    } else if (typeof options === 'object') {
      // I hope you didn't set it to 0 seconds
      expiry = options.seconds || expiry;
    }
    // Use the URL as the cache key to sessionStorage
    let cacheKey = url;
    let cached = fetchCache[cacheKey];
    let whenCached = fetchCache[cacheKey + ':ts'];
    if (cached !== null && whenCached !== null) {
      console.log('found in cache!');

      let age = (Date.now() - whenCached) / 1000;
      if (age < expiry) {
        console.log('not expired, using!');
        let response = cached.clone();
        return Promise.resolve(response)
      } else {
        console.log('expired, deleting');
        // We need to clean up this old key
        delete fetchCache[cacheKey];
        delete fetchCache[cacheKey + ':ts'];
      }
    }

    console.log('not in cache, fetching...');
    return fetch(url, options).then(response => {
      // let's only store in cache if the content-type is
      // JSON or something non-binary
      if (response.status === 200) {
        console.log('caching...');
        fetchCache[cacheKey] = response.clone();
        fetchCache[cacheKey+':ts'] = Date.now();
      }
      return response;
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
