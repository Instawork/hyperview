import { HvBaseError, HvNodeError } from 'hyperview';

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
 * Converts an XML node to a simple string representation
 */
const elementToString = (node: Node): string => {
  const tagName = node.nodeName;
  // Check if node is an Element with attributes
  if (node.nodeType === 1) {
    const element = node as Element;
    const attributes = Array.from(element.attributes)
      .map(attr => `${attr.name}="${attr.value}"`)
      .join(' ');
    return attributes ? `<${tagName} ${attributes}>` : `<${tagName}>`;
  }
  return `<${tagName}>`;
};

/**
 * Handles deferredToString objects by calling toString() prior to
 * forwarding to console. Additional context is injected into the
 * error message through the custom context of the error class
 */
const convertDeferred = (m?: unknown): string | unknown => {
  try {
    const errorMessage = [];
    errorMessage.push(m?.toString());
    if (m instanceof HvBaseError) {
      const error: HvBaseError = m;
      const extraContext = error.getExtraContext();
      // Inject extra context into the error message
      if (extraContext && typeof extraContext === 'object') {
        Object.keys(extraContext).forEach(key => {
          errorMessage.push(` ${key}: ${extraContext[key]}`);
        });
      }
      // Inject the node into the error message
      if (m instanceof HvNodeError) {
        errorMessage.push(`node: ${elementToString(m.node)}`);
      }
    }
    return errorMessage.join(', ');
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
