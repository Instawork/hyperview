import React from 'react';
import { View } from 'react-native';

// Simple passthrough on web. We might want to detect
// the device type in the future, to support keyboard
// avoiding when the web page is rendered on device
// equiped with a virtual keyboard
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (props: any) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <View {...props} />
);
