import { Plus, Trash2, GripVertical, Zap, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useBehaviorStore, type HvBehaviorDef } from '../stores/behaviors';

const TRIGGERS = [
  'press', 'longPress', 'load', 'visible', 'refresh', 'on-event',
] as const;

const ACTIONS = [
  'push', 'new', 'back', 'close', 'navigate', 'reload',
  'replace', 'replace-inner', 'append', 'prepend',
  'show', 'hide', 'toggle',
  'set-value', 'dispatch-event',
  'deep-link', 'open-settings', 'copy-to-clipboard',
  'select-all', 'unselect-all',
  'scroll', 'alert',
] as const;

const NAV_ACTIONS = new Set(['push', 'new', 'navigate', 'replace', 'replace-inner', 'append', 'prepend', 'reload']);
const VISIBILITY_ACTIONS = new Set(['show', 'hide', 'toggle']);

interface BehaviorCardProps {
  nodeId: string;
  behavior: HvBehaviorDef;
  index: number;
  allNodeIds: string[];
}

function BehaviorCard({ nodeId, behavior, index, allNodeIds }: BehaviorCardProps) {
  const { updateBehavior, removeBehavior } = useBehaviorStore();
  const [expanded, setExpanded] = useState(true);

  const update = (updates: Partial<HvBehaviorDef>) => {
    updateBehavior(nodeId, behavior.id, updates);
  };

  const showHref = NAV_ACTIONS.has(behavior.action);
  const showTarget = VISIBILITY_ACTIONS.has(behavior.action) || behavior.action === 'set-value';
  const showEventName = behavior.trigger === 'on-event' || behavior.action === 'dispatch-event';
  const showNewValue = behavior.action === 'set-value';
  const showAlert = behavior.action === 'alert';
  const showScroll = behavior.action === 'scroll';
  const showLoadIndicators = showHref;

  return (
    <div className="border border-[var(--border-color)] rounded overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-[var(--bg-primary)] cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <GripVertical size={12} className="text-[var(--text-secondary)] shrink-0 cursor-grab" />
        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <span className="text-xs font-medium flex-1 truncate">
          <span className="text-[var(--accent)]">{behavior.trigger}</span>
          {' → '}
          <span className="text-emerald-400">{behavior.action}</span>
          {behavior.href && <span className="text-[var(--text-secondary)]"> {behavior.href}</span>}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); removeBehavior(nodeId, behavior.id); }}
          className="p-0.5 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-400"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {expanded && (
        <div className="px-3 py-2 flex flex-col gap-2 border-t border-[var(--border-color)]">
          {/* Trigger */}
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[var(--text-secondary)]">Trigger</span>
            <select
              value={behavior.trigger}
              onChange={(e) => update({ trigger: e.target.value })}
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
            >
              {TRIGGERS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>

          {/* Action */}
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[var(--text-secondary)]">Action</span>
            <select
              value={behavior.action}
              onChange={(e) => update({ action: e.target.value })}
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
            >
              {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </label>

          {/* Href (for navigation/fetch actions) */}
          {showHref && (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[var(--text-secondary)]">Href (URL)</span>
              <input
                type="text"
                value={behavior.href || ''}
                onChange={(e) => update({ href: e.target.value })}
                placeholder="/path/to/screen.xml"
                className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
              />
            </label>
          )}

          {/* Target (for show/hide/toggle/set-value) */}
          {showTarget && (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[var(--text-secondary)]">Target (element ID)</span>
              <input
                type="text"
                value={behavior.target || ''}
                onChange={(e) => update({ target: e.target.value })}
                placeholder="element-id"
                className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
                list={`targets-${behavior.id}`}
              />
              <datalist id={`targets-${behavior.id}`}>
                {allNodeIds.map((id) => <option key={id} value={id} />)}
              </datalist>
            </label>
          )}

          {/* Event name */}
          {showEventName && (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[var(--text-secondary)]">Event Name</span>
              <input
                type="text"
                value={behavior.eventName || ''}
                onChange={(e) => update({ eventName: e.target.value })}
                placeholder="my-event"
                className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
              />
            </label>
          )}

          {/* New value (for set-value) */}
          {showNewValue && (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[var(--text-secondary)]">New Value</span>
              <input
                type="text"
                value={behavior.newValue || ''}
                onChange={(e) => update({ newValue: e.target.value })}
                className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
              />
            </label>
          )}

          {/* Loading indicators */}
          {showLoadIndicators && (
            <div className="flex gap-3">
              <label className="flex flex-col gap-1 flex-1">
                <span className="text-xs text-[var(--text-secondary)]">Show During Load</span>
                <input
                  type="text"
                  value={behavior.showDuringLoad || ''}
                  onChange={(e) => update({ showDuringLoad: e.target.value })}
                  placeholder="element-id"
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
                />
              </label>
              <label className="flex flex-col gap-1 flex-1">
                <span className="text-xs text-[var(--text-secondary)]">Hide During Load</span>
                <input
                  type="text"
                  value={behavior.hideDuringLoad || ''}
                  onChange={(e) => update({ hideDuringLoad: e.target.value })}
                  placeholder="element-id"
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
                />
              </label>
            </div>
          )}

          {/* Alert fields */}
          {showAlert && (
            <>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-[var(--text-secondary)]">Alert Title</span>
                <input
                  type="text"
                  value={behavior.alertTitle || ''}
                  onChange={(e) => update({ alertTitle: e.target.value })}
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-[var(--text-secondary)]">Alert Message</span>
                <input
                  type="text"
                  value={behavior.alertMessage || ''}
                  onChange={(e) => update({ alertMessage: e.target.value })}
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
                />
              </label>
            </>
          )}

          {/* Scroll fields */}
          {showScroll && (
            <>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={behavior.scrollAnimated ?? true}
                  onChange={(e) => update({ scrollAnimated: e.target.checked })}
                  className="accent-[var(--accent)]"
                />
                <span className="text-xs text-[var(--text-secondary)]">Animated</span>
              </label>
              <div className="flex gap-3">
                <label className="flex flex-col gap-1 flex-1">
                  <span className="text-xs text-[var(--text-secondary)]">Offset</span>
                  <input
                    type="text"
                    value={behavior.scrollOffset || ''}
                    onChange={(e) => update({ scrollOffset: e.target.value })}
                    placeholder="0"
                    className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
                  />
                </label>
                <label className="flex flex-col gap-1 flex-1">
                  <span className="text-xs text-[var(--text-secondary)]">Position</span>
                  <select
                    value={behavior.scrollPosition || ''}
                    onChange={(e) => update({ scrollPosition: e.target.value })}
                    className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
                  >
                    <option value="">—</option>
                    <option value="top">top</option>
                    <option value="bottom">bottom</option>
                  </select>
                </label>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface BehaviorEditorProps {
  nodeId: string;
}

export function BehaviorEditor({ nodeId }: BehaviorEditorProps) {
  const { getBehaviors, addBehavior, getAllBehaviors } = useBehaviorStore();
  const behaviors = getBehaviors(nodeId);

  const allBehaviors = getAllBehaviors();
  const allNodeIds = Object.keys(allBehaviors).reduce<string[]>((acc, _nid) => acc, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
          <Zap size={12} />
          Behaviors
          {behaviors.length > 0 && (
            <span className="bg-[var(--accent)] text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {behaviors.length}
            </span>
          )}
        </div>
        <button
          onClick={() => addBehavior(nodeId)}
          className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs transition-colors"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      {behaviors.length === 0 && (
        <div className="text-xs text-[var(--text-secondary)] italic">
          No behaviors. Click Add to configure interactions.
        </div>
      )}

      {behaviors.map((bh, i) => (
        <BehaviorCard
          key={bh.id}
          nodeId={nodeId}
          behavior={bh}
          index={i}
          allNodeIds={allNodeIds}
        />
      ))}
    </div>
  );
}
