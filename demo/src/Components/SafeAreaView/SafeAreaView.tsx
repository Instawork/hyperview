import React, { useMemo } from 'react';
import { createStyleProp, renderChildren } from 'hyperview';
import type { HvComponentProps } from 'hyperview';
import type { InsetsStyle } from './types';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const namespaceURI = 'https://hyperview.org/safe-area';

const defaultMode = 'padding';
const defaultInsets = JSON.stringify(['top', 'bottom', 'left', 'right']);

/**
 * A component that applies safe area insets to its children.
 * Supported attributes:
 * - mode: 'margin' | 'padding' (default: 'padding')
 * - insets: list'top' | 'bottom' | 'left' | 'right' (default: 'top' | 'bottom' | 'left' | 'right')
 *
 * Usage:
 * ```xml
 * <safe-area:safe-area-view
 *  xmlns:safe-area="https://hyperview.org/safe-area"
 *  safe-area:mode="padding"
 *  safe-area:insets="[&quot;left&quot;, &quot;bottom&quot;, &quot;right&quot;]"
 * >
 *   <view>
 *     <text>Hello, world!</text>
 *   </view>
 * </safe-area:safe-area-view>
 */
const SafeAreaView = (props: HvComponentProps) => {
  const key = props.element.getAttribute('key') || undefined;
  const mode =
    props.element.getAttributeNS(namespaceURI, 'mode') || defaultMode;
  const insets =
    props.element.getAttributeNS(namespaceURI, 'insets') || defaultInsets;
  const children = renderChildren(
    props.element,
    props.stylesheets,
    props.onUpdate,
    props.options,
  );
  const extraStyle = createStyleProp(
    props.element,
    props.stylesheets,
    props.options,
  );
  const safeAreaInsets = useSafeAreaInsets();
  const style = useMemo(() => {
    const styles: InsetsStyle = {};
    try {
      const styleProps = JSON.parse(insets);
      switch (mode) {
        case 'margin':
          if (styleProps.includes('bottom')) {
            styles.marginBottom = safeAreaInsets.bottom;
          }
          if (styleProps.includes('left')) {
            styles.marginLeft = safeAreaInsets.left;
          }
          if (styleProps.includes('right')) {
            styles.marginRight = safeAreaInsets.right;
          }
          if (styleProps.includes('top')) {
            styles.marginTop = safeAreaInsets.top;
          }
          break;
        case 'padding':
          if (styleProps.includes('bottom')) {
            styles.paddingBottom = safeAreaInsets.bottom;
          }
          if (styleProps.includes('left')) {
            styles.paddingLeft = safeAreaInsets.left;
          }
          if (styleProps.includes('right')) {
            styles.paddingRight = safeAreaInsets.right;
          }
          if (styleProps.includes('top')) {
            styles.paddingTop = safeAreaInsets.top;
          }
          break;
        default:
          break;
      }
    } catch (e) {
      // Swallow errors
    }
    return [styles, extraStyle];
  }, [insets, mode, safeAreaInsets, extraStyle]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <View key={key} style={style}>
      {children}
    </View>
  );
};

SafeAreaView.namespaceURI = namespaceURI;
SafeAreaView.localName = 'safe-area-view';

export { SafeAreaView };
