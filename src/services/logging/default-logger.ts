/* eslint-disable @typescript-eslint/no-explicit-any */

import { ToStringHelper } from './tostring-helper';

/**
 * Handles deferredToString objects by calling toString() prior to forwarding to console
 */
export class DefaultLogger {
  convertDeferred = (m?: any): any => {
    if (m instanceof ToStringHelper) {
      return m.toString();
    }
    return m;
  };

  log = (m?: any, ...p: any[]): void =>
    console.log(
      this.convertDeferred(m),
      p.map(param => this.convertDeferred(param)),
    );

  info = (m?: any, ...p: any[]): void =>
    console.info(
      this.convertDeferred(m),
      p.map(param => this.convertDeferred(param)),
    );

  warn = (m?: any, ...p: any[]): void =>
    console.warn(
      this.convertDeferred(m),
      p.map(param => this.convertDeferred(param)),
    );

  error = (m?: any, ...p: any[]): void =>
    console.error(
      this.convertDeferred(m),
      p.map(param => this.convertDeferred(param)),
    );
}
