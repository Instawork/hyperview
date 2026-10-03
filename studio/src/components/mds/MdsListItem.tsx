import { useNode, Element } from '@craftjs/core';
import { HvView } from '../HvView';

interface Props {
  hvId?: string;
}

export function MdsListItem(_props: Props) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className="flex flex-col border-b border-gray-700/50 cursor-move hover:bg-gray-800/20"
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="shrink-0">
          <Element id="left" is={HvView} canvas flexDirection="column" padding={0} margin={0} borderRadius={0}>
            <DropHint label="Left" />
          </Element>
        </div>
        <div className="flex-1 min-w-0">
          <Element id="content" is={HvView} canvas flexDirection="column" padding={0} margin={0} borderRadius={0}>
            <DropHint label="Content" />
          </Element>
        </div>
        <div className="shrink-0">
          <Element id="right" is={HvView} canvas flexDirection="column" padding={0} margin={0} borderRadius={0}>
            <DropHint label="Right" />
          </Element>
        </div>
      </div>
      <div className="px-3">
        <Element id="bottom" is={HvView} canvas flexDirection="column" padding={0} margin={0} borderRadius={0}>
          {/* bottom slot -- optional */}
        </Element>
      </div>
    </div>
  );
}

function DropHint({ label }: { label: string }) {
  const { connectors: { connect } } = useNode();
  return (
    <div
      ref={(ref) => { if (ref) connect(ref); }}
      className="flex items-center justify-center text-[9px] text-gray-600 italic border border-dashed border-gray-700/40 rounded px-2 py-1 min-w-[40px] min-h-[24px]"
    >
      {label}
    </div>
  );
}

DropHint.craft = { displayName: 'Hint', rules: { canDrag: () => false } };

MdsListItem.craft = {
  displayName: 'MDS ListItem',
  rules: { canDrop: () => true },
};
