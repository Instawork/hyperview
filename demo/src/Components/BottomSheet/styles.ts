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
  line: {
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
});
