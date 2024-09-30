import './src/gesture-handler';
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { Header, TabBar } from './src/Core';
import { fetchWrapper, formatDate } from './src/helpers';
import Behaviors from './src/Behaviors';
import Components from './src/Components';
import Constants from 'expo-constants';
import { HeaderContextProvider } from './src/Contexts';
import { TabBarContextProvider } from './src/Contexts';
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
            <HeaderContextProvider>
              <TabBarContextProvider>
                <Hyperview
                  behaviors={Behaviors}
                  components={Components}
                  entrypointUrl={`${Constants.expoConfig?.extra?.baseUrl}/hyperview/public/index.xml`}
                  fetch={fetchWrapper}
                  formatDate={formatDate}
                  navigationComponents={{
                    Header,
                    TabBar,
                  }}
                />
              </TabBarContextProvider>
            </HeaderContextProvider>
          </NavigationContainer>
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  </SafeAreaProvider>
);
