import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // The native spinner only exists to present the system dialog, it is never
  // part of the layout of the field.
  anchor: {
    height: 0,
    opacity: 0,
    position: 'absolute',
    width: 0,
  },
});
