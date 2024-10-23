import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import type { HvComponentProps } from 'hyperview';
import { Loader } from '@googlemaps/js-api-loader';
import { Map as MapComponent } from './Map';

const Map = (props: HvComponentProps) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initGoogleMaps = async () => {
      const loader = new Loader({
        apiKey: Constants.expoConfig?.extra?.googleMapsApiKey,
        version: 'weekly',
      });
      await loader.load();
      setLoading(false);
    };
    initGoogleMaps();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MapComponent {...props} />;
};

Map.namespaceURI = MapComponent.namespaceURI;
Map.localName = MapComponent.localName;
Map.localNameAliases = MapComponent.localNameAliases;

export { Map };
export { MapMarker } from './MapMarker';
