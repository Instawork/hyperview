import { componentMap } from '../components';
import { mdsComponentMap } from '../components/mds';
import type { HvStyleDef } from '../stores/styles';
import type { HvBehaviorDef } from '../stores/behaviors';

const MDS_NS_URI = 'https://instawork.com/hyperview-mds';
const WORKER_APP_NS_URI = 'https://instawork.com/hyperview-worker-app';
const UI_NS_URI = 'https://instawork.com/hyperview-ui';
const ICON_NS_URI = 'https://instawork.com/hyperview-icon';

interface SerializedNode {
  type: { resolvedName: string } | string;
  displayName?: string;
  props: Record<string, unknown>;
  nodes: string[];
  linkedNodes?: Record<string, string>;
  parent?: string;
  isCanvas?: boolean;
}

type NodeMap = Record<string, { data: SerializedNode }>;

const INDENT = '  ';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getTagName(typeName: string): string | null {
  return (componentMap as Record<string, string>)[typeName]
    || (mdsComponentMap as Record<string, string>)[typeName]
    || null;
}

function isCustomElement(tagName: string): boolean {
  return tagName.includes(':');
}

function serializeStyles(styles: HvStyleDef[], indent: string): string {
  if (styles.length === 0) return '';
  let xml = `${indent}<styles>\n`;
  for (const style of styles) {
    const attrs = Object.entries(style.properties)
      .filter(([, v]) => v !== '' && v !== undefined)
      .map(([k, v]) => `${k}="${escapeXml(v)}"`)
      .join(' ');
    const hasModifiers = style.modifiers && style.modifiers.length > 0;
    if (!hasModifiers) {
      xml += `${indent}${INDENT}<style id="${escapeXml(style.id)}"${attrs ? ' ' + attrs : ''} />\n`;
    } else {
      xml += `${indent}${INDENT}<style id="${escapeXml(style.id)}"${attrs ? ' ' + attrs : ''}>\n`;
      for (const mod of style.modifiers) {
        const modAttrs = Object.entries(mod.properties)
          .filter(([, v]) => v !== '' && v !== undefined)
          .map(([k, v]) => `${k}="${escapeXml(v)}"`)
          .join(' ');
        xml += `${indent}${INDENT}${INDENT}<modifier state="${mod.state}"${modAttrs ? ' ' + modAttrs : ''} />\n`;
      }
      xml += `${indent}${INDENT}</style>\n`;
    }
  }
  xml += `${indent}</styles>\n`;
  return xml;
}

type BehaviorMap = Record<string, HvBehaviorDef[]>;

const SCROLL_NS = 'https://hyperview.org/hyperview-scroll';
const ALERT_NS = 'https://hyperview.org/hyperview-alert';

function serializeBehaviors(behaviors: HvBehaviorDef[], indent: string): string {
  let xml = '';
  for (const bh of behaviors) {
    const attrs: string[] = [];
    attrs.push(`trigger="${escapeXml(bh.trigger)}"`);
    attrs.push(`action="${escapeXml(bh.action)}"`);
    if (bh.href) attrs.push(`href="${escapeXml(bh.href)}"`);
    if (bh.target) attrs.push(`target="${escapeXml(bh.target)}"`);
    if (bh.showDuringLoad) attrs.push(`show-during-load="${escapeXml(bh.showDuringLoad)}"`);
    if (bh.hideDuringLoad) attrs.push(`hide-during-load="${escapeXml(bh.hideDuringLoad)}"`);
    if (bh.eventName) {
      if (bh.action === 'dispatch-event') attrs.push(`event-name="${escapeXml(bh.eventName)}"`);
      if (bh.trigger === 'on-event') attrs.push(`event-name="${escapeXml(bh.eventName)}"`);
    }
    if (bh.action === 'set-value' && bh.newValue !== undefined) attrs.push(`new-value="${escapeXml(bh.newValue)}"`);
    if (bh.action === 'alert') {
      if (bh.alertTitle) attrs.push(`alert:title="${escapeXml(bh.alertTitle)}"`);
      if (bh.alertMessage) attrs.push(`alert:message="${escapeXml(bh.alertMessage)}"`);
    }
    if (bh.action === 'scroll') {
      if (bh.scrollAnimated !== undefined) attrs.push(`scroll:animated="${bh.scrollAnimated}"`);
      if (bh.scrollOffset) attrs.push(`scroll:offset="${escapeXml(bh.scrollOffset)}"`);
      if (bh.scrollPosition) attrs.push(`scroll:position="${escapeXml(bh.scrollPosition)}"`);
    }
    xml += `${indent}<behavior ${attrs.join(' ')} />\n`;
  }
  return xml;
}

