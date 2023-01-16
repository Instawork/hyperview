/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {StyleSheet} from 'hyperview/src/types';

export type InternalProps = {
 accessibilityLabel?: any,
 automaticallyAdjustContentInsets?: boolean | null | undefined,
 behavior?: 'position',
 extraScrollHeight?: number | null | undefined,
 keyboardOpeningTime?: number | null | undefined,
 keyboardShouldPersistTaps?: string | null | undefined,
 scrollEventThrottle?: number | null | undefined,
 scrollToInputAdditionalOffset?: number | null | undefined,
 getTextInputRefs?: () => [] | null | undefined,
 horizontal?: boolean | null | undefined,
 style?: Array<StyleSheet> | null | undefined,
 testID?: string | null | undefined,
 children?: any | null | undefined
};
