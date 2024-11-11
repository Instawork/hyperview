import * as Dom from 'hyperview/src/services/dom';
import type {
  HvBehavior,
  HvComponentOnUpdate,
  HvGetRoot,
  HvUpdateRoot,
} from 'hyperview';
import {
  getAncestorByTagName,
  shallowCloneToRoot,
} from 'hyperview/src/services';

/**
 * This behavior allows injecting styles into the screen's styles element.
 * It is useful when loading partial Hyperview documents that need their own styles.
 * Usage:
 * <behavior trigger="load" once="true" action="add-styles">
 *   <styles>
 *     <style id="foo" backgroundColor="red" />
 *   </styles>
 * </behavior>
 */
export const AddStyles: HvBehavior = {
  action: 'add-styles',
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot,
  ) => {
    try {
      const newStyles = Dom.getFirstTag(element, 'styles');
      if (newStyles) {
        const screen = getAncestorByTagName(element, 'screen');
        if (screen) {
          const styles = Dom.getFirstTag(screen, 'styles');
          const styleElements = newStyles.getElementsByTagName('style');
          if (styles && styleElements) {
            Array.from(styleElements).forEach(style => {
              styles.appendChild(style);
            });
            const newRoot = shallowCloneToRoot(styles);
            updateRoot(newRoot, true);
          }
        }
      }
      const ranOnce = element.getAttribute('ran-once');
      const once = element.getAttribute('once');
      if (once === 'true') {
        if (ranOnce === 'true') {
          return;
        }
        element.setAttribute('ran-once', 'true');
      }
    } catch (err) {
      console.error(err);
    }
  },
};
