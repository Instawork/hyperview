/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export declare const dispatch: (eventName: string) => void;
export declare const subscribe: (callback: (eventName: string) => void) => any;
export declare const unsubscribe: (callback: (eventName: string) => void) => any;
