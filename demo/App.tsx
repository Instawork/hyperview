import './src/gesture-handler';
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { fetchWrapper, formatDate } from './src/helpers';
import Behaviors from './src/Behaviors';
import { BottomTabBar } from './src/Core';
import { BottomTabBarContextProvider } from './src/Contexts';
import Components from './src/Components';
import Constants from 'expo-constants';
import DefaultLoadingScreen from './src/Components/Loaders/DefaultLoader';
import GreenLoadingScreen from './src/Components/Loaders/GreenLoader';
import Hyperview from 'hyperview';
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
            <BottomTabBarContextProvider>
              <Hyperview
                behaviors={Behaviors}
                components={Components}
                entrypointUrl={`${Constants.expoConfig?.extra?.baseUrl}/hyperview/public/index.xml`}
                fetch={fetchWrapper}
                formatDate={formatDate}
                loadingScreen={DefaultLoadingScreen}
                // Provide custom named loading screen(s)
                loadingScreens={{
                  'green-loader': GreenLoadingScreen,
                }}
                navigationComponents={{
                  BottomTabBar,
                }}
              />
            </BottomTabBarContextProvider>
          </NavigationContainer>
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  </SafeAreaProvider>
);
