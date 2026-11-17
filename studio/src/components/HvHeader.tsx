import { useNode } from '@craftjs/core';

interface Props {
  children?: React.ReactNode;
}

export function HvHeader({ children }: Props) {
  const { connectors: { connect } } = useNode();
  return (
    <div
      ref={(ref) => { if (ref) connect(ref); }}
      className="min-h-[44px] bg-gray-100 border-b border-gray-200 flex items-center px-4"
    >
      {children || <span className="text-gray-400 text-sm italic">Header</span>}
    </div>
  );
}

HvHeader.craft = {
  displayName: 'Header',
  rules: {
    canMoveIn: (incoming: { data: { type: string } }[]) => {
      const blocked = ['HvDoc', 'HvScreen', 'HvBody', 'HvHeader'];
      return incoming.every((n) => !blocked.includes(n.data.type));
    },
  },
};
