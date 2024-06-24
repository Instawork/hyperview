import * as Dom from 'hyperview/src/services/dom';
import * as Logging from 'hyperview/src/services/logging';
import * as UrlService from 'hyperview/src/services/url';
import type {
  HvComponentOnUpdate,
  HvGetRoot,
  HvUpdateRoot,
  ScreenState,
} from 'hyperview/src/types';
import { ACTIONS } from 'hyperview/src/types';

export default {
  action: ACTIONS.PREFETCH,
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot,
    screenState: ScreenState,
    parser: Dom.Parser,
  ) => {
    const href = element.getAttribute('href');
    if (!href) {
      Logging.warn('[behaviors/prefetch] requires an "href" attribute');
      return;
    }
    const url = UrlService.getUrlFromHref(href, screenState.url || '');
    // Wait for the current event loop to finish before prefetching the next screen
    setTimeout(async () => {
      await parser.load(url);
    }, 0);
  },
};
