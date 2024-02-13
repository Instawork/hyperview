import { Clipboard } from 'react-native';

export default {
  action: 'copy-to-clipboard',
  callback: (element: Element) => {
    const attributeName = 'copy-to-clipboard-value';
    const value: string | null | undefined = element.getAttribute(
      attributeName,
    );
    if (!value) {
      console.warn(
        `[behaviors/copy-to-clipboard]: missing "${attributeName}" attribute`,
      );
      return;
    }
    Clipboard.setString(value);
  },
};
