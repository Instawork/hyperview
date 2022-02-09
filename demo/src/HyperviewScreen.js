/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import HandleBack from './HandleBack';
import Hyperview from 'hyperview';
import moment from 'moment';
import { MAIN_STACK_NAME, MODAL_STACK_NAME } from './constants';

export default class HyperviewScreen extends PureComponent {
  goBack = () => {
    this.props.navigation.pop();
  }

  closeModal = () => {
    this.props.navigation.pop();
  }

  push = (params) => {
    // If we're in a modal stack, push the next screen on the modal stack.
    // If we're in the main stack, push the next screen in the main stack.
    // Modal stacks will have modal param set.
    const modal = this.props.route.params?.modal ?? false;
    this.props.navigation.push(
      modal ? MODAL_STACK_NAME : MAIN_STACK_NAME,
      {
        modal,
        ...params,
      }
    );
  }

  navigate = (params, key) => {
    this.props.navigation.navigate({ key, params, routeName: MAIN_STACK_NAME });
  }

  openModal = (params) => {
    this.props.navigation.push(MODAL_STACK_NAME, params);
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
        Expires: 0,
        Pragma: 'no-cache',
        ...init.headers,
      }
    });
  }

  render() {
    // HACK:
    // React Navigation > 5.x no longer exposes navigation state
    // Internally, Hyperview relies on this object to find params
    // which are now accessible through the route prop.
    // TODO: Refactor Hyperview core to accept a new params prop
    const navigation = {
      ...this.props.navigation,
      state: {
        params: this.props.route.params || {},
      },
    }
    const entrypointUrl = this.props.route.params?.url;

    return (
      <HandleBack>
        <Hyperview
          back={this.goBack}
          closeModal={this.closeModal}
          entrypointUrl={entrypointUrl}
          fetch={this.fetchWrapper}
          formatDate={this.formatDate}
          navigate={this.navigate}
          navigation={navigation}
          openModal={this.openModal}
          push={this.push}
        />
      </HandleBack>
    );
  }
}
