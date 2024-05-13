import type { Log } from 'hyperview/src/types';

export default class Logging {
  logger?: Log;

  prefix?: string;

  constructor(logger?: Log, prefix?: string) {
    this.logger = logger;
    this.prefix = prefix;
  }

  log = (
    message: string,
    severity: number,
    data?: unknown,
    source?: string,
    timestamp?: Date,
  ) => {
    if (!this.logger) {
      return;
    }
    this.logger({
      data,
      message,
      prefix: this.prefix,
      severity,
      source,
      timestamp: timestamp || new Date(),
    });
  };
}