function collectNamespaces(behaviorMap: BehaviorMap, nodes: NodeMap): { prefix: string; uri: string }[] {
  const ns: { prefix: string; uri: string }[] = [];
  const seen = new Set<string>();

  for (const behaviors of Object.values(behaviorMap)) {
    for (const bh of behaviors) {
      if (bh.action === 'scroll' && !seen.has('scroll')) {
        ns.push({ prefix: 'scroll', uri: SCROLL_NS });
        seen.add('scroll');
      }
      if (bh.action === 'alert' && !seen.has('alert')) {
        ns.push({ prefix: 'alert', uri: ALERT_NS });
        seen.add('alert');
      }
    }
  }

  for (const entry of Object.values(nodes)) {
    const typeName = typeof entry.data.type === 'string' ? entry.data.type : entry.data.type.resolvedName;
    const tag = (mdsComponentMap as Record<string, string>)[typeName];
    if (!tag) continue;

    if (tag.startsWith('mds:') && !seen.has('mds')) {
      ns.push({ prefix: 'mds', uri: MDS_NS_URI });
      seen.add('mds');
    } else if (tag.startsWith('worker-app:') && !seen.has('worker-app')) {
      ns.push({ prefix: 'worker-app', uri: WORKER_APP_NS_URI });
      seen.add('worker-app');
    } else if (tag.startsWith('ui:') && !seen.has('ui')) {
      ns.push({ prefix: 'ui', uri: UI_NS_URI });
      seen.add('ui');
    } else if (tag.startsWith('icon:') && !seen.has('icon')) {
      ns.push({ prefix: 'icon', uri: ICON_NS_URI });
      seen.add('icon');
    }
  }

  return ns;
}

const CUSTOM_PROP_MAP: Record<string, string> = {
  label: 'label',
  variant: 'variant',
  size: 'size',
  icon: 'icon',
  iconTrailing: 'icon-trailing',
  action: 'action',
  href: 'href',
  target: 'target',
  verb: 'verb',
  state: 'state',
  status: 'status',
  labelLoading: 'label-loading',
  hide: 'hide',
  kind: 'kind',
  title: 'title',
  showIcon: 'show-icon',
  primaryLinkLabel: 'primary-link-label',
  secondaryLinkLabel: 'secondary-link-label',
  shadow: 'shadow',
  color: 'color',
  dismissible: 'dismissible',
  loadEvent: 'load-event',
  pressEvent: 'press-event',
  pressedEvent: 'pressed-event',
  name: 'name',
  source: 'source',
  type: 'type',
  hasBorder: 'has-border',
  counter: 'counter',
  right: 'right',
  text: 'text',
  iconName: 'icon-name',
  iconColor: 'icon-color',
  iconEmphasizeColor: 'icon-emphasize-color',
  iconSize: 'icon-size',
  marginHorizontal: 'margin-horizontal',
  showBack: 'show-back',
  main: 'main',
  progress: 'progress',
  titleAlwaysOn: 'title-always-on',
  sticky: 'sticky',
  backgroundColor: 'background-color',
  textAlign: 'text-align',
  numberOfLines: 'number-of-lines',
  illustrationName: 'illustration-name',
  bannerType: 'type',
  subtitle: 'subtitle',
  visible: 'visible',
  ctaLabel: 'cta-label',
  ctaLayout: 'cta-layout',
  secondaryCtaLabel: 'secondary-cta-label',
  toggleDuration: 'toggle-duration',
  autoHeight: 'auto-height',
  autoplay: 'autoplay',
  height: 'height',
  pagination: 'pagination',
  peekItems: 'peek-items',
  nextEventName: 'next-event-name',
  prevEventName: 'prev-event-name',
  onActiveEventPrefix: 'on-active-event-prefix',
  content: 'content',
  textType: 'type',
  fontStyle: 'font-style',
  listType: 'list-type',
  listIndex: 'list-index',
  selectable: 'selectable',
  preformatted: 'preformatted',
  message: 'message',
  trigger: 'trigger',
  dialogOptions: 'dialog-options',
};

