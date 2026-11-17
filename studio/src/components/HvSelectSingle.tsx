import { useNode } from '@craftjs/core';

interface Props {
  name?: string;
  children?: React.ReactNode;
  hvId?: string;
  hvStyle?: string;
}

export function HvSelectSingle({ children }: Props) {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`min-h-[40px] border border-gray-300 rounded p-2 ${selected ? 'ring-2 ring-[var(--accent)]' : ''}`}
    >
      {children || (
        <span className="text-gray-400 text-xs italic">Select (drop options here)</span>
      )}
    </div>
  );
}

HvSelectSingle.craft = {
  displayName: 'Select Single',
  props: { name: '', hvId: '', hvStyle: '' },
  rules: {
    canMoveIn: (incoming: { data: { type: string } }[]) =>
      incoming.every((n) => n.data.type === 'HvOption'),
  },
};
