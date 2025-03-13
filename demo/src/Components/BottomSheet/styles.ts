import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: 'gray',
    borderRadius: 25,
    height: 4,
    marginTop: 15,
    width: 75,
  },
  overlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
