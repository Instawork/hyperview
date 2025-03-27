import * as NavigatorService from 'hyperview/src/services/navigator';
import { DOMString, ScreenState } from 'hyperview/src/types';

export type Props = {
  children?: React.ReactNode;
  doc?: Document;
  element?: Element;
  route?: NavigatorService.Route<
    string,
    {
      delay?: DOMString | number | null;
      url?: string | null;
    }
  >;
};

export type StateContextProps = {
  getLocalDoc: () => Document | null;
  getScreenState: () => ScreenState;
  loadUrl: (url?: string) => void;
  setLocalDoc: (doc: Document | null) => void;
  setScreenState: (state: ScreenState) => void;
};
