import { useNode } from '@craftjs/core';

interface HvDateFieldProps {
  name?: string;
  label?: string;
  hvId?: string;
  hvStyle?: string;
}

export function HvDateField({ name, label, hvId, hvStyle }: HvDateFieldProps) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className="border border-dashed border-gray-500 rounded px-3 py-2 my-1 bg-gray-800/30 hover:border-blue-400 transition-colors cursor-move"
    >
      <div className="flex items-center gap-2 text-xs">
        <span className="text-purple-300 font-mono shrink-0">date-field</span>
        {label && <span className="text-gray-400 truncate">{label}</span>}
        {name && <span className="text-gray-500 ml-auto truncate">name={name}</span>}
      </div>
      <input
        type="date"
        disabled
        className="mt-1 w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-gray-300 cursor-not-allowed"
      />
    </div>
  );
}

HvDateField.craft = {
  displayName: 'DateField',
  rules: {
    canDrop: () => true,
    canMoveIn: () => false,
  },
};
