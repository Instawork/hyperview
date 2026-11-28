import React, { useMemo } from 'react';
import { createStyleProp, renderChildren } from 'hyperview';
import type { HvComponentProps } from 'hyperview';
import type { InsetsStyle } from './types';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-screens/experimental';
import type { SafeAreaViewProps } from 'react-native-screens/experimental';
import { View } from 'react-native';
import { isLiquidGlassSupported } from '../../Helpers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const namespaceURI = 'https://hyperview.org/safe-area';

const defaultMode = 'padding';
const defaultInsets = JSON.stringify(['top', 'bottom', 'left', 'right']);

/**
 * A component that applies safe area insets to its children.
 * Supported attributes:
 * - mode: 'margin' | 'padding' | 'screen' (default: 'padding')
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
  const edges = useMemo(() => getEdges(insets), [insets]);
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
        case 'screen':
          if (styleProps.includes('bottom')) {
            styles.paddingBottom = safeAreaInsets.bottom;
          }
          if (styleProps.includes('left')) {
            styles.paddingLeft = safeAreaInsets.left;
          }
          if (styleProps.includes('right')) {
            styles.paddingRight = safeAreaInsets.right;
          }
          if (mode === 'padding' && styleProps.includes('top')) {
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

  if (mode === 'screen' && isLiquidGlassSupported()) {
    return (
      <NativeSafeAreaView key={key} edges={edges} style={extraStyle}>
        {children}
      </NativeSafeAreaView>
    );
  }

  return (
    <View key={key} style={style}>
      {children}
    </View>
  );
};

SafeAreaView.namespaceURI = namespaceURI;
SafeAreaView.localName = 'safe-area-view';

export { SafeAreaView };

function getEdges(insets: string): SafeAreaViewProps['edges'] {
  try {
    const parsed: unknown = JSON.parse(insets);
    if (!Array.isArray(parsed)) {
      return {};
    }
    return {
      bottom: parsed.includes('bottom'),
      left: parsed.includes('left'),
      right: parsed.includes('right'),
      top: parsed.includes('top'),
    };
  } catch {
    return {};
  }
}
