/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ON_EVENT_DISPATCH } from 'hyperview/src/types';
import TinyEmitter from 'tiny-emitter';

// TODO: fix this somehow (upgrade library?)
// @ts-ignore
const tinyEmitter = new TinyEmitter();

export const dispatch = (eventName: string) => {
  if (__DEV__) {
    console.log(`[dispatch-event] action [${eventName}] emitted.`);
  }
  tinyEmitter.emit(ON_EVENT_DISPATCH, eventName);
};

export const subscribe = (callback: (eventName: string) => void) =>
  tinyEmitter.on(ON_EVENT_DISPATCH, callback);

export const unsubscribe = (callback: (eventName: string) => void) =>
  tinyEmitter.off(ON_EVENT_DISPATCH, callback);
