import { useNode } from '@craftjs/core';

interface Props {
  children?: React.ReactNode;
}

export function HvBody({ children }: Props) {
  const { connectors: { connect } } = useNode();
  return (
    <div
      ref={(ref) => { if (ref) connect(ref); }}
      className="min-h-[300px] p-1"
    >
      {children}
    </div>
  );
}

HvBody.craft = {
  displayName: 'Body',
  rules: {
    canDrag: () => false,
    canMoveIn: (incoming: { data: { type: string } }[]) => {
      const blocked = ['HvDoc', 'HvScreen', 'HvBody', 'HvHeader'];
      return incoming.every((n) => !blocked.includes(n.data.type));
    },
  },
};
