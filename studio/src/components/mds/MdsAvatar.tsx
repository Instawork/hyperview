import { useNode } from '@craftjs/core';

interface Props {
  source?: string;
  size?: string;
  type?: string;
  hasBorder?: boolean;
  counter?: number;
  right?: number;
  hvId?: string;
}

export function MdsAvatar({ source, size = '48', type = 'person', hasBorder = false, counter, right = 0 }: Props) {
  const { connectors: { connect, drag } } = useNode();
  const px = Number(size) || 48;

  if (counter !== undefined && counter !== null) {
    return (
      <div
        ref={(ref) => { if (ref) connect(drag(ref)); }}
        className={`rounded-full bg-indigo-600 flex items-center justify-center cursor-move shrink-0 text-white font-semibold ${hasBorder ? 'ring-2 ring-white/30' : ''}`}
        style={{ width: px, height: px, minWidth: px, marginRight: right, fontSize: px * 0.35 }}
      >
        {counter}
      </div>
    );
  }

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`rounded-full bg-gray-700 flex items-center justify-center cursor-move shrink-0 overflow-hidden ${hasBorder ? 'ring-2 ring-white/30' : ''}`}
      style={{ width: px, height: px, marginRight: right }}
    >
      {source ? (
        <div className="text-[8px] text-gray-400 truncate px-1">{source.split('/').pop()}</div>
      ) : (
        <svg width={px * 0.5} height={px * 0.5} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
          {type === 'person'
            ? <><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></>
            : <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/></>
          }
        </svg>
      )}
    </div>
  );
}

MdsAvatar.craft = {
  displayName: 'MDS Avatar',
  rules: { canMoveIn: () => false },
};
