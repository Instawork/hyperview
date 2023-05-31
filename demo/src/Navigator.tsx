/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import HyperviewScreen from './HyperviewScreen';
import { NavigationContainer } from '@react-navigation/native';
import { ENTRY_POINT_URL_NAV } from './constants';

export default () => {
  return (
    <NavigationContainer>
      <HyperviewScreen url={ENTRY_POINT_URL_NAV} />
    </NavigationContainer>
  );
};
