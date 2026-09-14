import { useSyncExternalStore, useCallback } from 'react';

export interface HvBehaviorDef {
  id: string;
  trigger: string;
  action: string;
  href?: string;
  target?: string;
  showDuringLoad?: string;
  hideDuringLoad?: string;
  eventName?: string;
  newValue?: string;
  // Alert namespace attrs
  alertTitle?: string;
  alertMessage?: string;
  // Scroll namespace attrs
  scrollAnimated?: boolean;
  scrollOffset?: string;
  scrollPosition?: string;
}

type BehaviorMap = Record<string, HvBehaviorDef[]>;

let store: BehaviorMap = {};
let listeners: Set<() => void> = new Set();
let snapshotRef = store;

function notify() {
  snapshotRef = { ...store };
  listeners.forEach((fn) => fn());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function getSnapshot(): BehaviorMap {
  return snapshotRef;
}

let nextId = 1;

export function useBehaviorStore() {
  const behaviors = useSyncExternalStore(subscribe, getSnapshot);

  const getBehaviors = useCallback((nodeId: string): HvBehaviorDef[] => {
    return behaviors[nodeId] || [];
  }, [behaviors]);

  const addBehavior = useCallback((nodeId: string): string => {
    const id = `bh-${nextId++}`;
    const newBehavior: HvBehaviorDef = {
      id,
      trigger: 'press',
      action: 'push',
    };
    store = {
      ...store,
      [nodeId]: [...(store[nodeId] || []), newBehavior],
    };
    notify();
    return id;
  }, []);

  const updateBehavior = useCallback((nodeId: string, behaviorId: string, updates: Partial<HvBehaviorDef>) => {
    const list = store[nodeId];
    if (!list) return;
    store = {
      ...store,
      [nodeId]: list.map((b) =>
        b.id === behaviorId ? { ...b, ...updates } : b
      ),
    };
    notify();
  }, []);

  const removeBehavior = useCallback((nodeId: string, behaviorId: string) => {
    const list = store[nodeId];
    if (!list) return;
    store = {
      ...store,
      [nodeId]: list.filter((b) => b.id !== behaviorId),
    };
    if (store[nodeId]!.length === 0) {
      const { [nodeId]: _, ...rest } = store;
      store = rest;
    }
    notify();
  }, []);

  const moveBehavior = useCallback((nodeId: string, fromIndex: number, toIndex: number) => {
    const list = [...(store[nodeId] || [])];
    if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) return;
    const [item] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, item);
    store = { ...store, [nodeId]: list };
    notify();
  }, []);

  const getAllBehaviors = useCallback((): BehaviorMap => {
    return behaviors;
  }, [behaviors]);

  return { getBehaviors, addBehavior, updateBehavior, removeBehavior, moveBehavior, getAllBehaviors };
}
