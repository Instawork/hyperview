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
    alignSelf: 'center',
    color: '#4778FF',
    paddingHorizontal: 8,
  },
  container: {
    backgroundColor: '#fbb90e',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  safeArea: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  title: {
    color: '#ffffff',
    textAlign: 'center',
  },
});
