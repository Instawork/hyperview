/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { View } from 'react-native';

// Simple passthrough on web. We might want to detect
// the device type in the future, to support keyboard
// avoiding when the web page is rendered on device
// equiped with a virtual keyboard
export default (props: any) => <View {...props} />;
