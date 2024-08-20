import './src/gesture-handler';
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { fetchWrapper, formatDate } from './src/helpers';
import Behaviors from './src/Behaviors';
import Components from './src/Components';
import Constants from 'expo-constants';
import Hyperview from 'hyperview';
<<<<<<< HEAD
import HyperviewFilter from './src/Components/hyperview-filter';
import HyperviewSvg from './src/Components/HyperviewSvg';
=======
>>>>>>> master
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
<<<<<<< HEAD
              behaviors={[]}
              components={[HyperviewFilter, HyperviewSvg]}
              entrypointUrl={Constants.ENTRY_POINT_NAV_URL}
=======
              behaviors={Behaviors}
              components={Components}
              entrypointUrl={`${Constants.expoConfig?.extra?.baseUrl}/hyperview/public/index.xml`}
>>>>>>> master
              fetch={fetchWrapper}
              formatDate={formatDate}
            />
          </NavigationContainer>
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  </SafeAreaProvider>
);
