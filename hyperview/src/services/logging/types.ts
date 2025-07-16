// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LogFunction = (message?: any, ...RouteParams: any[]) => void;

export type Logger = {
  error: LogFunction;
  info: LogFunction;
  log: LogFunction;
  warn: LogFunction;
};
