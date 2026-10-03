import { useNode } from '@craftjs/core';

interface Props {
  value?: string;
  label?: string;
  hvId?: string;
  hvStyle?: string;
}

export function HvOption({
  label = 'Option',
  value = '',
}: Props) {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 ${selected ? 'ring-2 ring-[var(--accent)]' : ''}`}
    >
      {label || value || 'Option'}
    </div>
  );
}

HvOption.craft = {
  displayName: 'Option',
  props: { value: '', label: 'Option', hvId: '', hvStyle: '' },
  rules: {
    canMoveIn: () => false,
  },
};
