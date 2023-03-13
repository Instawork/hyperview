/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { BeforeAfterParseHandler, Fetch, HttpMethod } from './types';
import type { Document } from 'hyperview/src/types';
export declare class Parser {
    fetch: Fetch;
    onBeforeParse: BeforeAfterParseHandler | null | undefined;
    onAfterParse: BeforeAfterParseHandler | null | undefined;
    constructor(fetch: Fetch, onBeforeParse?: BeforeAfterParseHandler | null, onAfterParse?: BeforeAfterParseHandler | null);
    load: (baseUrl: string, data?: FormData | null, method?: HttpMethod | null) => Promise<Document>;
    loadDocument: (baseUrl: string) => Promise<Document>;
    loadElement: (baseUrl: string, data?: FormData | null, method?: HttpMethod | null) => Promise<Document>;
}
