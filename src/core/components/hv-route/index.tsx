/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Text, View } from 'react-native';

// TODO AHG UPDATE LOAD
// import LoadElementError from '../load-element-error';

/**
 * Functional component wrapper around HvRouteInner
 * Performs the following:
 * - Retrieves the url from the props, params, or context
 * - Retrieves the navigator element from the context
 * - Passes the props, context, and url to HvRouteInner
 */
export default function HvRoute() {
  return (
    <View>
      <Text>ROUTE</Text>
    </View>
  );
}
