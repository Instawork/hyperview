import { useEditor } from '@craftjs/core';
import { Settings, Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { BehaviorEditor } from './BehaviorEditor';
import { IconPicker } from './IconPicker';
import { SlotIndicator } from './SlotIndicator';
import { SLOT_DEFS } from '../components/mds/types';

type PropType = 'text' | 'number' | 'select' | 'color' | 'boolean' | 'icon';

function PropInput({
  label, value, type = 'text', options, onChange,
}: {
  label: string;
  value: string | number | boolean;
  type?: PropType;
  options?: string[];
  onChange: (val: string | number | boolean) => void;
}) {
  if (type === 'icon') {
    return <IconPicker label={label} value={String(value || '')} onChange={(v) => onChange(v)} />;
  }

  if (type === 'boolean') {
    return (
      <label className="flex items-center justify-between gap-2">
        <span className="text-xs text-[var(--text-secondary)]">{label}</span>
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="accent-[var(--accent)]" />
      </label>
    );
  }

  if (type === 'select' && options) {
    return (
      <label className="flex flex-col gap-1">
        <span className="text-xs text-[var(--text-secondary)]">{label}</span>
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
        >
          {options.map((opt) => <option key={opt} value={opt}>{opt || '—'}</option>)}
        </select>
      </label>
    );
  }

  if (type === 'color') {
    return (
      <label className="flex items-center justify-between gap-2">
        <span className="text-xs text-[var(--text-secondary)]">{label}</span>
        <div className="flex items-center gap-2">
          <input type="color" value={String(value) || '#000000'} onChange={(e) => onChange(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0" />
          <input type="text" value={String(value)} onChange={(e) => onChange(e.target.value)} className="w-20 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-0.5 text-xs text-[var(--text-primary)]" />
        </div>
      </label>
    );
  }

  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
      <input
        type={type}
        value={value as string | number}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"
      />
    </label>
  );
}

interface PropCfg {
  label: string;
  type: PropType;
  options?: string[];
  group?: string;
}

const PROP_CONFIGS: Record<string, PropCfg[]> = {
  HvView: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Style', type: 'text', group: 'General' },
    { label: 'Flex Direction', type: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'], group: 'Layout' },
    { label: 'Align Items', type: 'select', options: ['', 'flex-start', 'center', 'flex-end', 'stretch', 'baseline'], group: 'Layout' },
    { label: 'Justify Content', type: 'select', options: ['', 'flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'], group: 'Layout' },
    { label: 'Padding', type: 'number', group: 'Layout' },
    { label: 'Margin', type: 'number', group: 'Layout' },
    { label: 'Background Color', type: 'color', group: 'Appearance' },
    { label: 'Border Radius', type: 'number', group: 'Appearance' },
  ],
  HvText: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Style', type: 'text', group: 'General' },
    { label: 'Text', type: 'text', group: 'Content' },
    { label: 'Font Size', type: 'number', group: 'Typography' },
    { label: 'Font Weight', type: 'select', options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'], group: 'Typography' },
    { label: 'Color', type: 'color', group: 'Typography' },
    { label: 'Text Align', type: 'select', options: ['left', 'center', 'right'], group: 'Typography' },
  ],
  HvImage: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Style', type: 'text', group: 'General' },
    { label: 'Source', type: 'text', group: 'Content' },
    { label: 'Width', type: 'number', group: 'Size' },
    { label: 'Height', type: 'number', group: 'Size' },
  ],
  HvTextField: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Style', type: 'text', group: 'General' },
    { label: 'Name', type: 'text', group: 'Form' },
    { label: 'Placeholder', type: 'text', group: 'Form' },
    { label: 'Keyboard Type', type: 'select', options: ['default', 'number-pad', 'decimal-pad', 'numeric', 'email-address', 'phone-pad', 'url'], group: 'Form' },
  ],
  HvSwitch: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Style', type: 'text', group: 'General' },
    { label: 'Name', type: 'text', group: 'Form' },
    { label: 'Value', type: 'boolean', group: 'Form' },
  ],
  HvOption: [
    { label: 'Value', type: 'text', group: 'Content' },
    { label: 'Label', type: 'text', group: 'Content' },
  ],
  HvDateField: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Style', type: 'text', group: 'General' },
    { label: 'Name', type: 'text', group: 'Form' },
    { label: 'Label', type: 'text', group: 'Form' },
  ],
  HvSelectMultiple: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Style', type: 'text', group: 'General' },
    { label: 'Name', type: 'text', group: 'Form' },
  ],
  HvSelectSingle: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Style', type: 'text', group: 'General' },
    { label: 'Name', type: 'text', group: 'Form' },
  ],

  // ── MDS Components ─────────────────────────────────

  MdsButton: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Label', type: 'text', group: 'Content' },
    { label: 'Variant', type: 'select', options: ['primary', 'secondary', 'tertiary'], group: 'Appearance' },
    { label: 'Size', type: 'select', options: ['small', 'medium', 'large'], group: 'Appearance' },
    { label: 'State', type: 'select', options: ['enabled', 'disabled', 'loading'], group: 'Appearance' },
    { label: 'Status', type: 'select', options: ['default', 'destructive'], group: 'Appearance' },
    { label: 'Icon', type: 'icon', group: 'Content' },
    { label: 'Icon Trailing', type: 'boolean', group: 'Content' },
    { label: 'Label Loading', type: 'text', group: 'Content' },
    { label: 'Hide', type: 'boolean', group: 'Appearance' },
    { label: 'Action', type: 'select', options: ['', 'push', 'new', 'back', 'close', 'navigate', 'reload', 'replace', 'replace-inner'], group: 'Behavior' },
    { label: 'Href', type: 'text', group: 'Behavior' },
    { label: 'Target', type: 'text', group: 'Behavior' },
    { label: 'Verb', type: 'select', options: ['', 'get', 'post'], group: 'Behavior' },
  ],

  MdsCard: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Shadow', type: 'boolean', group: 'Appearance' },
    { label: 'Color', type: 'color', group: 'Appearance' },
    { label: 'Dismissible', type: 'text', group: 'Behavior' },
    { label: 'Action', type: 'select', options: ['', 'push', 'new', 'navigate', 'replace', 'replace-inner'], group: 'Behavior' },
    { label: 'Href', type: 'text', group: 'Behavior' },
    { label: 'Load Event', type: 'text', group: 'Events' },
    { label: 'Press Event', type: 'text', group: 'Events' },
    { label: 'Pressed Event', type: 'text', group: 'Events' },
  ],

  MdsAlert: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Kind', type: 'select', options: ['success', 'danger', 'info', 'neutral', 'warning'], group: 'Appearance' },
    { label: 'Title', type: 'text', group: 'Content' },
    { label: 'Show Icon', type: 'boolean', group: 'Appearance' },
    { label: 'Primary Link Label', type: 'text', group: 'Links' },
    { label: 'Secondary Link Label', type: 'text', group: 'Links' },
  ],

  MdsIcon: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Name', type: 'icon', group: 'Content' },
    { label: 'Size', type: 'select', options: ['8', '12', '16', '20', '24', '32', '36', '40', '48', '64', '80', '96', '128'], group: 'Appearance' },
    { label: 'Color', type: 'color', group: 'Appearance' },
  ],

  MdsSeparator: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Size', type: 'select', options: ['small', 'large'], group: 'Appearance' },
    { label: 'Variant', type: 'select', options: ['primary', 'secondary'], group: 'Appearance' },
    { label: 'Margin Horizontal', type: 'number', group: 'Layout' },
  ],

  MdsPill: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Text', type: 'text', group: 'Content' },
    { label: 'Icon Name', type: 'icon', group: 'Content' },
  ],

  MdsTitlebar: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Title', type: 'text', group: 'Content' },
    { label: 'Show Back', type: 'boolean', group: 'Navigation' },
    { label: 'Main', type: 'boolean', group: 'Appearance' },
    { label: 'Progress', type: 'text', group: 'Appearance' },
    { label: 'Title Always On', type: 'boolean', group: 'Appearance' },
  ],

  MdsFooter: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Sticky', type: 'boolean', group: 'Layout' },
    { label: 'Hide', type: 'boolean', group: 'Appearance' },
  ],

  MdsCallout: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Icon Name', type: 'icon', group: 'Content' },
    { label: 'Icon Color', type: 'color', group: 'Appearance' },
    { label: 'Icon Emphasize Color', type: 'color', group: 'Appearance' },
    { label: 'Background Color', type: 'color', group: 'Appearance' },
    { label: 'Text Align', type: 'select', options: ['left', 'center', 'right', 'justify'], group: 'Appearance' },
    { label: 'Size', type: 'select', options: ['small', 'large'], group: 'Appearance' },
    { label: 'Number Of Lines', type: 'number', group: 'Appearance' },
  ],

  MdsAvatar: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Source', type: 'text', group: 'Content' },
    { label: 'Size', type: 'select', options: ['24', '32', '40', '48', '56', '64', '72', '96', '128'], group: 'Appearance' },
    { label: 'Type', type: 'select', options: ['person', 'business'], group: 'Appearance' },
    { label: 'Has Border', type: 'boolean', group: 'Appearance' },
    { label: 'Counter', type: 'number', group: 'Content' },
    { label: 'Right', type: 'number', group: 'Layout' },
  ],

  MdsListItem: [
    { label: 'ID', type: 'text', group: 'General' },
  ],

  MdsSkeleton: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Variant', type: 'select', options: ['text', 'icon', 'avatar', 'filter'], group: 'Appearance' },
    { label: 'Size', type: 'text', group: 'Appearance' },
  ],

  MdsBanner: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Banner Type', type: 'select', options: ['PRIMARY', 'SUCCESS', 'WARNING', 'DANGER'], group: 'Appearance' },
    { label: 'Title', type: 'text', group: 'Content' },
    { label: 'Subtitle', type: 'text', group: 'Content' },
    { label: 'Icon Name', type: 'icon', group: 'Content' },
    { label: 'Icon Size', type: 'text', group: 'Content' },
    { label: 'Icon Color', type: 'color', group: 'Content' },
  ],

  MdsEmptyStatus: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Illustration Name', type: 'text', group: 'Content' },
  ],

  MdsDialog: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Title', type: 'text', group: 'Content' },
    { label: 'Message', type: 'text', group: 'Content' },
    { label: 'Trigger', type: 'select', options: ['press', 'longPress', 'load', 'visible', 'on-event'], group: 'Behavior' },
  ],

  MdsBottomsheet: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Visible', type: 'boolean', group: 'Appearance' },
    { label: 'CTA Label', type: 'text', group: 'CTA' },
    { label: 'CTA Layout', type: 'select', options: ['vertical', 'horizontal', 'none'], group: 'CTA' },
    { label: 'Secondary CTA Label', type: 'text', group: 'CTA' },
    { label: 'Toggle Duration', type: 'number', group: 'Animation' },
  ],

  MdsCarousel: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Auto Height', type: 'boolean', group: 'Layout' },
    { label: 'Autoplay', type: 'boolean', group: 'Behavior' },
    { label: 'Height', type: 'number', group: 'Layout' },
    { label: 'Pagination', type: 'select', options: ['', 'hide', 'overlay'], group: 'Appearance' },
    { label: 'Peek Items', type: 'boolean', group: 'Appearance' },
    { label: 'Next Event Name', type: 'text', group: 'Events' },
    { label: 'Prev Event Name', type: 'text', group: 'Events' },
    { label: 'On Active Event Prefix', type: 'text', group: 'Events' },
  ],

  MdsCarouselItem: [
    { label: 'ID', type: 'text', group: 'General' },
  ],

  MdsList: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Href', type: 'text', group: 'Data' },
    { label: 'Target', type: 'text', group: 'Data' },
  ],

  MdsText: [
    { label: 'ID', type: 'text', group: 'General' },
    { label: 'Style', type: 'text', group: 'General' },
    { label: 'Content', type: 'text', group: 'Content' },
    { label: 'Text Type', type: 'select', options: ['b2', 'b3', 'b4', 'b5', 'b6', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'], group: 'Typography' },
    { label: 'Color', type: 'color', group: 'Typography' },
    { label: 'Font Style', type: 'select', options: ['normal', 'italic'], group: 'Typography' },
    { label: 'Text Align', type: 'select', options: ['', 'auto', 'left', 'right', 'center', 'justify'], group: 'Typography' },
    { label: 'Number Of Lines', type: 'number', group: 'Typography' },
    { label: 'List Type', type: 'select', options: ['', 'unordered', 'ordered', 'ordered_simple'], group: 'List' },
    { label: 'List Index', type: 'number', group: 'List' },
    { label: 'Selectable', type: 'boolean', group: 'Behavior' },
    { label: 'Preformatted', type: 'boolean', group: 'Behavior' },
    { label: 'Hide', type: 'boolean', group: 'Appearance' },
  ],
};

const LABEL_TO_PROP: Record<string, string> = {
  'ID': 'hvId',
  'Style': 'hvStyle',
  'Flex Direction': 'flexDirection',
  'Align Items': 'alignItems',
  'Justify Content': 'justifyContent',
  'Padding': 'padding',
  'Margin': 'margin',
  'Background Color': 'backgroundColor',
  'Border Radius': 'borderRadius',
  'Text': 'text',
  'Font Size': 'fontSize',
  'Font Weight': 'fontWeight',
  'Color': 'color',
  'Text Align': 'textAlign',
  'Source': 'source',
  'Width': 'width',
  'Height': 'height',
  'Name': 'name',
  'Placeholder': 'placeholder',
  'Keyboard Type': 'keyboardType',
  'Value': 'value',
  'Label': 'label',
  'Key': 'hvKey',
  'Variant': 'variant',
  'State': 'state',
  'Status': 'status',
  'Icon': 'icon',
  'Icon Trailing': 'iconTrailing',
  'Label Loading': 'labelLoading',
  'Hide': 'hide',
  'Action': 'action',
  'Href': 'href',
  'Target': 'target',
  'Verb': 'verb',
  'Shadow': 'shadow',
  'Dismissible': 'dismissible',
  'Load Event': 'loadEvent',
  'Press Event': 'pressEvent',
  'Pressed Event': 'pressedEvent',
  'Kind': 'kind',
  'Title': 'title',
  'Show Icon': 'showIcon',
  'Primary Link Label': 'primaryLinkLabel',
  'Secondary Link Label': 'secondaryLinkLabel',
  'Icon Name': 'iconName',
  'Icon Color': 'iconColor',
  'Icon Emphasize Color': 'iconEmphasizeColor',
  'Icon Size': 'iconSize',
  'Margin Horizontal': 'marginHorizontal',
  'Show Back': 'showBack',
  'Main': 'main',
  'Progress': 'progress',
  'Title Always On': 'titleAlwaysOn',
  'Sticky': 'sticky',
  'Type': 'type',
  'Has Border': 'hasBorder',
  'Counter': 'counter',
  'Right': 'right',
  'Banner Type': 'bannerType',
  'Subtitle': 'subtitle',
  'Illustration Name': 'illustrationName',
  'Size': 'size',
  'Content': 'content',
  'Text Type': 'textType',
  'Font Style': 'fontStyle',
  'Number Of Lines': 'numberOfLines',
  'List Type': 'listType',
  'List Index': 'listIndex',
  'Selectable': 'selectable',
  'Preformatted': 'preformatted',
  'Message': 'message',
  'Trigger': 'trigger',
  'Visible': 'visible',
  'CTA Label': 'ctaLabel',
  'CTA Layout': 'ctaLayout',
  'Secondary CTA Label': 'secondaryCtaLabel',
  'Toggle Duration': 'toggleDuration',
  'Auto Height': 'autoHeight',
  'Autoplay': 'autoplay',
  'Pagination': 'pagination',
  'Peek Items': 'peekItems',
  'Next Event Name': 'nextEventName',
  'Prev Event Name': 'prevEventName',
  'On Active Event Prefix': 'onActiveEventPrefix',
};

export function PropertyPanel() {
  const { selectedNodeId, selectedNode, actions } = useEditor((state) => {
    const [id] = state.events.selected || [];
    return {
      selectedNodeId: id,
      selectedNode: id ? state.nodes[id] : null,
    };
  });

  const handleDelete = useCallback(() => {
    if (selectedNodeId) actions.delete(selectedNodeId);
  }, [selectedNodeId, actions]);

  if (!selectedNode) {
    return (
      <div className="p-4 text-center text-[var(--text-secondary)] text-sm">
        <Settings size={24} className="mx-auto mb-2 opacity-50" />
        Select an element to edit its properties
      </div>
    );
  }

  const typeName = typeof selectedNode.data.type === 'string'
    ? selectedNode.data.type
    : (selectedNode.data.type as any).resolvedName || selectedNode.data.displayName || 'Unknown';

  const propConfigs = PROP_CONFIGS[typeName] || [];
  const props = selectedNode.data.props || {};
  const isDeletable = !['HvDoc', 'HvScreen', 'HvBody'].includes(typeName);
  const slots = SLOT_DEFS[typeName] || [];

  const groups = propConfigs.reduce<Record<string, typeof propConfigs>>((acc, cfg) => {
    const group = cfg.group || 'General';
    if (!acc[group]) acc[group] = [];
    acc[group].push(cfg);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-[var(--text-primary)]">
          {selectedNode.data.displayName || typeName}
        </div>
        {isDeletable && (
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-400 transition-colors"
            title="Delete element"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {slots.length > 0 && (
        <div className="border-b border-[var(--border-color)] pb-2">
          <SlotIndicator nodeId={selectedNodeId!} slots={slots} />
        </div>
      )}

      {Object.entries(groups).map(([groupName, configs]) => (
        <div key={groupName} className="flex flex-col gap-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border-color)] pb-1">
            {groupName}
          </div>
          {configs.map((cfg) => {
            const propKey = LABEL_TO_PROP[cfg.label] || cfg.label.toLowerCase().replace(/\s/g, '');
            return (
              <PropInput
                key={cfg.label}
                label={cfg.label}
                value={props[propKey] ?? ''}
                type={cfg.type}
                options={cfg.options}
                onChange={(val) => {
                  actions.setProp(selectedNodeId!, (p: Record<string, unknown>) => {
                    p[propKey] = val;
                  });
                }}
              />
            );
          })}
        </div>
      ))}

      {propConfigs.length === 0 && (
        <div className="text-xs text-[var(--text-secondary)]">
          No editable properties for this element.
        </div>
      )}

      {isDeletable && (
        <div className="border-t border-[var(--border-color)] pt-3">
          <BehaviorEditor nodeId={selectedNodeId!} />
        </div>
      )}
    </div>
  );
}
