export type Content = {
  title?: string;
} & ({ message: string; url?: string } | { message?: string; url: string });

export type Options = {
  dialogTitle?: string;
  excludedActivityTypes?: Array<string>;
  tintColor?: string;
  subject?: string;
};
