import { useNode } from '@craftjs/core';
import type { ReactNode } from 'react';

interface Props {
  action?: string;
  href?: string;
  color?: string;
  shadow?: boolean;
  dismissible?: string;
  loadEvent?: string;
  pressEvent?: string;
  pressedEvent?: string;
  hvId?: string;
  children?: ReactNode;
}

export function MdsCard({ children, shadow = false, color, dismissible, hvId }: Props) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`relative rounded-xl border border-gray-600 p-4 my-1 cursor-move ${shadow ? 'shadow-lg shadow-black/30' : ''}`}
      style={{ backgroundColor: color || 'rgba(255,255,255,0.05)' }}
    >
      {dismissible && (
        <div className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-300 cursor-pointer rounded-full bg-gray-700/50">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </div>
      )}
      {children || <div className="text-xs text-gray-400 italic">Drop content here</div>}
    </div>
  );
}

MdsCard.craft = {
  displayName: 'MDS Card',
  rules: { canDrop: () => true },
};
