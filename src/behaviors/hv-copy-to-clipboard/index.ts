import * as Logging from 'hyperview/src/services/logging';
import { BehaviorCopyToClipboardError } from 'hyperview/src/errors';
import { Clipboard } from 'react-native';

export default {
  action: 'copy-to-clipboard',
  callback: (element: Element) => {
    const attributeName = 'copy-to-clipboard-value';
    const value: string | null | undefined = element.getAttribute(
      attributeName,
    );
    if (!value) {
      Logging.warn(new BehaviorCopyToClipboardError(element, attributeName));
      return;
    }
    Clipboard.setString(value);
  },
};
