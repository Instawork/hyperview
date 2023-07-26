/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function dispatch(eventName: string);

export function subscribe(callback: (eventName: string) => void);

export function unsubscribe(callback: (eventName: string) => void);
