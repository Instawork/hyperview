import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  DOMString,
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import React, { useCallback, useEffect } from 'react';
import { LOCAL_NAME } from 'hyperview/src/types';
import { View } from 'react-native';
import { createProps } from 'hyperview/src/services';

const HvSelectSingle = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, stylesheets, onUpdate, options } = props;
  /**
   * Callback passed to children. Option components invoke this callback when selected.
   * SingleSelect will update the XML DOM so that only the selected option is has a
   * selected=true attribute.
   */
  const onSelect = useCallback(
    (selectedValue: DOMString | null | undefined) => {
      const newElement = element.cloneNode(true) as Element;
      const allowDeselect = element.getAttribute('allow-deselect');
      const opts = newElement.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        'option',
      );
      for (let i = 0; i < opts.length; i += 1) {
        const opt = opts.item(i);
        if (opt) {
          const value = opt.getAttribute('value');
          const current = value === selectedValue;
          if (current && allowDeselect === 'true') {
            // when deselection is allowed and user presses the option
            const selected = opt.getAttribute('selected') === 'true';
            opt.setAttribute('selected', selected ? 'false' : 'true');
          } else if (current) {
            // when deselection is not allowed and user presses the option
            opt.setAttribute('selected', 'true');
          } else {
            // untouched option
            opt.setAttribute('selected', 'false');
          }
        }
      }
      onUpdate('#', 'swap', element, { newElement });
    },
    [element, onUpdate],
  );

  useEffect(() => {
    // NOTE(adam): we need to remove the attribute before
    // selection, since selection will update the component.
    if (element.hasAttribute('value')) {
      const newValue = element.getAttribute('value');
      element.removeAttribute('value');
      onSelect(newValue);
    }
    if (element.hasAttribute('unselect-all')) {
      element.removeAttribute('unselect-all');
      onSelect(null);
    }
  }, [element, onSelect]);

  if (element.getAttribute('hide') === 'true') {
    return null;
  }
  const componentProps = createProps(element, stylesheets, {
    ...options,
  });

  // TODO: Replace with <HvChildren>
  return React.createElement(
    View,
    componentProps,
    ...Render.renderChildren(
      element,
      stylesheets,
      onUpdate as HvComponentOnUpdate,
      {
        ...options,
        onSelect,
      },
    ),
  );
};

HvSelectSingle.namespaceURI = Namespaces.HYPERVIEW;
HvSelectSingle.localName = LOCAL_NAME.SELECT_SINGLE;
HvSelectSingle.getFormInputValues = (
  element: Element,
): Array<[string, string]> => {
  const name = element.getAttribute('name');
  if (!name) {
    return [];
  }
  // Add each selected option to the form data
  const optionElements = element.getElementsByTagNameNS(
    Namespaces.HYPERVIEW,
    LOCAL_NAME.OPTION,
  );
  for (let i = 0; i < optionElements.length; i += 1) {
    const optionElement = optionElements.item(i);
    if (optionElement && optionElement.getAttribute('selected') === 'true') {
      return [[name, optionElement.getAttribute('value') || '']];
    }
  }
  return [];
};

export default HvSelectSingle;
