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
  button: {
    color: '#4778FF',
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#fbb90e',
  },
  safeArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  title: {
    color: '#ffffff',
    textAlign: 'center',
  },
});
