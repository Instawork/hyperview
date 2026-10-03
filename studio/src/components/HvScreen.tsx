import { useNode } from '@craftjs/core';

interface Props {
  children?: React.ReactNode;
}

export function HvScreen({ children }: Props) {
  const { connectors: { connect } } = useNode();
  return (
    <div
      ref={(ref) => { if (ref) connect(ref); }}
      className="min-h-[400px] border border-[var(--border-color)] rounded-lg overflow-hidden bg-white"
      style={{ maxWidth: 390, margin: '0 auto' }}
    >
      {children}
    </div>
  );
}

HvScreen.craft = {
  displayName: 'Screen',
  rules: {
    canDrag: () => false,
    canMoveIn: (incoming: { data: { type: string } }[]) =>
      incoming.every((n) => ['HvBody', 'HvHeader'].includes(n.data.type)),
  },
};
