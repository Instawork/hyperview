/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type Props = {
 back: () => void,
 error: Error | null | undefined,
 onPressReload: () => void,
 onPressViewDetails: (uri: string) => void
};
