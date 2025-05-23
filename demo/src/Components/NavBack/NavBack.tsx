import React, { useContext } from 'react';
import type { HvComponentProps } from 'hyperview';
import Hyperview from 'hyperview';
import { NavigationContext } from '@react-navigation/native';
import { findElements } from '../../Helpers';

export const namespaceURI = 'https://hyperview.org/navigation';

const NavBack = (props: HvComponentProps) => {
  const ctx = useContext(NavigationContext);
  const state = ctx?.getState();
  const route = state?.routes[state.index];

  // Screen is first on the stack? Don't render anything
  if (state?.index === 0) {
    return null;
  }

  const role = route?.name === 'modal' ? 'close' : 'back';
  const [element] = findElements(namespaceURI, props.element, ['role']).filter(
    el => {
      return el.getAttributeNS(namespaceURI, 'role') === role;
    },
  );
  if (!element) {
    return null;
  }

  return (
    <Hyperview.HvElement
      element={element}
      onUpdate={props.onUpdate}
      options={props.options}
      stylesheets={props.stylesheets}
    />
  );
};

NavBack.namespaceURI = namespaceURI;
NavBack.localName = 'back';

export { NavBack };
