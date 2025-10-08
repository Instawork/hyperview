import { Button, SafeAreaView, Text, View } from 'react-native';
import type { ElementErrorComponentProps } from 'hyperview/src/types';
import React from 'react';

const ElementErrorComponent = (props: ElementErrorComponentProps) => {
  return (
    <SafeAreaView>
      <View
        style={{
          alignItems: 'center',
          gap: 10,
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', paddingBottom: 10 }}>
          Custom Element Error
        </Text>

        <Text style={{ fontSize: 16, textAlign: 'center' }}>
          Error message:
          {props.error?.message}
        </Text>
        <Button onPress={props.onPressReload} title="Reload" />
        <Button onPress={props.onPressClose} title="Close" />
      </View>
    </SafeAreaView>
  );
};

export default ElementErrorComponent;
