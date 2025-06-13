export type State = {
  refreshing: boolean;
};

// https://reactnative.dev/docs/flatlist#scrolltoindex
export type ScrollParams = {
  animated?: boolean | undefined;
  index: number;
  viewOffset?: number;
  viewPosition?: number;
};
