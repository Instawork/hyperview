/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Event } from '@react-native-community/datetimepicker';

export type PickerProps = {
  onChange: (event: Event, date?: Date) => void;
};
