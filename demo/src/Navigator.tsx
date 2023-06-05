/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Constants from './constants';
import HyperviewScreen from './HyperviewScreen';
import { NavigationContainer } from '@react-navigation/native';

export default () => {
  return (
    <NavigationContainer>
      <HyperviewScreen url={Constants.ENTRY_POINT_URL_NAV} />
    </NavigationContainer>
  );
};
