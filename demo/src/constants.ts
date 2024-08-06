// This is the URL of the service running the Hyperview examples
export const ENTRY_POINT_URL = process.env.BASE_URL
  ? BASE_URL + '/index.xml'
  : 'http://0.0.0.0:8085/index_navigator.xml';

// This is the URL of the service running a navigator example
export const ENTRY_POINT_NAV_URL = process.env.BASE_URL
  ? BASE_URL + '/index.xml'
  : 'http://0.0.0.0:8085/index_navigator.xml';

export const MAIN_STACK_NAME = 'Main';
