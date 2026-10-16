import * as Namespaces from 'hyperview/src/services/namespaces';
// eslint-disable-next-line instawork/import-components
import * as Scroll from 'hyperview/src/components/scroll';
import React, { useEffect } from 'react';
import type { ElementErrorComponentProps } from 'hyperview/src/types';
import HvElement from 'hyperview/src/components/hv-element';
import { HvScreenRenderError } from './errors';
import LoadElementError from 'hyperview/src/components/load-element-error';
import type { Props } from './types';

const HvScreen = (props: Props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const {
    componentRegistry,
    elementErrorComponent,
    getScreenState,
    onUpdate,
    onUpdateCallbacks,
    reload,
    setScreenState,
  } = props;

  useEffect(() => {
    // This legacy behavior is required to ensure the document state is updated
    // after the initial load behaviors are applied.
    // See: https://github.com/Instawork/hyperview/pull/1238
    // TODO: remove this once we remove HvDoc localDoc
    setScreenState({});
  }, [setScreenState]);

  /**
   * Renders the XML doc into React components. Shows blank screen until the XML doc is available.
   */
  const { doc, styles, elementError, url, staleHeaderType } = getScreenState();
  const ErrorComponent: React.ComponentType<ElementErrorComponentProps> | null = elementError
    ? elementErrorComponent || LoadElementError
    : null;

  if (!doc) {
    throw new HvScreenRenderError('The document is not available.');
  }

  const [body] = Array.from(
    doc.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'body'),
  );

  let screenElement: React.ReactElement | undefined;

  if (body) {
    screenElement = (
      <HvElement
        element={body}
        onUpdate={onUpdate}
        options={{
          componentRegistry,
          onUpdateCallbacks,
          screenUrl: url || undefined,
          staleHeaderType: staleHeaderType || undefined,
        }}
        stylesheets={
          styles || {
            focused: {},
            pressed: {},
            pressedSelected: {},
            regular: {},
            selected: {},
          }
        }
      />
    );
  }

  if (!screenElement) {
    throw new HvScreenRenderError('The document has no content.');
  }

  return (
    <>
      {ErrorComponent && elementError ? (
        <ErrorComponent
          error={elementError}
          onPressClose={() => setScreenState({ elementError: null })}
          onPressReload={() => reload()}
        />
      ) : null}
      <Scroll.Provider>{screenElement}</Scroll.Provider>
    </>
  );
};

export default HvScreen;
