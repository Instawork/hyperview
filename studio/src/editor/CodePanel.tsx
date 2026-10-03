import { useEditor } from '@craftjs/core';
import Editor from '@monaco-editor/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { serializeToHxml } from '../serialization/serialize';
import { deserializeHxml } from '../serialization/deserialize';
import { useStyleStore } from '../stores/styles';
import { useBehaviorStore } from '../stores/behaviors';
import { Code2, RefreshCw, AlertCircle } from 'lucide-react';

export function CodePanel() {
  const { query, actions } = useEditor();
  const { styles, setStyles } = useStyleStore();
  const { getAllBehaviors } = useBehaviorStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<'idle' | 'from-canvas' | 'from-code'>('idle');
  const skipNextSync = useRef(false);

  const syncFromCanvas = useCallback(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }
    try {
      const json = query.serialize();
      const nodes = JSON.parse(json);
      const nodeMap: Record<string, { data: any }> = {};
      for (const [id, data] of Object.entries(nodes)) {
        nodeMap[id] = { data };
      }
      const hxml = serializeToHxml(nodeMap, styles, getAllBehaviors());
      setCode(hxml);
      setError(null);
    } catch (e) {
      console.warn('[CodePanel] sync error:', e);
    }
  }, [query, styles, getAllBehaviors]);

  useEffect(() => {
    syncFromCanvas();
    const timer = setInterval(syncFromCanvas, 2000);
    return () => clearInterval(timer);
  }, [syncFromCanvas]);

  const applyCode = useCallback(() => {
    setSyncing('from-code');
    try {
      const result = deserializeHxml(code);
      skipNextSync.current = true;
      actions.deserialize(result.nodes);
      if (result.styles.length > 0) setStyles(result.styles);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Parse error');
    } finally {
      setSyncing('idle');
    }
  }, [code, actions, setStyles]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          <Code2 size={12} />
          HXML Source
        </div>
        <button
          onClick={applyCode}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs transition-colors"
          title="Apply code changes to canvas"
        >
          <RefreshCw size={10} />
          Apply
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 text-xs border-b border-red-500/20">
          <AlertCircle size={12} />
          {error}
        </div>
      )}

      <div className="flex-1 min-h-0">
        <Editor
          language="xml"
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 8 },
          }}
        />
      </div>
    </div>
  );
}
