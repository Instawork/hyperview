import { useNode } from '@craftjs/core';

interface Props {
  children?: React.ReactNode;
  hvId?: string;
  hvStyle?: string;
}

export function HvForm({ children }: Props) {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`min-h-[60px] p-2 border border-dashed border-gray-300 rounded ${selected ? 'ring-2 ring-[var(--accent)]' : ''}`}
    >
      {children || (
        <span className="text-gray-400 text-xs italic">Form (drop fields here)</span>
      )}
    </div>
  );
}

HvForm.craft = {
  displayName: 'Form',
  props: { hvId: '', hvStyle: '' },
  rules: {
    canMoveIn: (incoming: { data: { type: string } }[]) => {
      const blocked = ['HvDoc', 'HvScreen', 'HvBody', 'HvHeader', 'HvForm'];
      return incoming.every((n) => !blocked.includes(n.data.type));
    },
  },
};
