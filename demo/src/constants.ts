import Constants from 'expo-constants';
import parseUrl from 'url-parse';

// This is the URL of the service running the Hyperview examples
const baseUrl = Constants.manifest?.extra?.baseUrl;
const baseUrlOrigin = baseUrl ? parseUrl(baseUrl)?.origin?.toString() : '';
export const ENTRY_POINT_URL = baseUrlOrigin
  ? `${baseUrlOrigin}/index.xml`
  : 'http://0.0.0.0:8085/index.xml';

export const MAIN_STACK_NAME = 'Main';
