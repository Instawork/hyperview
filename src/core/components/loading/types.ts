/**
 * Props for the externally provided loading screen
 */
export type Props = {
  element?: Element;
};

/**
 * Props for the loading component
 */
export type LoadingProps = {
  behaviorElementId?: number;
  preloadScreen?: number;
  preloadScreenComponent?:
    | string
    | React.ReactElement<
        unknown,
        string | React.JSXElementConstructor<unknown>
      >;
  routeElement?: () => Element | undefined;
};
