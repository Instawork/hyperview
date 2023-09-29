/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

<<<<<<<< HEAD:src/components/hv-date-field/types.ts
import type { Event } from '@react-native-community/datetimepicker';

export type PickerProps = {
  onChange: (event: Event, date?: Date) => void;
};
========
import type { StyleSheet } from 'hyperview/src/types';

export type Props = {|
  onPress: () => void,
  style: StyleSheet,
|};
>>>>>>>> master:src/core/components/modal/overlay/types.js
