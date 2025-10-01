import { Button, SafeAreaView, Text, View } from 'react-native';
import type { ErrorScreenProps } from 'hyperview/src/types';
import React from 'react';

const ErrorScreen = (props: ErrorScreenProps) => {
  return (
    <SafeAreaView>
      <View
        style={{
          alignItems: 'center',
          gap: 10,
          height: '100%',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', paddingBottom: 10 }}>
          Custom Error Screen
        </Text>

        <Text style={{ fontSize: 16, textAlign: 'center' }}>
          Error message:
          {props.error?.message}
        </Text>
        <Button onPress={props.onPressReload} title="Reload" />
        <Button onPress={props.back} title="Back" />
      </View>
    </SafeAreaView>
  );
};

export default ErrorScreen;
