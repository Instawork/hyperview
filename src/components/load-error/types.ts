export type Props = {
  back: () => void;
  error: Error | null | undefined;
  onPressReload: () => void;
  onPressViewDetails: (uri: string) => void;
};
