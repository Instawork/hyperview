/* eslint-disable @typescript-eslint/no-explicit-any */
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
