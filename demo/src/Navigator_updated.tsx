/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import HyperviewScreen_updated from './HyperviewScreen_updated';
import { NavigationContainer } from '@react-navigation/native';
import { ENTRY_POINT_URL } from './constants';

export default () => {
  return (
    <NavigationContainer>
      <HyperviewScreen_updated url={ENTRY_POINT_URL} />
    </NavigationContainer>
  );
};
