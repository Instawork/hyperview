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
    console.log(
      this.asString(m),
      p.map(param => this.asString(param)),
    );

  info = (m?: any, ...p: any[]): void =>
    console.info(
      this.asString(m),
      p.map(param => this.asString(param)),
    );

  warn = (m?: any, ...p: any[]): void =>
    console.warn(
      this.asString(m),
      p.map(param => this.asString(param)),
    );

  error = (m?: any, ...p: any[]): void =>
    console.error(
      this.asString(m),
      p.map(param => this.asString(param)),
    );
}
