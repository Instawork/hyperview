import { useContext, useEffect } from 'react';
import type { HvComponentProps, LocalName } from 'hyperview';
import { TabBarContext } from '../Contexts';
import { XMLSerializer } from '@instawork/xmldom';

const namespaceURI = 'https://instawork.com/hyperview-navigation';

/**
 * This component's only job is to associate its own props with a
 * navigator ID in TabBarContext. It does not render anything.
 * It's child elements are used by the Core/TabBar component
 * to build the tab bar UI.
 *
 * Usage:
 * <navigation:tabbar
 *   xmlns:navigation="https://instawork.com/hyperview-navigation"
 *   navigation:navigator="some-navigator-id"
 * >
 *   ...
 * </navigation:tabbar>
 */
export const TabBar = (props: HvComponentProps) => {
  const ctx = useContext(TabBarContext);
  const navigator = props.element.getAttributeNS(namespaceURI, 'navigator');
  useEffect(() => {
    if (!navigator) {
      console.warn(
        'Element missing `navigator` attribute:',
        new XMLSerializer().serializeToString(props.element),
      );
      return;
    }
    ctx.setElementProps?.(navigator, props);
  }, [navigator]);
  return null;
};

TabBar.namespaceURI = namespaceURI;
TabBar.localName = 'tabbar' as LocalName;
TabBar.localNameAliases = [] as LocalName[];
