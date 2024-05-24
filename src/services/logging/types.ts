// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LogFunction = (message?: any, ...optionalParams: any[]) => void;

export type Logger = {
  error: LogFunction;
  info: LogFunction;
  log: LogFunction;
  warn: LogFunction;
};
