import { Palette, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useStyleStore, type HvModifierDef } from '../stores/styles';

const STYLE_PROPERTIES = [
  { key: 'flex', label: 'Flex', type: 'text' },
  { key: 'flexDirection', label: 'Flex Direction', type: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
  { key: 'alignItems', label: 'Align Items', type: 'select', options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'] },
  { key: 'justifyContent', label: 'Justify', type: 'select', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] },
  { key: 'padding', label: 'Padding', type: 'text' },
  { key: 'margin', label: 'Margin', type: 'text' },
  { key: 'width', label: 'Width', type: 'text' },
  { key: 'height', label: 'Height', type: 'text' },
  { key: 'backgroundColor', label: 'Background', type: 'color' },
  { key: 'borderWidth', label: 'Border Width', type: 'text' },
  { key: 'borderColor', label: 'Border Color', type: 'color' },
  { key: 'borderRadius', label: 'Border Radius', type: 'text' },
  { key: 'opacity', label: 'Opacity', type: 'text' },
  { key: 'fontSize', label: 'Font Size', type: 'text' },
  { key: 'fontWeight', label: 'Font Weight', type: 'select', options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  { key: 'color', label: 'Color', type: 'color' },
  { key: 'textAlign', label: 'Text Align', type: 'select', options: ['left', 'center', 'right'] },
] as const;

const MODIFIER_STATES: HvModifierDef['state'][] = ['pressed', 'selected', 'focused'];

function PropertyGrid({
  properties,
  onChange,
}: {
  properties: Record<string, string>;
  onChange: (props: Record<string, string>) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {STYLE_PROPERTIES.map((prop) => (
        <label key={prop.key} className="flex items-center gap-2 text-xs">
          <span className="text-[var(--text-secondary)] w-20 shrink-0 truncate" title={prop.label}>{prop.label}</span>
          {prop.type === 'select' ? (
            <select
              value={properties[prop.key] || ''}
              onChange={(e) => onChange({ ...properties, [prop.key]: e.target.value })}
              className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-1.5 py-0.5 text-[var(--text-primary)] min-w-0"
            >
              <option value="">--</option>
              {prop.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : prop.type === 'color' ? (
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <input
                type="color"
                value={properties[prop.key] || '#000000'}
                onChange={(e) => onChange({ ...properties, [prop.key]: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border-0 shrink-0"
              />
              <input
                type="text"
                value={properties[prop.key] || ''}
                onChange={(e) => onChange({ ...properties, [prop.key]: e.target.value })}
                className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-1.5 py-0.5 text-[var(--text-primary)] min-w-0"
              />
            </div>
          ) : (
            <input
              type="text"
              value={properties[prop.key] || ''}
              onChange={(e) => onChange({ ...properties, [prop.key]: e.target.value })}
              className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-1.5 py-0.5 text-[var(--text-primary)] min-w-0"
            />
          )}
        </label>
      ))}
    </div>
  );
}

export function StyleCatalog() {
  const { styles, addStyle, updateStyle, removeStyle, addModifier, updateModifier, removeModifier } = useStyleStore();
  const [newName, setNewName] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedModifier, setExpandedModifier] = useState<string | null>(null);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    addStyle(name);
    setNewName('');
    setExpandedId(name);
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] px-3 py-2 flex items-center gap-2">
        <Palette size={14} />
        Styles
      </div>

      <div className="flex gap-1 px-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Style name..."
          className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-xs text-[var(--text-primary)]"
        />
        <button
          onClick={handleAdd}
          className="p-1 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors"
          title="Add style"
        >
          <Plus size={14} />
        </button>
      </div>

      {styles.map((style) => (
        <div key={style.id} className="border border-[var(--border-color)] rounded mx-2">
          <div
            className="flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
            onClick={() => setExpandedId(expandedId === style.id ? null : style.id)}
          >
            <div className="flex items-center gap-1.5">
              {expandedId === style.id ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <span className="text-sm text-[var(--text-primary)] font-mono">{style.id}</span>
              {style.modifiers.length > 0 && (
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1 rounded">
                  {style.modifiers.length} state{style.modifiers.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); removeStyle(style.id); }}
              className="p-0.5 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-400"
            >
              <Trash2 size={12} />
            </button>
          </div>

          {expandedId === style.id && (
            <div className="px-3 pb-2 border-t border-[var(--border-color)] pt-2 flex flex-col gap-3">
              {/* Base properties */}
              <PropertyGrid
                properties={style.properties}
                onChange={(props) => updateStyle(style.id, props)}
              />

              {/* Modifiers */}
              <div className="border-t border-[var(--border-color)] pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase text-[var(--text-secondary)]">State Modifiers</span>
                  <div className="flex gap-1">
                    {MODIFIER_STATES.filter(
                      (s) => !style.modifiers.find((m) => m.state === s)
                    ).map((state) => (
                      <button
                        key={state}
                        onClick={() => addModifier(style.id, state)}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors"
                      >
                        +{state}
                      </button>
                    ))}
                  </div>
                </div>

                {style.modifiers.map((mod) => {
                  const modKey = `${style.id}:${mod.state}`;
                  return (
                    <div key={mod.state} className="border border-[var(--border-color)] rounded mb-1.5 overflow-hidden">
                      <div
                        className="flex items-center justify-between px-2 py-1 bg-[var(--bg-primary)] cursor-pointer"
                        onClick={() => setExpandedModifier(expandedModifier === modKey ? null : modKey)}
                      >
                        <div className="flex items-center gap-1.5">
                          {expandedModifier === modKey ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                          <span className="text-xs text-purple-300 font-medium">{mod.state}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeModifier(style.id, mod.state); }}
                          className="p-0.5 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-400"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                      {expandedModifier === modKey && (
                        <div className="px-2 py-1.5 border-t border-[var(--border-color)]">
                          <PropertyGrid
                            properties={mod.properties}
                            onChange={(props) => updateModifier(style.id, mod.state, props)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

                {style.modifiers.length === 0 && (
                  <div className="text-[10px] text-[var(--text-secondary)] italic">
                    Add pressed, selected, or focused states above.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {styles.length === 0 && (
        <div className="text-xs text-[var(--text-secondary)] px-3">
          No styles defined. Add one above.
        </div>
      )}
    </div>
  );
}
