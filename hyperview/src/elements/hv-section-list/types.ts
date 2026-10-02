export type State = {
  refreshing: boolean;
};

// https://reactnative.dev/docs/sectionlist#scrolltolocation
export type ScrollParams = {
  animated?: boolean | undefined;
  itemIndex: number;
  sectionIndex: number;
  viewOffset?: number;
  viewPosition?: number;
};
