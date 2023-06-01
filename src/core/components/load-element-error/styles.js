// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
