import type { HvComponentProps, LocalName } from 'hyperview';
import { useBottomTabBarContext } from '../Contexts';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const namespaceURI = 'https://hyperview.org/navigation';

/**
 * This component's only job is to associate its own props with a
 * navigator ID in BottomTabBarContext. It does not render anything.
 * It's child elements are used by the Core/BottomTabBar component
 * to build the bottom tab bar UI.
 *
 * Usage:
 * <navigation:bottom-tab-bar
 *   xmlns:navigation="https://hyperview.org/navigation"
 *   navigation:navigator="some-tab-navigator-id"
 * >
 *   ...
 * </navigation:bottom-tab-bar>
 */
const BottomTabBar = (props: HvComponentProps) => {
  const { setElementProps } = useBottomTabBarContext();
  const navigator = props.element.getAttributeNS(namespaceURI, 'navigator');

  useFocusEffect(
    useCallback(() => {
      if (!navigator) {
        console.warn(
          '<navigation:bottom-tab-bar> element is missing `navigator` attribute',
        );
        return;
      }
      // To avoid rendering loops, we only set the element props once
      if (props.element.getAttribute('registered') !== 'true') {
        props.element.setAttribute('registered', 'true');
        setElementProps?.(navigator, props);
      }
    }, [navigator, props, setElementProps]),
  );
  return null;
};

BottomTabBar.namespaceURI = namespaceURI;
BottomTabBar.localName = 'bottom-tab-bar' as LocalName;
BottomTabBar.localNameAliases = [] as LocalName[];

export { BottomTabBar };
