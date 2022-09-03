/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'react-native-gesture-handler';
import React from 'react';
import Navigator from './src/Navigator';
import { RootSiblingParent } from 'react-native-root-siblings';

export default function App() {
  return (
    <RootSiblingParent>
      <Navigator />
    </RootSiblingParent>
  );
}
