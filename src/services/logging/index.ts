/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Logger } from './types';

/**
 * The default logger performs toString() operations on each param passed to the logging actions
 */
export class DefaultLogger {
  // Provides a forced toString conversion of any params which support a toString() function
  asString = (o: any): any => {
    return typeof o.toString === 'function' ? String(o) : o;
  };

  log = (m?: any, ...p: any[]): void =>
    console.log(this.asString(m), this.asString(p));

  info = (m?: any, ...p: any[]): void =>
    console.info(this.asString(m), this.asString(p));

  warn = (m?: any, ...p: any[]): void =>
    console.warn(this.asString(m), this.asString(p));

  error = (m?: any, ...p: any[]): void =>
    console.error(this.asString(m), this.asString(p));
}

let logger: Logger = new DefaultLogger();

export function initialize(loggerInstance: Logger | undefined): void {
  if (loggerInstance) {
    logger = loggerInstance;
  }
}

export const log = (m?: any, ...p: any[]): void => logger.log(m, p);
export const info = (m?: any, ...p: any[]): void => logger.info(m, p);
export const warn = (m?: any, ...p: any[]): void => logger.warn(m, p);
export const error = (m?: any, ...p: any[]): void => logger.error(m, p);

export type { Logger } from './types';
export { deferredToString } from './tostring-helper';
