import { useNode } from '@craftjs/core';

interface Props {
  name?: string;
  placeholder?: string;
  keyboardType?: string;
  hvId?: string;
  hvStyle?: string;
}

export function HvTextField({
  placeholder = 'Enter text...',
}: Props) {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`${selected ? 'ring-2 ring-[var(--accent)]' : ''}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        disabled
        className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-600 text-sm"
      />
    </div>
  );
}

HvTextField.craft = {
  displayName: 'Text Field',
  props: {
    name: '',
    placeholder: 'Enter text...',
    keyboardType: 'default',
    hvId: '',
    hvStyle: '',
  },
  rules: {
    canMoveIn: () => false,
  },
};
