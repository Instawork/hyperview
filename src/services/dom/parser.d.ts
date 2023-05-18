/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Document } from 'hyperview/src/services/navigator/types';
import type { XResponseStaleReason } from './services/dom/types';

export type Parser = {
  loadDocument: (
    url: string,
  ) => Promise<{ doc: Document; staleHeaderType: ?XResponseStaleReason }>;
};
