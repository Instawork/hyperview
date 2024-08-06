import moment from 'moment';
import Constants from 'expo-constants';

const parseUrl = require('url-parse');

export const formatDate = (
  date: Date | null | undefined,
  format: string | undefined,
) => moment(date).format(format);

export const fetchWrapper = (
  input: RequestInfo | URL,
  init: RequestInit | undefined = { headers: {} },
): Promise<Response> => {
  if (Constants.manifest?.extra?.base_url) {
    const currUrl = parseUrl(input.toString());
    const baseUrl = parseUrl(Constants.manifest?.extra?.base_url);
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
