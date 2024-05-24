/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Logger } from 'hyperview/src/types';

let logger: Logger = console;

function initialize(loggerInstance: Logger | undefined): void {
  if (loggerInstance) {
    logger = loggerInstance;
  }
}

export default {
  initialize,
  log: (m?: any, ...p: any[]) => logger.log(m, p),
  // eslint-disable-next-line sort-keys
  info: (m?: any, ...p: any[]) => logger.info(m, p),
  warn: (m?: any, ...p: any[]) => logger.warn(m, p),
  // eslint-disable-next-line sort-keys
  error: (m?: any, ...p: any[]) => logger.error(m, p),
};
