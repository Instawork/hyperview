import { Platform, StatusBar, StyleSheet } from 'react-native';

export default StyleSheet.create({
  btnWrapper: {
    paddingLeft: 8,
    paddingTop: 8,
  },
  button: {
    alignSelf: 'center',
    color: '#4778FF',
  },
  closeButton: {
    color: '#4778FF',
    fontSize: 24,
    fontWeight: 'bold',
    top: 2,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  safeArea: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 99,
  },
  textWrapper: {
    paddingTop: 8,
  },
  title: {
    color: 'black',
    textAlign: 'center',
  },
});
