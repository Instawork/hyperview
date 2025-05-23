import * as InlineContext from 'hyperview/src/services/inline-context';
import { ChildrenContextProps, ChildrenContextProviderProps } from './types';
import { LOCAL_NAME, NODE_TYPE } from 'hyperview/src/types';
import React, { createContext, useContext, useMemo } from 'react';
import HvElement from 'hyperview/src/core/components/hv-element';
import { isRenderableElement } from 'hyperview/src/core/utils';

const ChildrenContext = createContext<ChildrenContextProps>({
  childList: [],
});

/**
 * Provides a memoized list of children to render
 *
 * @param props - The props for the ChildrenContextProvider
 * @returns A list of children to render as Array<JSX.Element | null | string>
 */
export function ChildrenContextProvider(props: ChildrenContextProviderProps) {
  const nodeType = useMemo(() => {
    return props.element?.nodeType;
  }, [props.element]);

  const localName = useMemo(() => {
    return props.element.localName;
  }, [props.element]);

  const options = useMemo(() => {
    return {
      ...props.options,
      skipHref: false,
    };
  }, [props.options]);

  /**
   * Generate an inline formatting context for <text> elements
   * This is required to determine if a text node should be rendered
   * @returns {Array<Node[]> | null}
   */
  const formattingContext = useMemo(() => {
    return !options.preformatted &&
      !options.inlineFormattingContext &&
      nodeType === NODE_TYPE.ELEMENT_NODE &&
      localName === LOCAL_NAME.TEXT
      ? InlineContext.formatter(props.element)
      : options.inlineFormattingContext;
  }, [localName, nodeType, options, props.element]);

  /**
   * Generate a list of child nodes to render
   * Filter out nodes that should not be rendered
   * @returns {Array<JSX.Element | null | string>}
   */
  const nodes = useMemo(() => {
    // Optionally pass in a list of child nodes to render
    if (props.childNodes) {
      return Array.from(props.childNodes).filter(node =>
        isRenderableElement(node as Element, options, formattingContext),
      );
    }
    // Otherwise, use the child nodes from the element
    if (props.element?.childNodes) {
      return Array.from(props.element?.childNodes).filter(node =>
        isRenderableElement(node as Element, options, formattingContext),
      );
    }
    return [];
  }, [formattingContext, options, props.childNodes, props.element?.childNodes]);

  const childList = useMemo(() => {
    const list: Array<JSX.Element | null | string> = [];
    for (let i = 0; i < nodes.length; i += 1) {
      const e = (
        <HvElement
          element={nodes[i] as Element}
          onUpdate={props.onUpdate}
          options={options}
          stylesheets={props.stylesheets}
        />
      );

      if (e) {
        list.push(e);
      }
    }

    return list;
  }, [nodes, options, props.onUpdate, props.stylesheets]);

  return (
    <ChildrenContext.Provider value={{ childList }}>
      {props.children}
    </ChildrenContext.Provider>
  );
}

export const useChildrenContext = () => {
  const context = useContext(ChildrenContext);
  if (!context) {
    throw new Error(
      'useChildrenContext must be used within a ChildrenContextProvider',
    );
  }
  return context;
};

export type { ChildrenContextProps };
