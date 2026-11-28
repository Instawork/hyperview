import * as Namespaces from 'hyperview/src/services/namespaces';
import type { ContentProps } from './types';
import type { HvComponentProps } from 'hyperview/src/types';
import HvView from 'hyperview/src/elements/hv-view';
import { LOCAL_NAME } from 'hyperview/src/types';
import React from 'react';
import { useHeaderCallbacks } from './callbacks';
import { useHeaderCallbacksContext } from './context';
import { useHyperview } from 'hyperview/src/contexts/hyperview';

const HeaderContent = (props: ContentProps) => {
  const { navigationComponents } = useHyperview();
  const HeaderViewComponent = navigationComponents?.HeaderView;
  const content = (
    <HvView
      element={props.element}
      onUpdate={props.onUpdate}
      options={props.options}
      stylesheets={props.stylesheets}
    />
  );
  if (!HeaderViewComponent) {
    return content;
  }
  return (
    <HeaderViewComponent
      element={props.element}
      getElementById={props.callbacks.getElementById}
      isRouteLoading={props.options.isRouteLoading}
      onChangeText={props.callbacks.onChangeText}
      onPress={props.callbacks.onPress}
      onTrigger={props.callbacks.onTrigger}
      renderItem={props.callbacks.renderItem}
    >
      {content}
    </HeaderViewComponent>
  );
};

const StandaloneHeader = (props: HvComponentProps) => {
  const callbacks = useHeaderCallbacks(
    props.onUpdate,
    props.stylesheets,
    props.options,
    props.element,
  );
  return (
    <HeaderContent
      callbacks={callbacks}
      element={props.element}
      onUpdate={props.onUpdate}
      options={props.options}
      stylesheets={props.stylesheets}
    />
  );
};

const HvHeader = (props: HvComponentProps) => {
  const callbacks = useHeaderCallbacksContext();
  if (!callbacks) {
    return (
      <StandaloneHeader
        element={props.element}
        onUpdate={props.onUpdate}
        options={props.options}
        stylesheets={props.stylesheets}
      />
    );
  }
  return (
    <HeaderContent
      callbacks={callbacks}
      element={props.element}
      onUpdate={props.onUpdate}
      options={props.options}
      stylesheets={props.stylesheets}
    />
  );
};

HvHeader.namespaceURI = Namespaces.HYPERVIEW;
HvHeader.localName = LOCAL_NAME.HEADER;
HvHeader.supportsHyperRef = true;

export default HvHeader;
