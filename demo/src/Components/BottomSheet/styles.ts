import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  bottomSheetContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    width: '100%',
  },
  container: {
    left: 0,
    position: 'absolute',
    right: 0,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: 'gray',
    borderRadius: 25,
    height: 4,
    marginVertical: 15,
    width: 75,
  },
  overflow: {
    overflow: 'hidden',
  },
  overlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
