import type { HvComponentProps } from 'hyperview';
import Hyperview from 'hyperview';
import MapView from 'react-native-maps';
import React from 'react';
import type { HvProps } from './types';

const MapMarker = (props: HvComponentProps) => {
  const rawProps = Hyperview.createProps(
    props.element,
    props.stylesheets,
    props.options,
  );
  const coordinate: HvProps = {
    latitude: parseFloat(rawProps.latitude),
    longitude: parseFloat(rawProps.longitude),
  };
  const children = Hyperview.renderChildren(
    props.element,
    props.stylesheets,
    props.onUpdate,
    props.options,
  );
  return <MapView.Marker coordinate={coordinate}>{children}</MapView.Marker>;
};

MapMarker.namespaceURI = 'https://instawork.com/hyperview-map';

MapMarker.localName = 'map-marker';

export { MapMarker };
