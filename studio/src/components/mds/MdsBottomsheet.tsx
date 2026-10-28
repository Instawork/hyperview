import { useNode, Element } from '@craftjs/core';
import { HvView } from '../HvView';

interface Props {
  visible?: boolean;
  ctaLabel?: string;
  ctaLayout?: string;
  secondaryCtaLabel?: string;
  toggleDuration?: number;
  hvId?: string;
}

export function MdsBottomsheet({
  visible = false, ctaLabel = 'Got it', ctaLayout = 'vertical',
  secondaryCtaLabel,
}: Props) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`border border-dashed border-purple-500/50 rounded-xl my-1 cursor-move bg-gray-900 ${visible ? '' : 'opacity-60'}`}
    >
      <div className="text-[10px] text-purple-400 font-mono px-3 pt-2 flex items-center gap-1">
        worker-app:bottom-sheet
        {!visible && <span className="text-gray-600 ml-1">(hidden)</span>}
      </div>

      <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-2" />

      <div className="p-3 min-h-[60px]">
        <Element id="body" is={HvView} canvas flexDirection="column" padding={0} margin={0} borderRadius={0}>
          <BodyHint />
        </Element>
      </div>

      <div className={`p-3 pt-0 flex ${ctaLayout === 'horizontal' ? 'flex-row gap-3' : 'flex-col gap-2'}`}>
        <div className={`bg-indigo-600 rounded-lg py-2 text-center text-sm text-white font-medium ${ctaLayout === 'horizontal' ? 'flex-1' : ''}`}>
          <Element id="ctaChildren" is={HvView} canvas flexDirection="row" padding={0} margin={0} borderRadius={0}>
            <span className="text-sm">{ctaLabel}</span>
          </Element>
        </div>
        {secondaryCtaLabel && (
          <div className={`bg-gray-700 rounded-lg py-2 text-center text-sm text-gray-300 font-medium ${ctaLayout === 'horizontal' ? 'flex-1' : ''}`}>
            <Element id="secondaryCtaChildren" is={HvView} canvas flexDirection="row" padding={0} margin={0} borderRadius={0}>
              <span className="text-sm">{secondaryCtaLabel}</span>
            </Element>
          </div>
        )}
      </div>
    </div>
  );
}

function BodyHint() {
  const { connectors: { connect } } = useNode();
  return (
    <div ref={(ref) => { if (ref) connect(ref); }}
      className="text-[9px] text-gray-600 italic border border-dashed border-gray-700/40 rounded px-2 py-3 text-center min-h-[40px]">
      Sheet content
    </div>
  );
}
BodyHint.craft = { displayName: 'Hint', rules: { canDrag: () => false } };

MdsBottomsheet.craft = {
  displayName: 'MDS Bottomsheet',
  rules: { canDrop: () => true },
};
