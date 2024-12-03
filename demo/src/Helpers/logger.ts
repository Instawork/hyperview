// eslint-disable-next-line no-shadow
enum Level {
  info = 0,
  log = 1,
  warn = 2,
  error = 3,
}

const Levels = [Level.info, Level.log, Level.warn, Level.error];
const LogFunctions = {
  [Level.info]: console.info,
  [Level.log]: console.log,
  [Level.warn]: console.warn,
  [Level.error]: console.error,
};

/**
 * Handles deferredToString objects by calling toString() prior to forwarding to console
 */
const convertDeferred = (m?: unknown): string | unknown => {
  try {
    return m?.toString();
  } catch (e) {
    return m;
  }
};

export class Logger {
  public static Level = Level;

  protected level: number;

  constructor(level: Level) {
    this.level = Levels.indexOf(level);
  }

  public log = (m?: unknown, ...p: unknown[]): void => {
    this.emitter(Level.log, m, ...p);
  };

  public info = (m?: unknown, ...p: unknown[]): void => {
    this.emitter(Level.info, m, ...p);
  };

  public warn = (m?: unknown, ...p: unknown[]): void => {
    this.emitter(Level.warn, m, ...p);
  };

  public error = (m?: unknown, ...p: unknown[]): void => {
    this.emitter(Level.error, m, ...p);
  };

  protected emitter = (level: Level, m?: unknown, ...p: unknown[]): void => {
    if (this.level > Levels.indexOf(level)) {
      return;
    }
    LogFunctions[level](
      convertDeferred(m),
      p.map(param => convertDeferred(param)),
    );
  };
}
