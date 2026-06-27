import { Plus, Trash2, GripVertical } from 'lucide-react';

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'select';
  options?: string[];
  placeholder?: string;
}

interface RepeatableFormProps<T extends Record<string, unknown>> {
  label: string;
  items: T[];
  fields: FieldDef[];
  onAdd: () => void;
  onUpdate: (index: number, updates: Partial<T>) => void;
  onRemove: (index: number) => void;
  createEmpty?: () => T;
}

export function RepeatableForm<T extends Record<string, unknown>>({
  label,
  items,
  fields,
  onAdd,
  onUpdate,
  onRemove,
}: RepeatableFormProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
          {items.length > 0 && (
            <span className="ml-1.5 bg-[var(--accent)] text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </span>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs transition-colors"
        >
          <Plus size={10} />
          Add
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-[10px] text-[var(--text-secondary)] italic">
          None configured. Click Add.
        </div>
      )}

      {items.map((item, i) => (
        <div key={i} className="border border-[var(--border-color)] rounded p-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
              <GripVertical size={10} />
              <span>#{i + 1}</span>
            </div>
            <button
              onClick={() => onRemove(i)}
              className="p-0.5 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-400"
            >
              <Trash2 size={10} />
            </button>
          </div>
          {fields.map((field) => (
            <label key={field.key} className="flex flex-col gap-0.5">
              <span className="text-[10px] text-[var(--text-secondary)]">{field.label}</span>
              {field.type === 'select' && field.options ? (
                <select
                  value={String(item[field.key] ?? '')}
                  onChange={(e) => onUpdate(i, { [field.key]: e.target.value } as Partial<T>)}
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-1.5 py-0.5 text-xs text-[var(--text-primary)]"
                >
                  {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  value={String(item[field.key] ?? '')}
                  onChange={(e) => onUpdate(i, { [field.key]: e.target.value } as Partial<T>)}
                  placeholder={field.placeholder}
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-1.5 py-0.5 text-xs text-[var(--text-primary)]"
                />
              )}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
