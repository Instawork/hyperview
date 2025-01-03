import type { HvComponentProps, LocalName } from 'hyperview';
import Hyperview from 'hyperview';
import { namespace } from './types';

const BottomSheetStopPoint = (props: HvComponentProps) => {
  const children = Hyperview.renderChildren(
    props.element,
    props.stylesheets,
    props.onUpdate,
    props.options,
  );
  return { children };
};

BottomSheetStopPoint.namespaceURI = namespace;
BottomSheetStopPoint.localName = 'stop-point' as LocalName;
BottomSheetStopPoint.localNameAliases = [] as LocalName[];

export { BottomSheetStopPoint };
