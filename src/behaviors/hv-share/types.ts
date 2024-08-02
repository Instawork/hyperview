export type Content = {
  title?: string;
} & ({ message: string; url?: string } | { message?: string; url: string });

// copied from react-native/Share/Share.js
export type Options = {
  dialogTitle?: string;
  excludedActivityTypes?: Array<string>;
  tintColor?: string;
  subject?: string;
};
