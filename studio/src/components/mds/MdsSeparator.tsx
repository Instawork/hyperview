import { useNode } from '@craftjs/core';

interface Props {
  size?: string;
  variant?: string;
  marginHorizontal?: number;
  hvId?: string;
}

export function MdsSeparator({ size = 'small', variant = 'secondary', marginHorizontal = 24 }: Props) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className="cursor-move py-1"
      style={{ paddingLeft: marginHorizontal, paddingRight: marginHorizontal }}
    >
      <hr className={`border-0 ${variant === 'primary' ? 'bg-gray-500' : 'bg-gray-700'} ${size === 'large' ? 'h-[2px]' : 'h-px'}`} />
    </div>
  );
}

MdsSeparator.craft = {
  displayName: 'MDS Separator',
  rules: { canMoveIn: () => false },
};
