/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * The default logger performs toString() operations on each param passed to the logging actions
 */
export class DefaultLogger {
  log = (m?: any, ...p: any[]): void =>
    console.log(
      String(m),
      p.map(param => String(param)),
    );

  info = (m?: any, ...p: any[]): void =>
    console.info(
      String(m),
      p.map(param => String(param)),
    );

  warn = (m?: any, ...p: any[]): void =>
    console.warn(
      String(m),
      p.map(param => String(param)),
    );

  error = (m?: any, ...p: any[]): void =>
    console.error(
      String(m),
      p.map(param => String(param)),
    );
}
