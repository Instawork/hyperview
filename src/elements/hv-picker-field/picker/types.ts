import type { ReactNode } from 'react';

export type Props = {
  children?: ReactNode;
  focused: boolean;
  onCancel: () => void;
  onDone: (value: string) => void;
  value: string;
};
