import * as Render from 'hyperview/src/services/render';
import type { HvComponentProps } from 'hyperview/src/types';

/**
 * Returns the children of an element as an array of HvElement components
 * @param {HvComponentProps} props - The props of the component
 * @returns {Array<JSX.Element | null | string>} - The array of children
 */
export default (
  props: HvComponentProps,
): Array<JSX.Element | null | string> => {
  return Render.buildChildArray(
    props.element,
    props.onUpdate,
    props.options,
    props.stylesheets,
  );
};
