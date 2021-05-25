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
import HandleBack from '../components/HandleBack';
import verifyBehavior from '../behaviors/verify'

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

  /**
   * fetch function used by Hyperview screens. By default, it adds
   * header to prevent caching requests.
   */
  fetchWrapper = (input, init = { headers: {} }) => {
    return fetch(input, {
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
      <HandleBack>
        <Hyperview
          back={this.goBack}
          closeModal={this.closeModal}
          entrypointUrl={entrypointUrl}
          fetch={this.fetchWrapper}
          navigate={this.navigate}
          navigation={navigation}
          openModal={this.openModal}
          push={this.push}
          formatDate={this.formatDate}
          behaviors={[verifyBehavior]}
        />
      </HandleBack>
    );
  }
}
