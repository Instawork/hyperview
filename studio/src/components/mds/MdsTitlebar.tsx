import { useNode, Element } from '@craftjs/core';
import { HvView } from '../HvView';

interface Props {
  title?: string;
  showBack?: boolean;
  main?: boolean;
  progress?: string;
  titleAlwaysOn?: boolean;
  hvId?: string;
}

export function MdsTitlebar({
  title = 'Screen Title', showBack = true, main = false, progress,
}: Props) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`flex flex-col bg-gray-800/60 border-b border-gray-700 cursor-move ${main ? 'py-4' : 'py-2.5'}`}
    >
      <div className="flex items-center gap-2 px-3">
        <div className="shrink-0 w-10">
          {showBack ? (
            <div className="w-8 h-8 flex items-center justify-center text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </div>
          ) : (
            <Element id="leftContent" is={HvView} canvas flexDirection="row" padding={0} margin={0} borderRadius={0}>
              {/* left slot */}
            </Element>
          )}
        </div>
        <div className="flex-1 text-center">
          <span className={`font-semibold text-gray-200 ${main ? 'text-lg' : 'text-sm'}`}>
            {title}
          </span>
        </div>
        <div className="shrink-0 w-10">
          <Element id="rightContent" is={HvView} canvas flexDirection="row" padding={0} margin={0} borderRadius={0}>
            {/* right slot */}
          </Element>
        </div>
      </div>
      {progress !== undefined && progress !== '' && (
        <div className="mx-3 mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

MdsTitlebar.craft = {
  displayName: 'MDS Titlebar',
  rules: { canDrop: () => true },
};
