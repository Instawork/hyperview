import type { HvComponentProps } from 'hyperview/src/types';
import HvElement from 'hyperview/src/core/components/hv-element';
import React from 'react';

/**
 * Returns the children of an element as an array of HvElement components
 * @param {HvComponentProps} props - The props of the component
 * @returns {Array<JSX.Element | null | string>} - The array of children
 */
export default (
  props: HvComponentProps,
): Array<JSX.Element | null | string> => {
  if (!props.element?.childNodes) {
    return [];
  }

  return Array.from(props.element.childNodes).map(node => (
    <HvElement
      element={node as Element}
      onUpdate={props.onUpdate}
      options={props.options}
      stylesheets={props.stylesheets}
    />
  ));
};
