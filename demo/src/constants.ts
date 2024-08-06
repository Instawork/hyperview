import Constants from 'expo-constants';
const parseUrl = require('url-parse');
// This is the URL of the service running the Hyperview examples
const base_url = Constants.manifest?.extra?.base_url;
const base_url_origin = base_url ? parseUrl(base_url)?.origin?.toString() : '';
export const ENTRY_POINT_URL = base_url_origin
  ? base_url_origin + '/index.xml'
  : 'http://0.0.0.0:8085/index.xml';

// This is the URL of the service running a navigator example
export const ENTRY_POINT_NAV_URL = base_url_origin
  ? base_url_origin + '/index.xml'
  : 'http://0.0.0.0:8085/index_navigator.xml';

export const MAIN_STACK_NAME = 'Main';
