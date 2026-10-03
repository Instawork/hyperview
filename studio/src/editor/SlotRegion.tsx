import { Element, useNode } from '@craftjs/core';
import { HvView } from '../components/HvView';

interface SlotRegionProps {
  slotId: string;
  label: string;
  direction?: 'row' | 'column';
  minHeight?: number;
  optional?: boolean;
}

export function SlotRegion({ slotId, label, direction = 'column', minHeight = 32 }: SlotRegionProps) {
  return (
    <Element id={slotId} is={HvView} canvas flexDirection={direction} padding={0} margin={0} borderRadius={0}>
      <SlotPlaceholder label={label} minHeight={minHeight} />
    </Element>
  );
}

function SlotPlaceholder({ label, minHeight }: { label: string; minHeight: number }) {
  const { connectors: { connect } } = useNode();
  return (
    <div
      ref={(ref) => { if (ref) connect(ref); }}
      className="flex items-center justify-center text-[10px] text-gray-500 italic border border-dashed border-gray-600/40 rounded"
      style={{ minHeight }}
    >
      {label}
    </div>
  );
}

SlotPlaceholder.craft = {
  displayName: 'Placeholder',
  rules: { canDrag: () => false },
};
