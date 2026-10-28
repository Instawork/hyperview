import { useNode } from '@craftjs/core';

interface Props {
  children?: React.ReactNode;
  hvId?: string;
  hvStyle?: string;
}

export function HvList({ children }: Props) {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`min-h-[60px] ${selected ? 'ring-2 ring-[var(--accent)]' : ''}`}
    >
      {children || (
        <span className="text-gray-400 text-xs italic p-4 block">List (drop items here)</span>
      )}
    </div>
  );
}

HvList.craft = {
  displayName: 'List',
  props: { hvId: '', hvStyle: '' },
  rules: {
    canMoveIn: (incoming: { data: { type: string } }[]) =>
      incoming.every((n) => n.data.type === 'HvItem'),
  },
};
