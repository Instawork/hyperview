import { useNode } from '@craftjs/core';

interface Props {
  title?: string;
  message?: string;
  trigger?: string;
  dialogOptions?: string;
  hvId?: string;
}

export function MdsDialog({ title = 'Dialog Title', message = 'Are you sure?', trigger = 'press' }: Props) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className="border border-dashed border-amber-600/50 rounded-lg p-3 my-1 cursor-move bg-amber-900/10"
    >
      <div className="text-[10px] text-amber-400 font-mono mb-1.5 flex items-center gap-1">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
        behavior: alert ({trigger})
      </div>
      <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-600">
        <div className="text-sm font-semibold text-gray-200 mb-1">{title}</div>
        <div className="text-xs text-gray-400">{message}</div>
        <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-700">
          <span className="text-xs text-gray-500">Cancel</span>
          <span className="text-xs text-indigo-400 font-medium">OK</span>
        </div>
      </div>
    </div>
  );
}

MdsDialog.craft = {
  displayName: 'MDS Dialog',
  rules: { canMoveIn: () => false },
};
