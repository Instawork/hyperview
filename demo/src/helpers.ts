import { LOG_SEVERITY, LogPayload } from 'hyperview';
import moment from 'moment';

export const formatDate = (
  date: Date | null | undefined,
  format: string | undefined,
) => moment(date).format(format);

export const fetchWrapper = (
  input: RequestInfo | URL,
  init: RequestInit | undefined = { headers: {} },
): Promise<Response> => {
  return fetch(input, {
    ...init,
    mode: 'cors',
    headers: {
      // Don't cache requests for the demo
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Expires: '0',
      Pragma: 'no-cache',
      ...init.headers,
    },
  });
};

export const log = (payload: LogPayload): void => {
  let message = `${payload.timestamp} |`;
  if (payload.prefix || payload.source) {
    if (payload.prefix) {
      message += ` ${payload.prefix}`;
    }
    if (payload.source) {
      message += ` ${payload.source}`;
    }
    message += ' |';
  }
  message += ` ${payload.message}`;
  const color = getColor(payload.severity);
  console.log(`${color}${message}${colors.Reset}`, payload.data);
};

const getColor = (severity: number): string => {
  switch (severity) {
    case LOG_SEVERITY.INFO:
      return colors.FgGreen;
    case LOG_SEVERITY.WARN:
      return colors.FgYellow;
    case LOG_SEVERITY.ERROR:
      return colors.FgRed;
    default:
      return colors.FgWhite;
  }
};

const colors = {
  Reset: '\x1b[0m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgWhite: '\x1b[37m',
};
