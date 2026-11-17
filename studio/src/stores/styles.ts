import { useSyncExternalStore, useCallback } from 'react';

export interface HvModifierDef {
  state: 'pressed' | 'selected' | 'focused';
  properties: Record<string, string>;
}

export interface HvStyleDef {
  id: string;
  properties: Record<string, string>;
  modifiers: HvModifierDef[];
}

let globalStyles: HvStyleDef[] = [];
let listeners: Set<() => void> = new Set();

function notify() {
  globalStyles = [...globalStyles];
  listeners.forEach((fn) => fn());
}

function getSnapshot(): HvStyleDef[] {
  return globalStyles;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function useStyleStore() {
  const styles = useSyncExternalStore(subscribe, getSnapshot);

  const addStyle = useCallback((id: string) => {
    if (globalStyles.find((s) => s.id === id)) return;
    globalStyles = [...globalStyles, { id, properties: {}, modifiers: [] }];
    notify();
  }, []);

  const updateStyle = useCallback((id: string, properties: Record<string, string>) => {
    globalStyles = globalStyles.map((s) =>
      s.id === id ? { ...s, properties } : s
    );
    notify();
  }, []);

  const removeStyle = useCallback((id: string) => {
    globalStyles = globalStyles.filter((s) => s.id !== id);
    notify();
  }, []);

  const addModifier = useCallback((styleId: string, state: HvModifierDef['state']) => {
    globalStyles = globalStyles.map((s) => {
      if (s.id !== styleId) return s;
      if (s.modifiers.find((m) => m.state === state)) return s;
      return { ...s, modifiers: [...s.modifiers, { state, properties: {} }] };
    });
    notify();
  }, []);

  const updateModifier = useCallback((styleId: string, state: string, properties: Record<string, string>) => {
    globalStyles = globalStyles.map((s) => {
      if (s.id !== styleId) return s;
      return {
        ...s,
        modifiers: s.modifiers.map((m) =>
          m.state === state ? { ...m, properties } : m
        ),
      };
    });
    notify();
  }, []);

  const removeModifier = useCallback((styleId: string, state: string) => {
    globalStyles = globalStyles.map((s) => {
      if (s.id !== styleId) return s;
      return { ...s, modifiers: s.modifiers.filter((m) => m.state !== state) };
    });
    notify();
  }, []);

  const setStyles = useCallback((newStyles: HvStyleDef[]) => {
    globalStyles = newStyles;
    notify();
  }, []);

  return { styles, addStyle, updateStyle, removeStyle, addModifier, updateModifier, removeModifier, setStyles };
}
