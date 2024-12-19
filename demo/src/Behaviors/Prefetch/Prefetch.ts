import * as Dom from 'hyperview/src/services/dom';
import * as UrlService from 'hyperview/src/services/url';
import type { DemoBehavior } from '../types';
import { fetchWrapper } from '../../Helpers';

const parser = new Dom.Parser(fetchWrapper, undefined, undefined);

export const Prefetch: DemoBehavior = (entrypointUrl: string) => ({
  action: 'prefetch',
  callback: async (element: Element) => {
    const href = element.getAttribute('href');
    const delay = parseInt(element.getAttribute('delay') || '0', 10);
    if (!href || !entrypointUrl) {
      return;
    }

    const action = async () => {
      const ranOnce = element.getAttribute('ran-once');
      const once = element.getAttribute('once');
      if (once === 'true') {
        if (ranOnce === 'true') {
          return;
        }
        element.setAttribute('ran-once', 'true');
      }
      const url = UrlService.getUrlFromHref(href, entrypointUrl);
      await parser.load(url);
    };

    // Make sure the prefetch happens after the current event loop is done
    // so that it doesn't block the current code execution such as rendering the current screen.
    // As prefefetching has no immediate effect on the current screen, it's safe to delay it.
    setTimeout(action, delay);
  },
});
