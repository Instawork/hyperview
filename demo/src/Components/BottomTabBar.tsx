import type { HvComponentProps, LocalName } from 'hyperview';
import { useBottomTabBarContext } from '../Contexts';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const namespaceURI = 'https://instawork.com/hyperview-navigation';

/**
 * This component's only job is to associate its own props with a
 * navigator ID in BottomTabBarContext. It does not render anything.
 * It's child elements are used by the Core/BottomTabBar component
 * to build the bottom tab bar UI.
 *
 * Usage:
 * <navigation:bottom-tab-bar
 *   xmlns:navigation="https://instawork.com/hyperview-navigation"
 *   navigation:navigator="some-tab-navigator-id"
 * >
 *   ...
 * </navigation:bottom-tab-bar>
 */
const BottomTabBar = (props: HvComponentProps) => {
  const { setElementProps } = useBottomTabBarContext();
  const navigator = props.element.getAttributeNS(namespaceURI, 'navigator');
  const route = props.element.getAttributeNS(namespaceURI, 'route');
  useFocusEffect(
    useCallback(() => {
      console.info(`setting tab bar for route: ${route}`);
      if (!navigator) {
        console.warn(
          '<navigation:bottom-tab-bar> element is missing `navigator` attribute',
        );
        return;
      }
      setElementProps?.(navigator, props);
    }, [navigator, route, props, setElementProps]),
  );
  return null;
};

BottomTabBar.namespaceURI = namespaceURI;
BottomTabBar.localName = 'bottom-tab-bar' as LocalName;
BottomTabBar.localNameAliases = [] as LocalName[];

export { BottomTabBar };
