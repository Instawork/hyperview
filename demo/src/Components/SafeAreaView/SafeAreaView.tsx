import React, { useMemo } from 'react';
import { createStyleProp, renderChildren } from 'hyperview';
import type { HvComponentProps } from 'hyperview';
import type { InsetsStyle } from './types';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-screens/experimental';
import { View } from 'react-native';
import { isLiquidGlassSupported } from '../../Core/BottomTabView/helpers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const namespaceURI = 'https://hyperview.org/safe-area';

const defaultMode = 'padding';
const defaultInsets = JSON.stringify(['top', 'bottom', 'left', 'right']);
const noEdges = {
  bottom: false,
  left: false,
  right: false,
  top: false,
};

const parseEdges = (value: string) => {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return noEdges;
    }
    const edges = new Set<unknown>(parsed);
    return {
      bottom: edges.has('bottom'),
      left: edges.has('left'),
      right: edges.has('right'),
      top: edges.has('top'),
    };
  } catch {
    return noEdges;
  }
};

/**
 * A component that applies safe area insets to its children.
 * Supported attributes:
 * - mode: 'margin' | 'padding' | 'screen' (default: 'padding')
 * - insets: list of 'top' | 'bottom' | 'left' | 'right'
 *   (default: ['top', 'bottom', 'left', 'right'])
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
  const edges = useMemo(() => parseEdges(insets), [insets]);
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
    if (mode === 'margin') {
      if (edges.bottom) {
        styles.marginBottom = safeAreaInsets.bottom;
      }
      if (edges.left) {
        styles.marginLeft = safeAreaInsets.left;
      }
      if (edges.right) {
        styles.marginRight = safeAreaInsets.right;
      }
      if (edges.top) {
        styles.marginTop = safeAreaInsets.top;
      }
    } else if (mode === 'padding' || mode === 'screen') {
      if (edges.bottom) {
        styles.paddingBottom = safeAreaInsets.bottom;
      }
      if (edges.left) {
        styles.paddingLeft = safeAreaInsets.left;
      }
      if (edges.right) {
        styles.paddingRight = safeAreaInsets.right;
      }
      if (mode === 'padding' && edges.top) {
        styles.paddingTop = safeAreaInsets.top;
      }
    }
    return [styles, extraStyle];
  }, [edges, mode, safeAreaInsets, extraStyle]);

  if (mode === 'screen') {
    if (isLiquidGlassSupported()) {
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
