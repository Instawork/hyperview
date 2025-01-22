import Constants from 'expo-constants';
import moment from 'moment';

export const formatDate = (
  date: Date | null | undefined,
  format: string | undefined,
) => moment(date).format(format);

export const fetchWrapper = (
  input: RequestInfo | URL,
  init: RequestInit | undefined = { headers: {} },
): Promise<Response> => {
  const response = fetch(input, {
    ...init,
    headers: {
      // Don't cache requests for the demo
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Expires: '0',
      Pragma: 'no-cache',
      ...init.headers,
    },
    mode: 'cors',
  });

  const baseUrl = Constants.expoConfig?.extra?.baseUrl;
  const delayTime = baseUrl && input.toString().startsWith(baseUrl) ? 750 : 0;

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(response);
    }, delayTime);
  });
};
