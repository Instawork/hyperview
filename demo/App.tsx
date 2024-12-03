import './src/gesture-handler';
import { Logger, fetchWrapper, formatDate } from './src/Helpers';
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import Behaviors from './src/Behaviors';
import { BottomTabBar } from './src/Core';
import { BottomTabBarContextProvider } from './src/Contexts';
import Components from './src/Components';
import Constants from 'expo-constants';
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
                logger={new Logger(Logger.Level.log)}
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
