import Constants from 'expo-constants';
import moment from 'moment';
import parseUrl from 'url-parse';

export const formatDate = (
  date: Date | null | undefined,
  format: string | undefined,
) => moment(date).format(format);

const processUrl = (url: RequestInfo | URL): RequestInfo | URL => {
  if (Constants.manifest?.extra?.baseUrl) {
    const { baseUrl } = Constants.manifest.extra;
    const currUrl = parseUrl(url.toString());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    currUrl.pathname = parseUrl(baseUrl).pathname + currUrl.pathname;
    return currUrl.toString();
  }
  return url;
};
export const fetchWrapper = (
  input: RequestInfo | URL,
  init: RequestInit | undefined = { headers: {} },
): Promise<Response> => {
  return fetch(processUrl(input), {
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
