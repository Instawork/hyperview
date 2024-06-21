/* eslint-disable @typescript-eslint/no-explicit-any */

import { ToStringHelper } from './tostring-helper';

/**
 * The default logger performs toString() operations on each param passed to the logging actions
 */
export class DefaultLogger {
  toString = (m?: any): any => {
    if (m instanceof ToStringHelper) {
      return m.toString();
    }
    return m;
  };

  log = (m?: any, ...p: any[]): void =>
    console.log(
      this.toString(m),
      p.map(param => this.toString(param)),
    );

  info = (m?: any, ...p: any[]): void =>
    console.info(
      this.toString(m),
      p.map(param => this.toString(param)),
    );

  warn = (m?: any, ...p: any[]): void =>
    console.warn(
      this.toString(m),
      p.map(param => this.toString(param)),
    );

  error = (m?: any, ...p: any[]): void =>
    console.error(
      this.toString(m),
      p.map(param => this.toString(param)),
    );
}
