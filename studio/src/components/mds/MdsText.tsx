import { useNode } from '@craftjs/core';

interface Props {
  content?: string;
  textType?: string;
  color?: string;
  fontStyle?: string;
  textAlign?: string;
  numberOfLines?: number;
  listType?: string;
  listIndex?: number;
  selectable?: boolean;
  preformatted?: boolean;
  hide?: boolean;
  hvId?: string;
  hvStyle?: string;
}

const TYPE_STYLES: Record<string, { size: string; weight: string }> = {
  h1: { size: 'text-3xl', weight: 'font-bold' },
  h2: { size: 'text-2xl', weight: 'font-bold' },
  h3: { size: 'text-xl', weight: 'font-bold' },
  h4: { size: 'text-lg', weight: 'font-semibold' },
  h5: { size: 'text-base', weight: 'font-semibold' },
  h6: { size: 'text-sm', weight: 'font-semibold' },
  h7: { size: 'text-xs', weight: 'font-semibold' },
  b2: { size: 'text-base', weight: 'font-normal' },
  b3: { size: 'text-sm', weight: 'font-normal' },
  b4: { size: 'text-xs', weight: 'font-normal' },
  b5: { size: 'text-[11px]', weight: 'font-normal' },
  b6: { size: 'text-[10px]', weight: 'font-normal' },
};

export function MdsText({
  content = 'Text', textType = 'b3', color, fontStyle = 'normal',
  textAlign, numberOfLines, listType, listIndex, hide = false,
}: Props) {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const styles = TYPE_STYLES[textType] || TYPE_STYLES.b3;

  const bullet = listType === 'unordered' ? '• ' :
    listType === 'ordered' || listType === 'ordered_simple' ? `${listIndex || 1}. ` : '';

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`cursor-move ${styles.size} ${styles.weight} ${hide ? 'opacity-20' : ''}`}
      style={{
        color: color || '#e5e7eb',
        fontStyle,
        textAlign: textAlign as any,
        ...(numberOfLines ? {
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: numberOfLines,
          WebkitBoxOrient: 'vertical' as const,
        } : {}),
      }}
    >
      {bullet}
      <span
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => setProp((p: Record<string, unknown>) => { p.content = e.currentTarget.textContent || ''; })}
      >
        {content}
      </span>
    </div>
  );
}

MdsText.craft = {
  displayName: 'MDS Text',
  rules: { canMoveIn: () => false },
};
