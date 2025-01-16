import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    left: 0,
    position: 'absolute',
    right: 0,
  },
  overlay: {
    backgroundColor: '#2f2f2f',
    bottom: 0,
    left: 0,
    opacity: 0.6,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  wrapper: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  bottomSheetContainer: {
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'gray',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 25,
  },
  viewOverlay: {
    backgroundColor: 'red',
  },
  overflow: {
    overflow: 'hidden',
  },
});
