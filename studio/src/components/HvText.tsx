import { useNode } from '@craftjs/core';
import { useCallback } from 'react';

interface Props {
  text?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  textAlign?: string;
  hvId?: string;
  hvStyle?: string;
}

export function HvText({
  text = 'Text',
  fontSize = 16,
  fontWeight = 'normal',
  color = '#000000',
  textAlign = 'left',
}: Props) {
  const { connectors: { connect, drag }, selected, actions: { setProp } } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    el.contentEditable = 'true';
    el.focus();
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLSpanElement>) => {
    e.currentTarget.contentEditable = 'false';
    setProp((props: { text: string }) => {
      props.text = e.currentTarget.textContent || '';
    });
  }, [setProp]);

  return (
    <span
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`inline-block min-w-[20px] cursor-text ${selected ? 'ring-2 ring-[var(--accent)]' : ''}`}
      style={{ fontSize, fontWeight, color, textAlign: textAlign as React.CSSProperties['textAlign'] }}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      suppressContentEditableWarning
    >
      {text}
    </span>
  );
}

HvText.craft = {
  displayName: 'Text',
  props: {
    text: 'Text',
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000000',
    textAlign: 'left',
    hvId: '',
    hvStyle: '',
  },
  rules: {
    canMoveIn: () => false,
  },
};
