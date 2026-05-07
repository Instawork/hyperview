import { useNode } from '@craftjs/core';
import type { ReactNode } from 'react';

interface Props {
  bannerType?: string;
  title?: string;
  subtitle?: string;
  iconName?: string;
  iconSize?: string;
  iconColor?: string;
  hvId?: string;
  children?: ReactNode;
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  PRIMARY: { bg: 'bg-indigo-900/40', text: 'text-indigo-300' },
  SUCCESS: { bg: 'bg-green-900/40', text: 'text-green-300' },
  WARNING: { bg: 'bg-yellow-900/40', text: 'text-yellow-300' },
  DANGER: { bg: 'bg-red-900/40', text: 'text-red-300' },
};

export function MdsBanner({ bannerType = 'PRIMARY', title = 'Banner Title', subtitle, iconName, children }: Props) {
  const { connectors: { connect, drag } } = useNode();
  const colors = TYPE_COLORS[bannerType] || TYPE_COLORS.PRIMARY;

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`flex items-center gap-3 px-4 py-3 ${colors.bg} rounded-lg my-1 cursor-move`}
    >
      {iconName && (
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <span className="text-[10px] text-gray-300">{iconName.slice(0, 3)}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-semibold ${colors.text}`}>{title}</div>
        {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
        {children}
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
    </div>
  );
}

MdsBanner.craft = {
  displayName: 'MDS Banner',
  rules: { canDrop: () => true },
};
