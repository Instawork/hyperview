import { useNode } from '@craftjs/core';
import { Loader2 } from 'lucide-react';

interface Props {
  hvId?: string;
  hvStyle?: string;
}

export function HvSpinner(_props: Props) {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`flex items-center justify-center p-4 ${selected ? 'ring-2 ring-[var(--accent)]' : ''}`}
    >
      <Loader2 size={24} className="animate-spin text-gray-400" />
    </div>
  );
}

HvSpinner.craft = {
  displayName: 'Spinner',
  props: { hvId: '', hvStyle: '' },
  rules: {
    canMoveIn: () => false,
  },
};
