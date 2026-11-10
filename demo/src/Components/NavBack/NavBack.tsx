import type { HvComponentProps, RouteParams } from 'hyperview';
import type { JSX } from 'react';
import { NavigationContext } from '@react-navigation/native';
import { findElements } from '../../Helpers';
import { renderElement } from 'hyperview';
import { useContext } from 'react';

export const namespaceURI = 'https://hyperview.org/navigation';

const NavBack = (props: HvComponentProps) => {
  const ctx = useContext(NavigationContext);
  const state = ctx?.getState();
  const route = state?.routes[state.index];
  const isModalRoot =
    state?.index === 0 && (route?.params as RouteParams | undefined)?.isModal;

  // Screen is first on a non-modal stack? Don't render anything
  if (state?.index === 0 && !isModalRoot) {
    return null;
  }

  const role = isModalRoot ? 'close' : 'back';
  const [element] = findElements(namespaceURI, props.element, ['role']).filter(
    el => {
      return el.getAttributeNS(namespaceURI, 'role') === role;
    },
  );
  if (!element) {
    return null;
  }
  return (renderElement(
    element,
    props.stylesheets,
    props.onUpdate,
    props.options,
  ) as unknown) as JSX.Element;
};

NavBack.namespaceURI = namespaceURI;
NavBack.localName = 'back';

export { NavBack };
