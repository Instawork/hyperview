/* eslint-disable @typescript-eslint/no-explicit-any */

import { DefaultLogger } from './default-logger';
import type { Logger } from './types';

let logger: Logger = new DefaultLogger();

export function initialize(loggerInstance: Logger | undefined): void {
  if (loggerInstance) {
    logger = loggerInstance;
  }
}

export const log = (m?: any, ...p: any[]): void => logger.log(m, ...p);
export const info = (m?: any, ...p: any[]): void => logger.info(m, ...p);
export const warn = (m?: any, ...p: any[]): void => logger.warn(m, ...p);
export const error = (m?: any, ...p: any[]): void => logger.error(m, ...p);

export type { Logger } from './types';
export { deferredToString } from './tostring-helper';
