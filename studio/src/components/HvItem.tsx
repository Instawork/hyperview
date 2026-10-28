import { useNode } from '@craftjs/core';

interface Props {
  children?: React.ReactNode;
  hvKey?: string;
  hvId?: string;
  hvStyle?: string;
}

export function HvItem({ children }: Props) {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`min-h-[40px] border-b border-gray-100 p-2 ${selected ? 'ring-2 ring-[var(--accent)]' : ''}`}
    >
      {children || (
        <span className="text-gray-400 text-xs italic">Item</span>
      )}
    </div>
  );
}

HvItem.craft = {
  displayName: 'Item',
  props: { hvKey: '', hvId: '', hvStyle: '' },
  rules: {
    canMoveIn: (incoming: { data: { type: string } }[]) => {
      const blocked = ['HvDoc', 'HvScreen', 'HvBody', 'HvHeader', 'HvList', 'HvItem'];
      return incoming.every((n) => !blocked.includes(n.data.type));
    },
  },
};
