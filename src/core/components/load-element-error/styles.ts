import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  btnWrapper: {
    paddingLeft: 8,
    paddingTop: 8,
  },
  button: {
    alignSelf: 'center',
    color: '#4778FF',
  },
  container: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  safeArea: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  textWrapper: {
    paddingTop: 8,
  },
  title: {
    color: 'black',
    textAlign: 'center',
  },
});
