import { Platform, Share as RNShare } from 'react-native';
import { getContent, getOptions } from './helpers';

const namespace = 'https://hyperview.org/share';

export const Share = {
  action: 'share',
  callback: (element: Element) => {
    (async () => {
      const message = element.getAttributeNS(namespace, 'message');
      const title = element.getAttributeNS(namespace, 'title');
      const url = element.getAttributeNS(namespace, 'url');
      const content = getContent(
        Platform.OS === 'android'
          ? [message, url].filter(Boolean).join(' ')
          : message,
        title,
        url,
      );

      if (content) {
        const options = getOptions(
          element.getAttributeNS(namespace, 'dialog-title'),
          element.getAttributeNS(namespace, 'subject'),
        );
        // This share API is based off https://reactnative.dev/docs/share
        await RNShare.share(content, options);
      }
    })();
  },
};
