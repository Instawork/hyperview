import { useNode } from '@craftjs/core';

interface Props {
  text?: string;
  iconName?: string;
  hvId?: string;
}

export function MdsPill({ text = 'Label', iconName }: Props) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <span
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium cursor-move"
    >
      {iconName && <span className="text-[10px]">{iconName.slice(0, 2)}</span>}
      {text}
    </span>
  );
}

MdsPill.craft = {
  displayName: 'MDS Pill',
  rules: { canMoveIn: () => false },
};
