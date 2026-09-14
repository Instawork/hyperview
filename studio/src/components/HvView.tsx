import { useNode } from '@craftjs/core';

interface Props {
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  padding?: number;
  margin?: number;
  backgroundColor?: string;
  borderRadius?: number;
  hvId?: string;
  hvStyle?: string;
  children?: React.ReactNode;
}

export function HvView({
  flexDirection = 'column',
  alignItems,
  justifyContent,
  padding = 8,
  margin = 0,
  backgroundColor,
  borderRadius = 0,
  children,
}: Props) {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`min-h-[40px] transition-all ${selected ? 'ring-2 ring-[var(--accent)]' : ''}`}
      style={{
        display: 'flex',
        flexDirection: flexDirection as React.CSSProperties['flexDirection'],
        alignItems,
        justifyContent,
        padding,
        margin,
        backgroundColor: backgroundColor || undefined,
        borderRadius,
      }}
    >
      {children || (
        <span className="text-gray-400 text-xs italic self-center">View</span>
      )}
    </div>
  );
}

HvView.craft = {
  displayName: 'View',
  props: {
    flexDirection: 'column',
    padding: 8,
    margin: 0,
    borderRadius: 0,
    hvId: '',
    hvStyle: '',
  },
  rules: {
    canMoveIn: (incoming: { data: { type: string } }[]) => {
      const blocked = ['HvDoc', 'HvScreen', 'HvBody', 'HvHeader'];
      return incoming.every((n) => !blocked.includes(n.data.type));
    },
  },
};
