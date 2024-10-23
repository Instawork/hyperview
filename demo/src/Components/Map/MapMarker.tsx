import type { HvComponentProps, LocalName } from 'hyperview';
import React, { useCallback } from 'react';
import Hyperview from 'hyperview';
import MapView from 'react-native-maps';
import type { MarkerHvProps } from './types';
import { namespace } from './types';

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
  const children = Hyperview.renderChildren(
    props.element,
    props.stylesheets,
    props.onUpdate,
    props.options,
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: MapView.Marker does exist, and is needed for the map to render on web
  return <MapView.Marker coordinate={coordinate}>{children}</MapView.Marker>;
};

MapMarker.namespaceURI = namespace;
MapMarker.localName = 'map-marker' as LocalName;
MapMarker.localNameAliases = [] as LocalName[];

export { MapMarker };
