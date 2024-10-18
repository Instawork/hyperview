export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Region = {
  latitude: number;
  latitudeDelta: number;
  longitude: number;
  longitudeDelta: number;
};

export type HvProps = {
  animated: boolean;
  autoZoomToMarkers: 'off' | 'out-only' | 'on';
  region: Region;
  padding: number;
};
