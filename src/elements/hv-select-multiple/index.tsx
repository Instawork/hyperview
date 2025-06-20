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

const HvSelectMultiple = (props: HvComponentProps) => {
  /**
   * Callback passed to children. Option components invoke this callback when toggles.
   * Will update the XML DOM to toggle the option with the given value.
   */
  const onToggle = (selectedValue?: DOMString | null) => {
    const newElement = props.element.cloneNode(true) as Element;
    const options = newElement.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'option',
    );
    for (let i = 0; i < options.length; i += 1) {
      const option = options.item(i);
      if (option) {
        const value = option.getAttribute('value');
        if (value === selectedValue) {
          const selected = option.getAttribute('selected') === 'true';
          option.setAttribute('selected', selected ? 'false' : 'true');
        }
      }
    }
    props.onUpdate('#', 'swap', props.element, { newElement });
  };

  const applyToAllOptions = useCallback(
    (selected: boolean) => {
      const newElement = props.element.cloneNode(true) as Element;
      const options = newElement.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        'option',
      );
      for (let i = 0; i < options.length; i += 1) {
        const option = options.item(i);
        if (option) {
          option.setAttribute('selected', selected ? 'true' : 'false');
        }
      }
      props.onUpdate('#', 'swap', props.element, { newElement });
    },
    [props.element, props.onUpdate],
  );

  useEffect(() => {
    // NOTE: we need to remove the attribute before
    // (un)selecting all, since (un)selecting all will update the component.
    if (props.element.hasAttribute('select-all')) {
      props.element.removeAttribute('select-all');
      applyToAllOptions(true);
    }
    if (props.element.hasAttribute('unselect-all')) {
      props.element.removeAttribute('unselect-all');
      applyToAllOptions(false);
    }
  }, [applyToAllOptions, props.element]);

  if (props.element.getAttribute('hide') === 'true') {
    return null;
  }
  const componentProps = createProps(props.element, props.stylesheets, {
    ...props.options,
  });

  // TODO: Replace with <HvChildren>
  return React.createElement(
    View,
    componentProps,
    ...Render.renderChildren(
      props.element,
      props.stylesheets,
      props.onUpdate as HvComponentOnUpdate,
      {
        ...props.options,
        onToggle,
      },
    ),
  );
};

HvSelectMultiple.namespaceURI = Namespaces.HYPERVIEW;
HvSelectMultiple.localName = LOCAL_NAME.SELECT_MULTIPLE;
HvSelectMultiple.getFormInputValues = (
  element: Element,
): Array<[string, string]> => {
  const values: Array<[string, string]> = [];
  const name = element.getAttribute('name');
  if (!name) {
    return values;
  }
  // Add each selected option to the form data
  const optionElements = element.getElementsByTagNameNS(
    Namespaces.HYPERVIEW,
    LOCAL_NAME.OPTION,
  );
  for (let i = 0; i < optionElements.length; i += 1) {
    const optionElement = optionElements.item(i);
    if (optionElement && optionElement.getAttribute('selected') === 'true') {
      values.push([name, optionElement.getAttribute('value') || '']);
    }
  }
  return values;
};

export default HvSelectMultiple;
