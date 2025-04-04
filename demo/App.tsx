import './src/gesture-handler';
import * as Linking from 'expo-linking';
import { Logger, fetchWrapper, formatDate } from './src/Helpers';
import Behaviors from './src/Behaviors';
import { BottomTabBar } from './src/Core';
import { BottomTabBarContextProvider } from './src/Contexts';
import Components from './src/Components';
import Constants from 'expo-constants';
import Hyperview from 'hyperview';
import LoadingScreen from './src/loading-screen';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// this value needs to match the path prefix where the app is hosted
// our demo app is hosted under instawork.github.io/hyperview
const pathPrefix = 'hyperview';

const linking = {
  config: {
    screens: {
      card: {
        path: `${pathPrefix}/card`,
      },
      modal: {
        path: `${pathPrefix}/modal`,
      },
      tabs: {
        path: `${pathPrefix}/tabs`,
      },
    },
  },
  prefixes: [Linking.createURL('/')],
};

export default () => (
  <SafeAreaProvider>
    <NavigationContainer linking={linking}>
      <BottomTabBarContextProvider>
        <Hyperview
          behaviors={Behaviors}
          components={Components}
          entrypointUrl={`${Constants.expoConfig?.extra?.baseUrl}/hyperview/public/index.xml`}
          experimentalFeatures={{ navStateMutationsDelay: 10 }}
          fetch={fetchWrapper}
          formatDate={formatDate}
          loadingScreen={LoadingScreen}
          logger={new Logger(Logger.Level.log)}
          navigationComponents={{
            BottomTabBar,
          }}
        />
      </BottomTabBarContextProvider>
    </NavigationContainer>
  </SafeAreaProvider>
);
