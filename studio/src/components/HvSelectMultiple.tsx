import { useNode } from '@craftjs/core';
import type { ReactNode } from 'react';

interface HvSelectMultipleProps {
  name?: string;
  hvId?: string;
  hvStyle?: string;
  children?: ReactNode;
}

export function HvSelectMultiple({ name, children }: HvSelectMultipleProps) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className="border border-dashed border-yellow-600 rounded p-2 my-1 bg-yellow-900/10 hover:border-yellow-400 transition-colors cursor-move"
    >
      <div className="text-xs text-yellow-300 font-mono mb-1">
        select-multiple
        {name && <span className="text-gray-500 ml-2">name={name}</span>}
      </div>
      <div className="min-h-[32px] bg-gray-800/30 rounded p-1">
        {children}
      </div>
    </div>
  );
}

HvSelectMultiple.craft = {
  displayName: 'SelectMultiple',
  rules: {
    canDrop: () => true,
    canMoveIn: (nodes: any[]) => nodes.every(
      (n: any) => n.data.type === 'HvOption' || n.data.displayName === 'Option'
    ),
  },
};
