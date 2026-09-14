import { useNode } from '@craftjs/core';
import type { ReactNode } from 'react';

interface Props {
  sticky?: boolean;
  hvId?: string;
  children?: ReactNode;
}

export function MdsFooter({ children, sticky = true }: Props) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-4 py-3 border-t border-gray-700 bg-gray-800/80 cursor-move ${sticky ? 'mt-auto' : ''}`}
    >
      <div className="text-[10px] text-gray-500 mb-1 font-mono">mds:footer</div>
      {children || <div className="text-xs text-gray-400 italic">Footer content</div>}
    </div>
  );
}

MdsFooter.craft = {
  displayName: 'MDS Footer',
  rules: { canDrop: () => true },
};
