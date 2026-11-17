import { Editor, Frame, Element } from '@craftjs/core';
import {
  HvDoc, HvScreen, HvBody, HvHeader, HvView, HvText,
  HvImage, HvSpinner, HvList, HvItem, HvForm, HvTextField,
  HvSelectSingle, HvSelectMultiple, HvOption, HvSwitch, HvDateField,
} from './components';
import {
  MdsButton, MdsCard, MdsAlert, MdsIcon, MdsSeparator,
  MdsPill, MdsTitlebar, MdsFooter, MdsCallout, MdsAvatar,
  MdsListItem, MdsSkeleton, MdsBanner, MdsEmptyStatus,
  MdsDialog, MdsBottomsheet, MdsCarousel, MdsCarouselItem,
  MdsList, MdsText,
} from './components/mds';
import { Toolbox } from './editor/Toolbox';
import { LayersTree } from './editor/LayersTree';
import { PropertyPanel } from './editor/PropertyPanel';
import { StyleCatalog } from './editor/StyleCatalog';
import { Toolbar } from './editor/Toolbar';
import { usePreviewSync } from './editor/usePreviewSync';
import { useKeyboardShortcuts } from './editor/useKeyboardShortcuts';
import { CodePanel } from './editor/CodePanel';
import { useStyleStore } from './stores/styles';
import { useEffect, useState } from 'react';

const resolver = {
  HvDoc, HvScreen, HvBody, HvHeader, HvView, HvText,
  HvImage, HvSpinner, HvList, HvItem, HvForm, HvTextField,
  HvSelectSingle, HvSelectMultiple, HvOption, HvSwitch, HvDateField,
  MdsButton, MdsCard, MdsAlert, MdsIcon, MdsSeparator,
  MdsPill, MdsTitlebar, MdsFooter, MdsCallout, MdsAvatar,
  MdsListItem, MdsSkeleton, MdsBanner, MdsEmptyStatus,
  MdsDialog, MdsBottomsheet, MdsCarousel, MdsCarouselItem,
  MdsList, MdsText,
};

function EditorContent() {
  usePreviewSync();
  useKeyboardShortcuts();
  const { setStyles } = useStyleStore();
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    function handleImport(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.styles) setStyles(detail.styles);
    }
    window.addEventListener('hv-import', handleImport);
    return () => window.removeEventListener('hv-import', handleImport);
  }, [setStyles]);

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)]">
        {/* Header */}
        <header className="flex items-center h-12 px-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
              H
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">Hyperview Studio</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCode(!showCode)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                showCode
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              {'</>'}
              Code
            </button>
            <span className="text-xs text-[var(--text-secondary)]">v0.3</span>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar */}
          <aside className="w-[var(--sidebar-width)] border-r border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col overflow-hidden shrink-0">
            <div className="flex-1 overflow-y-auto">
              <Toolbox />
            </div>
            <div className="border-t border-[var(--border-color)] max-h-[40%] overflow-y-auto">
              <LayersTree />
            </div>
          </aside>

          {/* Canvas */}
          <main className="flex-1 overflow-auto bg-[var(--bg-canvas)] p-8">
            <div className="max-w-[420px] mx-auto">
              <Frame>
                <Element is={HvDoc} canvas>
                  <Element is={HvScreen} canvas>
                    <Element is={HvBody} canvas>
                      <Element is={HvView} canvas flexDirection="column" padding={16}>
                        <HvText text="Welcome to Hyperview" fontSize={24} fontWeight="bold" />
                        <HvText text="Drag components from the left panel" fontSize={14} color="#666666" />
                      </Element>
                    </Element>
                  </Element>
                </Element>
              </Frame>
            </div>
          </main>

          {/* Right sidebar */}
          <aside className="w-[var(--sidebar-width)] border-l border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col overflow-hidden shrink-0">
            <div className="flex-1 overflow-y-auto">
              <PropertyPanel />
            </div>
            <div className="border-t border-[var(--border-color)] max-h-[40%] overflow-y-auto">
              <StyleCatalog />
            </div>
          </aside>
        </div>

        {/* Code Panel (bottom split) */}
        {showCode && (
          <div className="h-[35vh] border-t border-[var(--border-color)] shrink-0">
            <CodePanel />
          </div>
        )}

        {/* Toolbar */}
        <Toolbar />
      </div>
  );
}

export default function App() {
  return (
    <Editor resolver={resolver}>
      <EditorContent />
    </Editor>
  );
}
