import Hyperview from 'hyperview';
import moment from 'moment';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

export default () => {
  return (
    <NavigationContainer>
      <Hyperview
        behaviors={[]} // Add your custom behaviors here
        components={[]} // Add your custom components here
        entrypointUrl="https://yourserver.com/index.xml"
        fetch={fetch}
        formatDate={(date: Date, format: string) => {
          moment(date).format(format);
        }}
      />
    </NavigationContainer>
  );
};