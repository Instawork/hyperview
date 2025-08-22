import MapView, { MapMarker as RNMapMarker } from 'react-native-maps';
import React, { useCallback } from 'react';
import type { HvComponentProps } from 'hyperview';
import type { MarkerHvProps } from './types';
import { Platform } from 'react-native';
import { namespace } from './types';
import { renderChildren } from 'hyperview';

const MapMarker = (props: HvComponentProps) => {
  const getAttribute = useCallback(
    (attribute: string): string | null =>
      props.element.getAttributeNS(namespace, attribute),
    [props.element],
  );
  const coordinate: MarkerHvProps = {
    latitude: parseFloat(getAttribute('latitude') || '0'),
    longitude: parseFloat(getAttribute('longitude') || '0'),
  };
  const children = renderChildren(
    props.element,
    props.stylesheets,
    props.onUpdate,
    props.options,
  );
  if (Platform.OS === 'web') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: MapView.Marker does exist, and is needed for the map to render on web
    return <MapView.Marker coordinate={coordinate}>{children}</MapView.Marker>;
  }
  return <RNMapMarker coordinate={coordinate}>{children}</RNMapMarker>;
};

MapMarker.namespaceURI = namespace;
MapMarker.localName = 'map-marker';

export { MapMarker };