const CUSTOM_SKIP_PROPS = new Set(['children', 'hvId', 'hvStyle', 'hvKey']);

// Slot names that should NOT be serialized as child elements
// (they are internal Craft.js structure nodes, e.g. HvView wrappers)
const SLOT_NAMES = new Set([
  'left', 'content', 'right', 'bottom',
  'leftContent', 'rightContent',
  'body', 'ctaChildren', 'secondaryCtaChildren',
  'header', 'footer', 'title', 'empty', 'itemTemplate',
]);

function serializeNode(
  nodeId: string,
  nodes: NodeMap,
  depth: number,
  styles: HvStyleDef[],
  behaviorMap: BehaviorMap,
  extraNsAttrs: string,
  slotName?: string,
): string {
  const entry = nodes[nodeId];
  if (!entry) return '';

  const node = entry.data;
  const typeName = typeof node.type === 'string'
    ? node.type
    : node.type.resolvedName;

  // Skip Placeholder/Hint nodes (they're empty visual hints)
  if (typeName === 'Placeholder' || node.displayName === 'Hint' || node.displayName === 'Placeholder') {
    return '';
  }

  const tagName = getTagName(typeName);
  if (!tagName) return '';

  const indent = INDENT.repeat(depth);
  const props = node.props || {};

  const attrParts: string[] = [];
  if (tagName === 'doc') {
    attrParts.push('xmlns="https://hyperview.org/hyperview"');
    if (extraNsAttrs) attrParts.push(extraNsAttrs);
  }

  // For linked-node slot wrappers (HvView used as slot container), skip the view tag
  // and just serialize children directly
  if (slotName && tagName === 'view') {
    const allChildIds = [...(node.nodes || []), ...Object.values(node.linkedNodes || {})];
    let xml = '';
    for (const childId of allChildIds) {
      xml += serializeNode(childId, nodes, depth, styles, behaviorMap, '');
    }
    return xml;
  }

  if (!isCustomElement(tagName)) {
    // Core HV element attribute handling
    if (props.hvId) attrParts.push(`id="${escapeXml(String(props.hvId))}"`);
    if (props.hvStyle) attrParts.push(`style="${escapeXml(String(props.hvStyle))}"`);
    if (props.hvKey) attrParts.push(`key="${escapeXml(String(props.hvKey))}"`);

    if (tagName === 'image' && props.source) {
      attrParts.push(`source="${escapeXml(String(props.source))}"`);
      if (props.width) attrParts.push(`width="${props.width}"`);
      if (props.height) attrParts.push(`height="${props.height}"`);
    }
    if (tagName === 'text-field') {
      if (props.name) attrParts.push(`name="${escapeXml(String(props.name))}"`);
      if (props.placeholder) attrParts.push(`placeholder="${escapeXml(String(props.placeholder))}"`);
      if (props.keyboardType && props.keyboardType !== 'default') {
        attrParts.push(`keyboard-type="${escapeXml(String(props.keyboardType))}"`);
      }
    }
    if ((tagName === 'select-single' || tagName === 'select-multiple') && props.name) {
      attrParts.push(`name="${escapeXml(String(props.name))}"`);
    }
    if (tagName === 'date-field') {
      if (props.name) attrParts.push(`name="${escapeXml(String(props.name))}"`);
      if (props.label) attrParts.push(`label="${escapeXml(String(props.label))}"`);
    }
    if (tagName === 'option') {
      if (props.value) attrParts.push(`value="${escapeXml(String(props.value))}"`);
      if (props.label) attrParts.push(`label="${escapeXml(String(props.label))}"`);
    }
    if (tagName === 'switch') {
      if (props.name) attrParts.push(`name="${escapeXml(String(props.name))}"`);
      if (props.value) attrParts.push(`value="true"`);
    }
    if (tagName === 'item' && props.hvKey) {
      attrParts.push(`key="${escapeXml(String(props.hvKey))}"`);
    }
  } else {
    // Custom/MDS element attribute handling
    if (props.hvId) attrParts.push(`id="${escapeXml(String(props.hvId))}"`);
    if (props.hvStyle) attrParts.push(`style="${escapeXml(String(props.hvStyle))}"`);

    for (const [propKey, propVal] of Object.entries(props)) {
      if (CUSTOM_SKIP_PROPS.has(propKey)) continue;
      if (propVal === undefined || propVal === null || propVal === '') continue;
      if (propVal === false) continue;
      const xmlAttr = CUSTOM_PROP_MAP[propKey] || propKey;
      if (typeof propVal === 'boolean') {
        attrParts.push(`${xmlAttr}="true"`);
      } else if (typeof propVal === 'number') {
        attrParts.push(`${xmlAttr}="${propVal}"`);
      } else {
        attrParts.push(`${xmlAttr}="${escapeXml(String(propVal))}"`);
      }
    }
  }

  const attrStr = attrParts.length > 0 ? ' ' + attrParts.join(' ') : '';

  // Separate regular children from linked (slot) children
  const regularChildIds = node.nodes || [];
  const linkedEntries = Object.entries(node.linkedNodes || {});

  const nodeBehaviors = behaviorMap[nodeId] || [];

  // Text is a special case
  if (tagName === 'text') {
    if (nodeBehaviors.length === 0) {
      const textContent = escapeXml(String(props.text || ''));
      return `${indent}<text${attrStr}>${textContent}</text>\n`;
    }
    let xml = `${indent}<text${attrStr}>\n`;
    xml += `${indent}${INDENT}${escapeXml(String(props.text || ''))}\n`;
    xml += serializeBehaviors(nodeBehaviors, indent + INDENT);
    xml += `${indent}</text>\n`;
    return xml;
  }

  // MDS text uses content prop
  if (tagName === 'mds:text') {
    const textContent = escapeXml(String(props.content || ''));
    if (nodeBehaviors.length === 0 && regularChildIds.length === 0 && linkedEntries.length === 0) {
      return `${indent}<${tagName}${attrStr}>${textContent}</${tagName}>\n`;
    }
  }

  const hasLinkedSlots = linkedEntries.some(([name]) => SLOT_NAMES.has(name));
  const hasChildren = regularChildIds.length > 0 || hasLinkedSlots || nodeBehaviors.length > 0;

  if (!hasChildren && linkedEntries.length === 0) {
    return `${indent}<${tagName}${attrStr} />\n`;
  }

  let xml = `${indent}<${tagName}${attrStr}>\n`;

  if (tagName === 'screen') {
    xml += serializeStyles(styles, indent + INDENT);
  }

  xml += serializeBehaviors(nodeBehaviors, indent + INDENT);

  // Serialize linked-node slots as named wrapper elements
  for (const [sName, linkedId] of linkedEntries) {
    if (SLOT_NAMES.has(sName)) {
      const slotContent = serializeNode(linkedId, nodes, depth + 1, styles, behaviorMap, '', sName);
      if (slotContent.trim()) {
        xml += `${indent}${INDENT}<${sName}>\n`;
        // Re-serialize at depth+2 since we added a wrapper
        const innerContent = serializeNode(linkedId, nodes, depth + 2, styles, behaviorMap, '', sName);
        xml += innerContent;
        xml += `${indent}${INDENT}</${sName}>\n`;
      }
    } else {
      xml += serializeNode(linkedId, nodes, depth + 1, styles, behaviorMap, '');
    }
  }

  for (const childId of regularChildIds) {
    xml += serializeNode(childId, nodes, depth + 1, styles, behaviorMap, '');
  }

  xml += `${indent}</${tagName}>\n`;
  return xml;
}

export function serializeToHxml(nodes: NodeMap, styles: HvStyleDef[], behaviorMap: BehaviorMap = {}): string {
  const nsDecls = collectNamespaces(behaviorMap, nodes);
  const extraNsAttrs = nsDecls.map((ns) => `xmlns:${ns.prefix}="${ns.uri}"`).join(' ');
  return serializeNode('ROOT', nodes, 0, styles, behaviorMap, extraNsAttrs).trim();
}
