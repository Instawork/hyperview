import { useEditor } from '@craftjs/core';
import { useEffect } from 'react';

export function useKeyboardShortcuts() {
  const { actions, query } = useEditor();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable) {
        return;
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.metaKey && !e.ctrlKey) {
        const selected = query.getEvent('selected').first();
        if (selected) {
          const node = query.node(selected).get();
          if (node && node.data.type !== 'HvDoc' && node.data.type !== 'HvScreen' && node.data.type !== 'HvBody') {
            e.preventDefault();
            actions.delete(selected);
          }
        }
      }

      if (e.key === 'z' && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        if (query.history.canUndo()) actions.history.undo();
      }

      if ((e.key === 'z' && (e.metaKey || e.ctrlKey) && e.shiftKey) ||
          (e.key === 'y' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        if (query.history.canRedo()) actions.history.redo();
      }

      if (e.key === 'Escape') {
        actions.clearEvents();
      }

      if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
        const selected = query.getEvent('selected').first();
        if (selected) {
          e.preventDefault();
          const { data } = query.node(selected).get();
          if (data.type !== 'HvDoc' && data.type !== 'HvScreen' && data.type !== 'HvBody') {
            const parent = data.parent;
            if (parent) {
              const freshNode = query.parseFreshNode({
                data: {
                  type: data.type,
                  props: { ...data.props },
                  isCanvas: data.isCanvas,
                },
              }).toNode();
              actions.addNodeTree(
                { rootNodeId: freshNode.id, nodes: { [freshNode.id]: freshNode } },
                parent
              );
            }
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions, query]);
}
