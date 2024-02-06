/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Constants from './constants';
import React from 'react';
import Hyperview from 'hyperview';
import { fetchWrapper, formatDate } from './helpers';
import { NavigatorContext } from './NavigatorContextProvider';

/**
 * Hyperview will create an internal Navigator from the document HXML
 */
const Navigator = () => {
  return (
    <NavigatorContext.Consumer>
      {value => (
        <Hyperview
          behaviors={value?.getCallbacks ? value.getCallbacks : []}
          entrypointUrl={Constants.ENTRY_POINT_NAV_URL}
          fetch={fetchWrapper}
          formatDate={formatDate}
        />
      )}
    </NavigatorContext.Consumer>
  );
};

export default () => <Navigator />;
