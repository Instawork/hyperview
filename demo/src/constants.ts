import Constants from 'expo-constants';

// This is the URL of the service running the Hyperview examples
const baseUrl =
  Constants.manifest?.extra?.baseUrl ||
  'http://localhost:8085/hyperview/public';
export const ENTRY_POINT_URL = `${baseUrl}/index.xml`;

export const ENTRY_POINT_NAV_URL = `${baseUrl}/index.xml`;

export const MAIN_STACK_NAME = 'Main';

export const MODAL_STACK_NAME = 'Modal';
