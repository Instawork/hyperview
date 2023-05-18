/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Props } from 'hyperview/src/core/components/hv-route/types';

/**
 * Provide navigation action implementations
 */
export class Logic {
  props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  push = (params: object): void => {
    console.log('push:', params);
  };

  openModal = (params: object): void => {
    console.log('openModal', params);
  };

  back = (): void => {
    console.log('back');
  };

  closeModal = (): void => {
    console.log('closeModal');
  };

  navigate = (params: object, key: string): void => {
    console.log('navigate', key, params);
  };
}
