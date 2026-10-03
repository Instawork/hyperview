import { useNode } from '@craftjs/core';
import type { ReactNode } from 'react';

interface Props {
  illustrationName?: string;
  hvId?: string;
  children?: ReactNode;
}

export function MdsEmptyStatus({ illustrationName, children }: Props) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className="flex flex-col items-center justify-center py-12 px-6 cursor-move"
    >
      <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-4">
        {illustrationName ? (
          <span className="text-xs text-gray-500 font-mono">{illustrationName}</span>
        ) : (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>
          </svg>
        )}
      </div>
      <div className="text-sm text-gray-400 text-center">
        {children || 'Nothing to show'}
      </div>
    </div>
  );
}

MdsEmptyStatus.craft = {
  displayName: 'MDS EmptyStatus',
  rules: { canDrop: () => true },
};
