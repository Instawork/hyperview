/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NAV_ACTIONS, NavAction } from './types';
import { Props } from 'hyperview/src/core/components/hv-route/types';

/**
 * Provide navigation action implementations
 */
export class Logic {
  props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  /**
   * Prepare and send the request
   */
  sendRequest = (action: NavAction, routeParams: object) => {
    console.log('sendRequest', action, routeParams);
  };

  back = (routeParams: object) => {
    this.sendRequest(NAV_ACTIONS.BACK, routeParams);
  };

  closeModal = (routeParams: object) => {
    this.sendRequest(NAV_ACTIONS.CLOSE, routeParams);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  navigate = (routeParams: object, _: string) => {
    this.sendRequest(NAV_ACTIONS.NAVIGATE, routeParams);
  };

  openModal = (routeParams: object) => {
    this.sendRequest(NAV_ACTIONS.NEW, routeParams);
  };

  push = (routeParams: object) => {
    this.sendRequest(NAV_ACTIONS.PUSH, routeParams);
  };
}
