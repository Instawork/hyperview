import { useNode } from '@craftjs/core';
import type { ReactNode } from 'react';

interface Props {
  hvId?: string;
  children?: ReactNode;
}

export function MdsCarouselItem({ children }: Props) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className="flex-shrink-0 w-[280px] border border-gray-700/50 rounded-lg bg-gray-800/30 cursor-move min-h-[40px] p-2"
    >
      {children || <div className="text-[9px] text-gray-600 italic text-center py-2">Slide content</div>}
    </div>
  );
}

MdsCarouselItem.craft = {
  displayName: 'MDS CarouselItem',
  rules: { canDrop: () => true },
};
