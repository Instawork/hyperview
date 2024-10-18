import type { Coordinate, HvProps } from './types';
import React, { useRef } from 'react';
import type { ElementRef } from 'react';
import type { HvComponentProps } from 'hyperview';
import Hyperview from 'hyperview';
import MapView from 'react-native-maps';

const Map = (props: HvComponentProps) => {
  const rawProps = Hyperview.createProps(
    props.element,
    props.stylesheets,
    props.options,
  );
  const hvProps: HvProps = {
    animated: rawProps.animated !== 'false',
    autoZoomToMarkers: rawProps['auto-zoom-to-markers'] ?? 'on',
    padding: rawProps.padding ? parseInt(rawProps.padding, 10) : 0,
    region: {
      latitude: parseFloat(rawProps.latitude),
      latitudeDelta: parseFloat(rawProps['latitude-delta']),
      longitude: parseFloat(rawProps.longitude),
      longitudeDelta: parseFloat(rawProps['longitude-delta']),
    },
  };

  const ref = useRef<ElementRef<typeof MapView>>(null);
  const coordinates: Array<Coordinate> = Array.from(props.element.childNodes)
    .filter(n => (n as Element).tagName === 'map:map-marker')
    .map(marker => ({
      latitude: parseFloat((marker as Element).getAttribute('latitude') || '0'),
      longitude: parseFloat(
        (marker as Element).getAttribute('longitude') || '0',
      ),
    }));

  const onLayout = () => {
    // When there are more than one marker on the map,
    // use their coordinates to readjust map zoom/pan
    if (
      hvProps.autoZoomToMarkers === 'off' ||
      !ref.current ||
      coordinates.length <= 1
    ) {
      return;
    }

    if (hvProps.autoZoomToMarkers === 'out-only') {
      // calculate the region that fits all markers
      const minLat = Math.min(...coordinates.map(c => c.latitude));
      const maxLat = Math.max(...coordinates.map(c => c.latitude));
      const minLon = Math.min(...coordinates.map(c => c.longitude));
      const maxLon = Math.max(...coordinates.map(c => c.longitude));

      // check if the shown region already fits all markers based on the current map region
      if (
        minLat >= hvProps.region.latitude - hvProps.region.latitudeDelta &&
        maxLat <= hvProps.region.latitude + hvProps.region.latitudeDelta &&
        minLon >= hvProps.region.longitude - hvProps.region.longitudeDelta &&
        maxLon <= hvProps.region.longitude + hvProps.region.longitudeDelta
      ) {
        return;
      }
    }

    ref.current.fitToCoordinates(coordinates, {
      animated: hvProps.animated,
      edgePadding: {
        bottom: hvProps.padding,
        left: hvProps.padding,
        right: hvProps.padding,
        top: hvProps.padding,
      },
    });
  };

  const children = Hyperview.renderChildren(
    props.element,
    props.stylesheets,
    props.onUpdate,
    props.options,
  );

  return (
    <MapView
      ref={ref}
      cacheEnabled={false}
      initialRegion={hvProps.region}
      liteMode
      moveOnMarkerPress={false}
      onLayout={onLayout}
      pitchEnabled={false}
      scrollEnabled={false}
      showsBuildings={false}
      showsCompass={false}
      showsIndoors={false}
      showsMyLocationButton={false}
      showsPointsOfInterest
      showsScale={false}
      showsTraffic={false}
      showsUserLocation={false}
      style={rawProps.style}
      toolbarEnabled={false}
      zoomEnabled={false}
    >
      {children}
    </MapView>
  );
};

Map.namespaceURI = 'https://instawork.com/hyperview-map';

Map.localName = 'map';

export { Map };
