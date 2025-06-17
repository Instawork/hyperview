export const namespace = 'https://hyperview.org/map';

export type Coordinate = {
  latitude: number;
  longitude: number;
};

type Region = {
  latitude: number;
  latitudeDelta: number;
  longitude: number;
  longitudeDelta: number;
};

export type AutoZoomToMarker = 'off' | 'out-only' | 'on';

export type HvProps = {
  animated: boolean;
  autoZoomToMarkers: AutoZoomToMarker;
  region: Region;
  padding: number;
};

export type MarkerHvProps = {
  latitude: number;
  longitude: number;
};
