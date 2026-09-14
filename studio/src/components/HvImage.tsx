import { useNode } from '@craftjs/core';
import { ImageIcon } from 'lucide-react';

interface Props {
  source?: string;
  width?: number;
  height?: number;
  hvId?: string;
  hvStyle?: string;
}

export function HvImage({
  source,
  width = 200,
  height = 150,
}: Props) {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`flex items-center justify-center bg-gray-100 overflow-hidden ${selected ? 'ring-2 ring-[var(--accent)]' : ''}`}
      style={{ width, height }}
    >
      {source ? (
        <img src={source} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <ImageIcon size={24} />
          <span className="text-xs">Image</span>
        </div>
      )}
    </div>
  );
}

HvImage.craft = {
  displayName: 'Image',
  props: {
    source: '',
    width: 200,
    height: 150,
    hvId: '',
    hvStyle: '',
  },
  rules: {
    canMoveIn: () => false,
  },
};
