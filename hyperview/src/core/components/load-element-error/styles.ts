import { Platform, StatusBar, StyleSheet } from 'react-native';

export default StyleSheet.create({
  btnWrapper: {
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  button: {
    alignSelf: 'center',
    color: '#4778FF',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  safeArea: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    position: 'absolute',
    width: '100%',
    zIndex: 99,
  },
  textWrapper: {
    paddingTop: 8,
  },
  title: {
    color: 'black',
  },
});
