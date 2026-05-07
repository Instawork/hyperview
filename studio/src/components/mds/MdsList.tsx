import { useNode, Element } from '@craftjs/core';
import { HvView } from '../HvView';

interface Props {
  href?: string;
  target?: string;
  hvId?: string;
}

export function MdsList({ hvId }: Props) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className="border border-dashed border-emerald-500/50 rounded-lg my-1 cursor-move bg-emerald-900/5"
    >
      <div className="text-[10px] text-emerald-400 font-mono px-3 pt-2">list</div>

      <div className="px-2 pt-1 pb-0.5">
        <div className="text-[9px] text-gray-500 uppercase tracking-wider px-1 mb-0.5">Title</div>
        <Element id="title" is={HvView} canvas flexDirection="column" padding={0} margin={0} borderRadius={0}>
          {/* title slot */}
        </Element>
      </div>

      <div className="px-2 py-0.5">
        <div className="text-[9px] text-gray-500 uppercase tracking-wider px-1 mb-0.5">Header</div>
        <Element id="header" is={HvView} canvas flexDirection="column" padding={0} margin={0} borderRadius={0}>
          {/* header slot */}
        </Element>
      </div>

      <div className="px-2 py-0.5">
        <div className="text-[9px] text-emerald-600 uppercase tracking-wider px-1 mb-0.5">Item Template</div>
        <div className="border border-emerald-700/30 rounded bg-emerald-900/10 p-1">
          <Element id="itemTemplate" is={HvView} canvas flexDirection="column" padding={0} margin={0} borderRadius={0}>
            <ItemHint />
          </Element>
        </div>
      </div>

      <div className="px-2 py-0.5">
        <div className="text-[9px] text-gray-500 uppercase tracking-wider px-1 mb-0.5">Footer</div>
        <Element id="footer" is={HvView} canvas flexDirection="column" padding={0} margin={0} borderRadius={0}>
          {/* footer slot */}
        </Element>
      </div>

      <div className="px-2 pt-0.5 pb-2">
        <div className="text-[9px] text-gray-500 uppercase tracking-wider px-1 mb-0.5">Empty State</div>
        <Element id="empty" is={HvView} canvas flexDirection="column" padding={0} margin={0} borderRadius={0}>
          {/* empty slot */}
        </Element>
      </div>
    </div>
  );
}

function ItemHint() {
  const { connectors: { connect } } = useNode();
  return (
    <div ref={(ref) => { if (ref) connect(ref); }}
      className="text-[9px] text-emerald-600/60 italic border border-dashed border-emerald-700/30 rounded px-2 py-2 text-center">
      Design one list item here
    </div>
  );
}
ItemHint.craft = { displayName: 'Hint', rules: { canDrag: () => false } };

MdsList.craft = {
  displayName: 'MDS List',
  rules: { canDrop: () => true },
};
