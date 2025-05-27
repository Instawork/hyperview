import type { HvComponentProps } from 'hyperview/src/types';
import HvElement from 'hyperview/src/core/components/hv-element';
import React from 'react';

/**
 * Renders the children of an element as HvElement components
 * @param {HvComponentProps} props - The props of the component
 * @returns {JSX.Element | null | string} - The rendered children
 */
export default (props: HvComponentProps): JSX.Element | null | string => {
  if (!props.element?.childNodes) {
    return null;
  }

  const children = Array.from(props.element.childNodes).map(node => (
    <HvElement
      element={node as Element}
      onUpdate={props.onUpdate}
      options={props.options}
      stylesheets={props.stylesheets}
    />
  ));

  return <>{children}</>;
};
