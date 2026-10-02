import { Linking } from 'react-native';

export default {
  action: 'open-settings',
  callback: () => {
    Linking.openSettings();
  },
};
