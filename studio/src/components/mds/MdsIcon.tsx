import { useNode } from '@craftjs/core';

interface Props {
  name?: string;
  size?: string;
  color?: string;
  hvId?: string;
}

export function MdsIcon({ name = 'star', size = '24', color }: Props) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className="inline-flex items-center justify-center cursor-move hover:ring-1 hover:ring-indigo-400 rounded"
      style={{ width: `${size}px`, height: `${size}px`, color: color || '#9ca3af' }}
      title={`icon: ${name}`}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none">{name.slice(0, 2)}</text>
      </svg>
    </div>
  );
}

MdsIcon.craft = {
  displayName: 'MDS Icon',
  rules: { canMoveIn: () => false },
};
