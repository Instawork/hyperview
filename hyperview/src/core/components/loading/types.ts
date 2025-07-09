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
  cachedId?: number | null;
  preloadScreenComponent?:
    | string
    | React.ReactElement<
        unknown,
        string | React.JSXElementConstructor<unknown>
      >;
  routeElement?: () => Element | undefined;
};
