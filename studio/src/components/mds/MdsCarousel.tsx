import { useNode } from '@craftjs/core';
import type { ReactNode } from 'react';

interface Props {
  autoHeight?: boolean;
  autoplay?: boolean;
  height?: number;
  pagination?: string;
  peekItems?: boolean;
  nextEventName?: string;
  prevEventName?: string;
  onActiveEventPrefix?: string;
  hvId?: string;
  children?: ReactNode;
}

export function MdsCarousel({ height, pagination, autoplay = false, children }: Props) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className="border border-dashed border-cyan-500/50 rounded-lg my-1 cursor-move bg-cyan-900/10 overflow-hidden"
      style={height ? { height } : undefined}
    >
      <div className="text-[10px] text-cyan-400 font-mono px-2 pt-1 flex items-center gap-1">
        ui:carousel
        {autoplay && <span className="text-cyan-600 ml-1">(autoplay)</span>}
      </div>
      <div className="flex items-stretch overflow-x-auto p-2 gap-2 min-h-[60px]">
        {children || (
          <div className="text-xs text-gray-500 italic flex items-center px-4">
            Drop carousel items here
          </div>
        )}
      </div>
      {pagination !== 'hide' && (
        <div className="flex justify-center gap-1 pb-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <div className="w-2 h-2 rounded-full bg-gray-600" />
          <div className="w-2 h-2 rounded-full bg-gray-600" />
        </div>
      )}
    </div>
  );
}

MdsCarousel.craft = {
  displayName: 'MDS Carousel',
  rules: { canDrop: () => true },
};
