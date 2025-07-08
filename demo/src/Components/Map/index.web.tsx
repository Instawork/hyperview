import React from 'react';
import { Text } from 'react-native';
import { namespace } from './types';

const NotSupported = () => {
  return <Text style={{ marginHorizontal: 24 }}>Not supported on web</Text>;
};

const Map = () => {
  return <NotSupported />;
};

Map.namespaceURI = namespace;
Map.localName = 'map';

const MapMarker = () => {
  return <NotSupported />;
};

MapMarker.namespaceURI = namespace;
MapMarker.localName = 'map-marker';

export { Map, MapMarker };
