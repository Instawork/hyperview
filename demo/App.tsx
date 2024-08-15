import './src/gesture-handler';
import * as Constants from './src/constants';
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { fetchWrapper, formatDate } from './src/helpers';
import Hyperview from 'hyperview';
import HyperviewFilter from './src/Components/hyperview-filter';
import HyperviewSvg from './src/Components/HyperviewSvg';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

export default () => (
  <SafeAreaProvider>
    <SafeAreaInsetsContext.Consumer>
      {insets => (
        <View
          style={{
            flex: 1,

            // Padding to handle safe area
            paddingBottom: insets?.bottom,
            paddingLeft: insets?.left,
            paddingRight: insets?.right,
          }}
        >
          <NavigationContainer>
            <Hyperview
              behaviors={[]}
              components={[HyperviewFilter, HyperviewSvg]}
              entrypointUrl={Constants.ENTRY_POINT_NAV_URL}
              fetch={fetchWrapper}
              formatDate={formatDate}
            />
          </NavigationContainer>
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  </SafeAreaProvider>
);
