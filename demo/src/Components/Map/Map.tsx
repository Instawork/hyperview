import type { AutoZoomToMarker, Coordinate, HvProps } from './types';
import React, { useCallback, useRef } from 'react';
import { createStyleProp, renderChildren } from 'hyperview';
import type { ElementRef } from 'react';
import type { HvComponentProps } from 'hyperview';
import MapView from 'react-native-maps';
import { namespace } from './types';

const Map = (props: HvComponentProps) => {
  const style = createStyleProp(
    props.element,
    props.stylesheets,
    props.options,
  );
  const getAttribute = useCallback(
    (attribute: string): string | null =>
      props.element.getAttributeNS(namespace, attribute),
    [props.element],
  );

  const hvProps: HvProps = {
    animated: getAttribute('animated') !== 'false',
    autoZoomToMarkers:
      (getAttribute('auto-zoom-to-markers') as AutoZoomToMarker) ?? 'on',
    padding: parseInt(getAttribute('padding') || '0', 10),
    region: {
      latitude: parseFloat(getAttribute('latitude') || '0'),
      latitudeDelta: parseFloat(getAttribute('latitude-delta') || '0'),
      longitude: parseFloat(getAttribute('longitude') || '0'),
      longitudeDelta: parseFloat(getAttribute('longitude-delta') || '0'),
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

  const children = renderChildren(
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
      style={style}
      toolbarEnabled={false}
      zoomEnabled={false}
    >
      {children}
    </MapView>
  );
};

Map.namespaceURI = namespace;
Map.localName = 'map';

export { Map };
