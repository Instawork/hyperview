/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  BeforeAfterParseHandler,
  Fetch,
  XResponseStaleReason,
} from './types';
import type { Document } from 'hyperview/src/types-legacy';

/**
 * TS definition of the Parser class to provide an alternate Document response
 */
export class Parser {
  constructor(
    fetch: Fetch,
    onBeforeParse?: BeforeAfterParseHandler,
    onAfterParse?: BeforeAfterParseHandler,
  );

  loadDocument: (
    url: string,
  ) => Promise<{ doc: Document; staleHeaderType: ?XResponseStaleReason }>;
}
