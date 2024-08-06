import moment from 'moment';

const parseUrl = require('url-parse');

export const formatDate = (
  date: Date | null | undefined,
  format: string | undefined,
) => moment(date).format(format);

export const fetchWrapper = (
  input: RequestInfo | URL,
  init: RequestInit | undefined = { headers: {} },
): Promise<Response> => {
  if (process.env.BASE_URL) {
    const currUrl = parseUrl(input.toString());
    const baseUrl = parseUrl(process.env.BASE_URL);
    currUrl.pathname = baseUrl.pathname + currUrl.pathname;
    input = currUrl.toString();
  }
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
