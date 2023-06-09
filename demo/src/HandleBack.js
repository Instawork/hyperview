/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFocusEffect, useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import React from 'react';

export default ({ children }) => {
  const route = useRoute();
  const isFirstRouteInParent = useNavigationState(
    state => state.routes[0].key === route.key
  );
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (!isFirstRouteInParent && route.params?.url?.includes('custom_android_back')) {
          navigation.popToTop(null);
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }),
  );

  return children;
};
