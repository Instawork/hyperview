import type { HvComponentProps } from 'hyperview';
import { namespaceURI } from './constants';
import { useBottomTabBarContext } from '../../Contexts';
import { useEffect } from 'react';

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
  useEffect(() => {
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
  }, [navigator, props, setElementProps]);
  return null;
};

BottomTabBar.namespaceURI = namespaceURI;
BottomTabBar.localName = 'bottom-tab-bar';

export { BottomTabBar };
