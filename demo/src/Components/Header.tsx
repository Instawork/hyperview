import { useContext, useEffect } from 'react';
import type { HvComponentProps, LocalName } from 'hyperview';
import { HeaderContext } from '../Contexts';
import { XMLSerializer } from '@instawork/xmldom';

const namespaceURI = 'https://instawork.com/hyperview-navigation';

/**
 * This component's only job is to associate its own props with a
 * navigator ID in HeaderContext. It does not render anything.
 * It's child elements are used by the Core/Header component
 * to build the header UI.
 *
 * Usage:
 * <navigation:header
 *   xmlns:navigation="https://instawork.com/hyperview-navigation"
 *   navigation:navigator="some-navigator-id"
 *   navigation:route="some-route-id"  ## TODO: need to figure out a way to pass route id from Hyperview
 * >
 *   ...
 * </navigation:header>
 */
export const Header = (props: HvComponentProps) => {
  const ctx = useContext(HeaderContext);
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

Header.namespaceURI = namespaceURI;
Header.localName = 'header' as LocalName;
Header.localNameAliases = [] as LocalName[];
