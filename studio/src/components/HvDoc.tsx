import { useNode } from '@craftjs/core';

interface Props {
  children?: React.ReactNode;
}

export function HvDoc({ children }: Props) {
  const { connectors: { connect } } = useNode();
  return (
    <div
      ref={(ref) => { if (ref) connect(ref); }}
      className="min-h-full"
    >
      {children}
    </div>
  );
}

HvDoc.craft = {
  displayName: 'Doc',
  rules: {
    canDrag: () => false,
    canMoveIn: (incoming: { data: { type: string } }[]) =>
      incoming.every((n) => n.data.type === 'HvScreen'),
  },
};
