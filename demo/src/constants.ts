import Constants from 'expo-constants';
// This is the URL of the service running the Hyperview examples
const base_url = Constants.manifest?.extra?.base_url;
export const ENTRY_POINT_URL = base_url
  ? base_url + '/index.xml'
  : 'http://0.0.0.0:8085/index_navigator.xml';

// This is the URL of the service running a navigator example
export const ENTRY_POINT_NAV_URL = base_url
  ? base_url + '/index.xml'
  : 'http://0.0.0.0:8085/index_navigator.xml';

export const MAIN_STACK_NAME = 'Main';
