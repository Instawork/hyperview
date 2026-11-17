import { useNode, Element } from '@craftjs/core';
import { HvView } from '../HvView';

interface Props {
  kind?: string;
  title?: string;
  showIcon?: boolean;
  primaryLinkLabel?: string;
  secondaryLinkLabel?: string;
  hvId?: string;
}

const KIND_COLORS: Record<string, { bg: string; border: string; text: string; iconLabel: string }> = {
  success: { bg: 'bg-green-900/30', border: 'border-green-600', text: 'text-green-300', iconLabel: 'check' },
  danger: { bg: 'bg-red-900/30', border: 'border-red-600', text: 'text-red-300', iconLabel: 'alert' },
  info: { bg: 'bg-blue-900/30', border: 'border-blue-600', text: 'text-blue-300', iconLabel: 'info' },
  warning: { bg: 'bg-yellow-900/30', border: 'border-yellow-600', text: 'text-yellow-300', iconLabel: 'warn' },
  neutral: { bg: 'bg-gray-800/50', border: 'border-gray-600', text: 'text-gray-300', iconLabel: 'info' },
};

export function MdsAlert({
  kind = 'neutral', title, showIcon = false,
  primaryLinkLabel, secondaryLinkLabel,
}: Props) {
  const { connectors: { connect, drag } } = useNode();
  const colors = KIND_COLORS[kind] || KIND_COLORS.neutral;

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`rounded-lg border ${colors.bg} ${colors.border} p-3 my-1 cursor-move`}
    >
      <div className="flex items-start gap-2">
        {showIcon && (
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${colors.text} bg-white/10 shrink-0 mt-0.5`}>
            {colors.iconLabel.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && <div className={`text-sm font-semibold ${colors.text} mb-1`}>{title}</div>}
          <div className="text-xs text-gray-300">
            <Element id="content" is={HvView} canvas flexDirection="column" padding={0} margin={0} borderRadius={0}>
              <ContentHint />
            </Element>
          </div>
          {(primaryLinkLabel || secondaryLinkLabel) && (
            <div className="flex gap-3 mt-2">
              {primaryLinkLabel && (
                <button className={`text-xs font-medium ${colors.text} underline cursor-default`}>
                  {primaryLinkLabel}
                </button>
              )}
              {secondaryLinkLabel && (
                <button className="text-xs font-medium text-gray-400 underline cursor-default">
                  {secondaryLinkLabel}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContentHint() {
  const { connectors: { connect } } = useNode();
  return (
    <div ref={(ref) => { if (ref) connect(ref); }}
      className="text-[9px] text-gray-600 italic border border-dashed border-gray-700/40 rounded px-2 py-1 min-h-[20px]">
      Alert content
    </div>
  );
}
ContentHint.craft = { displayName: 'Hint', rules: { canDrag: () => false } };

MdsAlert.craft = {
  displayName: 'MDS Alert',
  rules: { canDrop: () => true },
};
