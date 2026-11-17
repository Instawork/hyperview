import { useNode } from '@craftjs/core';

interface Props {
  name?: string;
  value?: boolean;
  hvId?: string;
  hvStyle?: string;
}

export function HvSwitch({ value = false }: Props) {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`inline-flex items-center ${selected ? 'ring-2 ring-[var(--accent)]' : ''}`}
    >
      <div
        className={`w-10 h-6 rounded-full relative transition-colors ${value ? 'bg-indigo-500' : 'bg-gray-300'}`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </div>
    </div>
  );
}

HvSwitch.craft = {
  displayName: 'Switch',
  props: { name: '', value: false, hvId: '', hvStyle: '' },
  rules: {
    canMoveIn: () => false,
  },
};
