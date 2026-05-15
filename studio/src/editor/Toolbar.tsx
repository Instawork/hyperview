import { useEditor } from '@craftjs/core';
import { Undo2, Redo2, Download, Upload, Monitor } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { serializeToHxml } from '../serialization/serialize';
import { useStyleStore } from '../stores/styles';
import { useBehaviorStore } from '../stores/behaviors';

export function Toolbar() {
  const { actions, query, canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const { styles } = useStyleStore();
  const { getAllBehaviors } = useBehaviorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(() => {
    const json = query.serialize();
    const nodes = JSON.parse(json);
    const nodeMap: Record<string, { data: any }> = {};
    for (const [id, data] of Object.entries(nodes)) {
      nodeMap[id] = { data };
    }
    const hxml = serializeToHxml(nodeMap, styles, getAllBehaviors());

    const blob = new Blob([hxml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screen.xml';
    a.click();
    URL.revokeObjectURL(url);
  }, [query, styles, getAllBehaviors]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const { deserializeHxml } = await import('../serialization/deserialize');
      const result = deserializeHxml(text);
      actions.deserialize(result.nodes);
      // Dispatch custom event to load styles and behaviors
      window.dispatchEvent(new CustomEvent('hv-import', { detail: result }));
    } catch (err) {
      console.error('[HV Studio] Import error:', err);
      alert(`Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    e.target.value = '';
  }, [actions]);

  return (
    <div className="flex items-center justify-between h-[var(--toolbar-height)] px-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <div className="flex items-center gap-1">
        <button
          onClick={() => canUndo && actions.history.undo()}
          disabled={!canUndo}
          className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Undo"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={() => canRedo && actions.history.redo()}
          disabled={!canRedo}
          className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Redo"
        >
          <Redo2 size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <Monitor size={14} />
          <span>Preview: /preview/screen.xml</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xml,.hxml"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={handleImport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[var(--border-color)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition-colors"
        >
          <Upload size={14} />
          Import
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
        >
          <Download size={14} />
          Export HXML
        </button>
      </div>
    </div>
  );
}
