import { useEditor } from '@craftjs/core';
import { LayoutGrid } from 'lucide-react';

interface SlotIndicatorProps {
  nodeId: string;
  slots: { id: string; label: string }[];
}

export function SlotIndicator({ nodeId, slots }: SlotIndicatorProps) {
  const { actions, linkedNodes } = useEditor((state) => {
    const node = state.nodes[nodeId];
    return { linkedNodes: node?.data.linkedNodes || {} };
  });

  if (slots.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
        <LayoutGrid size={12} />
        Slots
      </div>
      {slots.map((slot) => {
        const linkedId = linkedNodes[slot.id];
        const hasContent = !!linkedId;
        return (
          <button
            key={slot.id}
            onClick={() => { if (linkedId) actions.selectNode(linkedId); }}
            className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors text-left ${
              hasContent
                ? 'bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${hasContent ? 'bg-[var(--accent)]' : 'bg-gray-600'}`} />
            <span className="font-mono">{slot.label}</span>
            <span className="ml-auto text-[10px] opacity-60">
              {hasContent ? 'click to edit' : 'empty'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
