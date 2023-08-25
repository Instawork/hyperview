/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {StyleSheet} from 'hyperview/src/types';

export type Props = {
 focused: boolean,
 formatter: (value?: Date | null | undefined, format?: string | null | undefined) => string,
 labelFormat: string | null | undefined,
 placeholder: string | null | undefined,
 placeholderTextColor: string | null | undefined,
 pressed: boolean,
 style: StyleSheet,
 value: Date | null | undefined
};
