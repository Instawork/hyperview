import * as Logging from 'hyperview/src/services/logging';
import { ON_EVENT_DISPATCH } from 'hyperview/src/types';
import { TinyEmitter } from 'tiny-emitter';

const tinyEmitter = new TinyEmitter();

export const dispatch = (eventName: string) => {
  Logging.info(`[dispatch-event] action [${eventName}] emitted.`);

  tinyEmitter.emit(ON_EVENT_DISPATCH, eventName);
};

export const subscribe = (callback: (eventName: string) => void) =>
  tinyEmitter.on(ON_EVENT_DISPATCH, callback);

export const unsubscribe = (callback: (eventName: string) => void) =>
  tinyEmitter.off(ON_EVENT_DISPATCH, callback);
