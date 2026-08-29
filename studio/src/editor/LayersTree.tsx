import { useEditor } from '@craftjs/core';
import { ChevronRight, ChevronDown, Layers } from 'lucide-react';
import { useState, useCallback } from 'react';

interface TreeNodeProps {
  nodeId: string;
  depth: number;
}

function TreeNode({ nodeId, depth }: TreeNodeProps) {
  const { node, selectedId, actions } = useEditor((state, query) => {
    const n = state.nodes[nodeId];
    return {
      node: n
        ? {
            displayName: n.data.displayName || (typeof n.data.type === 'string' ? n.data.type : 'Unknown'),
            childNodes: n.data.nodes || [],
            linkedNodes: n.data.linkedNodes ? Object.values(n.data.linkedNodes) : [],
          }
        : null,
      selectedId: state.events.selected,
    };
  });

  const [expanded, setExpanded] = useState(true);

  const handleSelect = useCallback(() => {
    actions.selectNode(nodeId);
  }, [actions, nodeId]);

  if (!node) return null;

  const allChildren = [...node.childNodes, ...node.linkedNodes];
  const hasChildren = allChildren.length > 0;
  const isSelected = selectedId?.has(nodeId);

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer text-sm rounded transition-colors
          ${isSelected ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'}`}
        style={{ paddingLeft: depth * 16 + 8 }}
        onClick={handleSelect}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="p-0.5"
          >
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <span className="truncate">{node.displayName}</span>
      </div>
      {expanded && hasChildren && (
        <div>
          {allChildren.map((childId) => (
            <TreeNode key={childId} nodeId={childId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function LayersTree() {
  return (
    <div className="flex flex-col gap-1 p-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] px-3 py-2 flex items-center gap-2">
        <Layers size={14} />
        Layers
      </div>
      <TreeNode nodeId="ROOT" depth={0} />
    </div>
  );
}
