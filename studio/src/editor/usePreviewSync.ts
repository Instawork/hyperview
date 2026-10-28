import { useEditor } from '@craftjs/core';
import { useEffect, useRef } from 'react';
import { serializeToHxml } from '../serialization/serialize';
import { useStyleStore } from '../stores/styles';
import { useBehaviorStore } from '../stores/behaviors';

export function usePreviewSync() {
  const { query } = useEditor();
  const { styles } = useStyleStore();
  const { getAllBehaviors } = useBehaviorStore();
  const lastHxmlRef = useRef<string>('');

  useEffect(() => {
    function sync() {
      try {
        const json = query.serialize();
        const nodes = JSON.parse(json);

        const nodeMap: Record<string, { data: typeof nodes[string] }> = {};
        for (const [id, data] of Object.entries(nodes)) {
          nodeMap[id] = { data: data as any };
        }

        const hxml = serializeToHxml(nodeMap, styles, getAllBehaviors());

        if (hxml === lastHxmlRef.current) return;
        lastHxmlRef.current = hxml;

        fetch('/preview/update', {
          method: 'POST',
          body: hxml,
          headers: { 'Content-Type': 'application/xml' },
        }).catch(() => {});
      } catch (e) {
        console.warn('[HV Studio] Sync error:', e);
      }
    }

    const timer = setInterval(sync, 1000);
    return () => clearInterval(timer);
  }, [query, styles, getAllBehaviors]);
}
