import { useNode } from '@craftjs/core';
import type { ReactNode } from 'react';

interface Props {
  iconName?: string;
  iconColor?: string;
  iconEmphasizeColor?: string;
  backgroundColor?: string;
  textAlign?: string;
  size?: string;
  numberOfLines?: number;
  hvId?: string;
  children?: ReactNode;
}

export function MdsCallout({
  iconName, iconColor, backgroundColor, textAlign = 'left',
  size = 'small', children,
}: Props) {
  const { connectors: { connect, drag } } = useNode();
  const isLarge = size === 'large';

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`flex items-start gap-2 rounded-lg my-1 cursor-move ${isLarge ? 'p-4' : 'p-3'}`}
      style={{ backgroundColor: backgroundColor || 'rgba(99,102,241,0.1)', textAlign: textAlign as any }}
    >
      {iconName && iconColor && (
        <div
          className={`${isLarge ? 'w-8 h-8' : 'w-5 h-5'} rounded-full flex items-center justify-center shrink-0 text-[10px]`}
          style={{ color: iconColor, backgroundColor: `${iconColor}20` }}
        >
          {iconName.slice(0, 2)}
        </div>
      )}
      <div className="text-xs text-gray-300 flex-1 min-w-0">
        {children || 'Callout text'}
      </div>
    </div>
  );
}

MdsCallout.craft = {
  displayName: 'MDS Callout',
  rules: { canDrop: () => true },
};
