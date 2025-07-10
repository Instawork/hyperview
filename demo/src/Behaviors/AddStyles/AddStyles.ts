import type {
  HvBehavior,
  HvComponentOnUpdate,
  HvGetRoot,
  HvUpdateRoot,
} from 'hyperview';
import {
  getAncestorByTagName,
  getFirstTag,
  shallowCloneToRoot,
} from 'hyperview';

/**
 * Checks if a style element has changed by comparing its attributes and children
 */
const hasStyleChanged = (oldStyle: Element, newStyle: Element): boolean => {
  // Compare attributes
  const oldAttrs = oldStyle.attributes ? Array.from(oldStyle.attributes) : [];
  const newAttrs = newStyle.attributes ? Array.from(newStyle.attributes) : [];

  if (oldAttrs.length !== newAttrs.length) {
    return true;
  }

  // Check if any attribute values differ
  const hasAttrChanged = newAttrs.some(
    newAttr => oldStyle.getAttribute(newAttr.name) !== newAttr.value,
  );
  if (hasAttrChanged) {
    return true;
  }

  // Compare children recursively
  const oldChildren = oldStyle.childNodes
    ? Array.from(oldStyle.childNodes)
    : [];
  const newChildren = newStyle.childNodes
    ? Array.from(newStyle.childNodes)
    : [];

  if (oldChildren.length !== newChildren.length) {
    return true;
  }

  // Check if any child elements differ
  return newChildren.some((newChild, index) =>
    hasStyleChanged(oldChildren[index] as Element, newChild as Element),
  );
};

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
      const newStyles = getFirstTag(element, 'styles');
      if (newStyles) {
        const screen = getAncestorByTagName(element, 'screen');
        if (screen) {
          const styles: Element | null | undefined = getFirstTag(
            screen,
            'styles',
          );
          const styleElements = Array.from(
            newStyles.getElementsByTagName('style'),
          ).filter(e => !!e.getAttribute('id'));
          if (styles && styleElements) {
            const existingStyles = Array.from(
              styles.getElementsByTagName('style') || [],
            );
            let hasChanges = false;
            styleElements.forEach(style => {
              const styleId = style.getAttribute('id');
              const existingStyle = existingStyles.find(
                e => e.getAttribute('id') === styleId,
              );
              if (!existingStyle) {
                styles.appendChild(style);
                hasChanges = true;
              } else if (style && hasStyleChanged(existingStyle, style)) {
                styles.replaceChild(style, existingStyle);
                hasChanges = true;
              }
            });

            if (hasChanges) {
              // Only perform cloning if styles have changed
              const newRoot: Document = shallowCloneToRoot(styles);
              updateRoot(newRoot, true);
            }
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
