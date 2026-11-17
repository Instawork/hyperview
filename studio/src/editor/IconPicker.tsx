import { useState, useRef, useEffect } from 'react';

const ICONS = ["activity","airplay","anchor","aperture","archive","arrow-down","arrow-down-left","arrow-down-right","arrow-left","arrow-right","arrow-up","arrow-up-left","arrow-up-right","at-sign","award","badge-dollar-sign","ban","banknote","banknote-arrow-down","bell","bell-off","bluetooth","bold","book","book-check","book-open","book-open-text","bookmark","box","briefcase","bus","cake","calendar","calendar-check","calendar-clock","calendar-days","calendar-sync","camera","camera-off","car","chart-bar","chart-bar-increasing","chart-pie","check","chevron-down","chevron-left","chevron-right","chevron-up","chevrons-down","chevrons-left","chevrons-right","chevrons-up","circle","circle-alert","circle-arrow-down","circle-arrow-left","circle-arrow-right","circle-arrow-up","circle-check","circle-check-big","circle-dollar-sign","circle-minus","circle-pause","circle-play","circle-plus","circle-question-mark","circle-slash","circle-small","circle-star","circle-stop","circle-user-round","circle-x","clipboard","clipboard-list","clipboard-pen","clock","clock-fading","cloud","cloud-download","cloud-drizzle","cloud-lightning","cloud-off","cloud-rain","cloud-snow","cloud-upload","code","coffee","columns-2","compass","contact-round","copy","corner-down-left","corner-down-right","corner-left-down","corner-left-up","corner-right-down","corner-right-up","corner-up-left","corner-up-right","credit-card","crop","crosshair","disc","dollar-sign","download","ellipsis","ellipsis-vertical","external-link","eye","eye-off","fast-forward","feather","file","file-badge","file-minus","file-plus","file-text","film","flag","flag-triangle-right","folder","folder-minus","folder-plus","frown","fuel","funnel","gift","globe","graduation-cap","hand-helping","handshake","hash","headphones","heart","hourglass","house","image","images","inbox","info","italic","key","landmark","layers","layout-grid","life-buoy","lightbulb","link","link-2","loader","lock","lock-keyhole","lock-open","log-in","log-out","mail","map","map-pin","map-pin-house","maximize","maximize-2","megaphone","meh","menu","message-circle","message-circle-question-mark","message-square","messages-square","mic","mic-off","minus","monitor","moon","mouse-pointer","mouse-pointer-click","move","music","navigation","navigation-2","notebook-pen","notebook-text","octagon","octagon-alert","octagon-pause","package","panel-left","panels-top-left","paperclip","party-popper","pause","pen-tool","pencil","pencil-line","percent","person-standing","phone","phone-call","phone-forwarded","phone-incoming","phone-missed","phone-off","phone-outgoing","plus","power","printer","qr-code","radio","refresh-ccw","refresh-cw","repeat","repeat-2","rewind","rotate-ccw","rotate-cw","rss","save","scissors","scroll-text","search","send","server","settings","share","share-2","shield","shield-check","shield-off","shield-user","shirt","shopping-bag","shopping-cart","signpost","skip-back","skip-forward","slash","sliders-horizontal","sliders-vertical","smartphone","smile","square","square-arrow-up-right","square-check","square-check-big","square-minus","square-pen","square-plus","square-x","star","store","sun","sunrise","sunset","table","tag","target","text-align-center","text-align-end","text-align-justify","text-align-start","thermometer","thumbs-down","thumbs-up","timer","toggle-left","toggle-right","trash","trash-2","tree-palm","trending-down","trending-up","triangle","triangle-alert","trophy","truck","tv","type","umbrella","underline","upload","user","user-check","user-lock","user-minus","user-plus","user-round","user-round-plus","user-round-x","user-star","user-x","users","users-round","video","wallet-minimal","watch","wifi","wifi-off","wind","wrench","x","zap","zap-off","zoom-in","zoom-out"];

interface IconPickerProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

export function IconPicker({ value, onChange, label = 'Icon' }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = search
    ? ICONS.filter((i) => i.includes(search.toLowerCase()))
    : ICONS;

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="flex flex-col gap-1 relative" ref={dropdownRef}>
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
      <div className="flex gap-1">
        <input
          ref={inputRef}
          type="text"
          value={value || ''}
          onChange={(e) => { onChange(e.target.value); setSearch(e.target.value); }}
          onFocus={() => setOpen(true)}
          placeholder="search icons..."
          className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
        />
        {value && (
          <button
            onClick={() => { onChange(''); setSearch(''); }}
            className="px-1.5 text-xs text-[var(--text-secondary)] hover:text-red-400"
          >
            x
          </button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded shadow-lg">
          {filtered.slice(0, 60).map((icon) => (
            <button
              key={icon}
              onClick={() => { onChange(icon); setOpen(false); setSearch(''); }}
              className={`w-full text-left px-2 py-1 text-xs hover:bg-[var(--bg-hover)] transition-colors ${
                icon === value ? 'text-[var(--accent)] bg-[var(--accent)]/10' : 'text-[var(--text-primary)]'
              }`}
            >
              {icon}
            </button>
          ))}
          {filtered.length > 60 && (
            <div className="px-2 py-1 text-[10px] text-[var(--text-secondary)] italic">
              {filtered.length - 60} more — type to narrow
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { ICONS };
