import type { HvStyleDef, HvModifierDef } from '../stores/styles';
import type { HvBehaviorDef } from '../stores/behaviors';

const TAG_TO_COMPONENT: Record<string, string> = {
  'doc': 'HvDoc',
  'screen': 'HvScreen',
  'body': 'HvBody',
  'header': 'HvHeader',
  'view': 'HvView',
  'text': 'HvText',
  'image': 'HvImage',
  'spinner': 'HvSpinner',
  'list': 'HvList',
  'item': 'HvItem',
  'form': 'HvForm',
  'text-field': 'HvTextField',
  'date-field': 'HvDateField',
  'select-single': 'HvSelectSingle',
  'select-multiple': 'HvSelectMultiple',
  'option': 'HvOption',
  'switch': 'HvSwitch',
};

const PREFIXED_TAG_TO_COMPONENT: Record<string, string> = {
  'mds:button': 'MdsButton',
  'mds:card': 'MdsCard',
  'mds:alert': 'MdsAlert',
  'mds:icon': 'MdsIcon',
  'mds:separator': 'MdsSeparator',
  'mds:pill': 'MdsPill',
  'mds:titlebar': 'MdsTitlebar',
  'mds:footer': 'MdsFooter',
  'mds:callout': 'MdsCallout',
  'mds:avatar': 'MdsAvatar',
  'mds:list-item': 'MdsListItem',
  'mds:skeleton': 'MdsSkeleton',
  'mds:banner': 'MdsBanner',
  'mds:empty-status': 'MdsEmptyStatus',
  'mds:dialog': 'MdsDialog',
  'mds:text': 'MdsText',
  'mds:list': 'MdsList',
  'worker-app:bottom-sheet': 'MdsBottomsheet',
  'ui:carousel': 'MdsCarousel',
  'ui:carousel-item': 'MdsCarouselItem',
  'icon:icon': 'MdsIcon',
};

const CUSTOM_ATTR_TO_PROP: Record<string, string> = {
  'label': 'label',
  'variant': 'variant',
  'size': 'size',
  'icon': 'icon',
  'icon-trailing': 'iconTrailing',
  'action': 'action',
  'href': 'href',
  'target': 'target',
  'verb': 'verb',
  'state': 'state',
  'status': 'status',
  'label-loading': 'labelLoading',
  'hide': 'hide',
  'kind': 'kind',
  'title': 'title',
  'show-icon': 'showIcon',
  'primary-link-label': 'primaryLinkLabel',
  'secondary-link-label': 'secondaryLinkLabel',
  'shadow': 'shadow',
  'color': 'color',
  'dismissible': 'dismissible',
  'load-event': 'loadEvent',
  'press-event': 'pressEvent',
  'pressed-event': 'pressedEvent',
  'name': 'name',
  'source': 'source',
  'type': 'type',
  'has-border': 'hasBorder',
  'counter': 'counter',
  'right': 'right',
  'text': 'text',
  'content': 'content',
  'icon-name': 'iconName',
  'icon-color': 'iconColor',
  'icon-emphasize-color': 'iconEmphasizeColor',
  'icon-size': 'iconSize',
  'margin-horizontal': 'marginHorizontal',
  'show-back': 'showBack',
  'main': 'main',
  'progress': 'progress',
  'title-always-on': 'titleAlwaysOn',
  'sticky': 'sticky',
  'background-color': 'backgroundColor',
  'text-align': 'textAlign',
  'number-of-lines': 'numberOfLines',
  'illustration-name': 'illustrationName',
  'subtitle': 'subtitle',
  'visible': 'visible',
  'cta-label': 'ctaLabel',
  'cta-layout': 'ctaLayout',
  'secondary-cta-label': 'secondaryCtaLabel',
  'toggle-duration': 'toggleDuration',
  'auto-height': 'autoHeight',
  'autoplay': 'autoplay',
  'height': 'height',
  'pagination': 'pagination',
  'peek-items': 'peekItems',
  'next-event-name': 'nextEventName',
  'prev-event-name': 'prevEventName',
  'on-active-event-prefix': 'onActiveEventPrefix',
  'font-style': 'fontStyle',
  'list-type': 'listType',
  'list-index': 'listIndex',
  'selectable': 'selectable',
  'preformatted': 'preformatted',
  'message': 'message',
  'trigger': 'trigger',
};

const CANVAS_COMPONENTS = new Set([
  'HvDoc', 'HvScreen', 'HvBody', 'HvHeader', 'HvView',
  'HvList', 'HvItem', 'HvForm', 'HvSelectSingle', 'HvSelectMultiple',
  'MdsCard', 'MdsAlert', 'MdsFooter', 'MdsCallout', 'MdsListItem',
  'MdsBanner', 'MdsEmptyStatus', 'MdsBottomsheet', 'MdsCarousel',
  'MdsCarouselItem', 'MdsList',
]);

export interface DeserializeResult {
  nodes: Record<string, any>;
  styles: HvStyleDef[];
  behaviors: Record<string, HvBehaviorDef[]>;
}

let nodeCounter = 0;
function nextNodeId(): string {
  return `node-${++nodeCounter}`;
}

function parseBehavior(el: Element): HvBehaviorDef {
  const bh: HvBehaviorDef = {
    id: `bh-imp-${++nodeCounter}`,
    trigger: el.getAttribute('trigger') || 'press',
    action: el.getAttribute('action') || 'push',
  };
  if (el.getAttribute('href')) bh.href = el.getAttribute('href')!;
  if (el.getAttribute('target')) bh.target = el.getAttribute('target')!;
  if (el.getAttribute('show-during-load')) bh.showDuringLoad = el.getAttribute('show-during-load')!;
  if (el.getAttribute('hide-during-load')) bh.hideDuringLoad = el.getAttribute('hide-during-load')!;
  if (el.getAttribute('event-name')) bh.eventName = el.getAttribute('event-name')!;
  if (el.getAttribute('new-value')) bh.newValue = el.getAttribute('new-value')!;

  const alertTitle = el.getAttributeNS('https://hyperview.org/hyperview-alert', 'title');
  if (alertTitle) bh.alertTitle = alertTitle;
  const alertMessage = el.getAttributeNS('https://hyperview.org/hyperview-alert', 'message');
  if (alertMessage) bh.alertMessage = alertMessage;

  const scrollAnimated = el.getAttributeNS('https://hyperview.org/hyperview-scroll', 'animated');
  if (scrollAnimated) bh.scrollAnimated = scrollAnimated === 'true';
  const scrollOffset = el.getAttributeNS('https://hyperview.org/hyperview-scroll', 'offset');
  if (scrollOffset) bh.scrollOffset = scrollOffset;
  const scrollPosition = el.getAttributeNS('https://hyperview.org/hyperview-scroll', 'position');
  if (scrollPosition) bh.scrollPosition = scrollPosition;

  return bh;
}

function parseStyles(stylesEl: Element): HvStyleDef[] {
  const result: HvStyleDef[] = [];
  for (let i = 0; i < stylesEl.children.length; i++) {
    const child = stylesEl.children[i];
    if (child.localName !== 'style') continue;
    const id = child.getAttribute('id');
    if (!id) continue;
    const properties: Record<string, string> = {};
    for (let j = 0; j < child.attributes.length; j++) {
      const attr = child.attributes[j];
      if (attr.name === 'id') continue;
      properties[attr.name] = attr.value;
    }
    const modifiers: HvModifierDef[] = [];
    for (let j = 0; j < child.children.length; j++) {
      const modEl = child.children[j];
      if (modEl.localName !== 'modifier') continue;
      const state = modEl.getAttribute('state') as HvModifierDef['state'] | null;
      if (!state || !['pressed', 'selected', 'focused'].includes(state)) continue;
      const modProps: Record<string, string> = {};
      for (let k = 0; k < modEl.attributes.length; k++) {
        const attr = modEl.attributes[k];
        if (attr.name === 'state') continue;
        modProps[attr.name] = attr.value;
      }
      modifiers.push({ state, properties: modProps });
    }
    result.push({ id, properties, modifiers });
  }
  return result;
}

function resolveComponent(el: Element): string | null {
  const localName = el.localName;

  if (TAG_TO_COMPONENT[localName]) return TAG_TO_COMPONENT[localName];

  const prefix = el.prefix;
  if (prefix) {
    const fullTag = `${prefix}:${localName}`;
    if (PREFIXED_TAG_TO_COMPONENT[fullTag]) return PREFIXED_TAG_TO_COMPONENT[fullTag];
  }

  if (localName.includes(':')) {
    if (PREFIXED_TAG_TO_COMPONENT[localName]) return PREFIXED_TAG_TO_COMPONENT[localName];
  }

  return null;
}

function extractProps(el: Element, tagName: string, componentName: string): Record<string, any> {
  const props: Record<string, any> = {};
  const isCustom = componentName.startsWith('Mds');

  const id = el.getAttribute('id');
  if (id) props.hvId = id;
  const style = el.getAttribute('style');
  if (style) props.hvStyle = style;
  const key = el.getAttribute('key');
  if (key) props.hvKey = key;

  if (!isCustom) {
    if (tagName === 'text') {
      let textContent = '';
      for (let i = 0; i < el.childNodes.length; i++) {
        const child = el.childNodes[i];
        if (child.nodeType === 3) textContent += child.textContent;
      }
      props.text = textContent.trim() || 'Text';
    }
    if (tagName === 'image') {
      if (el.getAttribute('source')) props.source = el.getAttribute('source');
      if (el.getAttribute('width')) props.width = Number(el.getAttribute('width'));
      if (el.getAttribute('height')) props.height = Number(el.getAttribute('height'));
    }
    if (tagName === 'text-field') {
      if (el.getAttribute('name')) props.name = el.getAttribute('name');
      if (el.getAttribute('placeholder')) props.placeholder = el.getAttribute('placeholder');
      if (el.getAttribute('keyboard-type')) props.keyboardType = el.getAttribute('keyboard-type');
    }
    if (tagName === 'date-field') {
      if (el.getAttribute('name')) props.name = el.getAttribute('name');
      if (el.getAttribute('label')) props.label = el.getAttribute('label');
    }
    if (tagName === 'select-single' || tagName === 'select-multiple') {
      if (el.getAttribute('name')) props.name = el.getAttribute('name');
    }
    if (tagName === 'option') {
      if (el.getAttribute('value')) props.value = el.getAttribute('value');
      if (el.getAttribute('label')) props.label = el.getAttribute('label');
    }
    if (tagName === 'switch') {
      if (el.getAttribute('name')) props.name = el.getAttribute('name');
      props.value = el.getAttribute('value') === 'true';
    }
    if (tagName === 'view') {
      props.flexDirection = 'column';
      props.padding = 8;
      props.margin = 0;
      props.borderRadius = 0;
    }
  } else {
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      if (attr.name === 'id' || attr.name === 'style' || attr.name === 'key') continue;
      if (attr.name.startsWith('xmlns')) continue;
      const propKey = CUSTOM_ATTR_TO_PROP[attr.name] || attr.name;
      if (attr.value === 'true') props[propKey] = true;
      else if (attr.value === 'false') props[propKey] = false;
      else if (/^\d+$/.test(attr.value)) props[propKey] = Number(attr.value);
      else props[propKey] = attr.value;
    }
    // MDS text content
    if (componentName === 'MdsText') {
      let textContent = '';
      for (let i = 0; i < el.childNodes.length; i++) {
        const child = el.childNodes[i];
        if (child.nodeType === 3) textContent += child.textContent;
      }
      if (textContent.trim()) props.content = textContent.trim();
    }
  }

  return props;
}

function processElement(
  el: Element,
  parentId: string,
  nodes: Record<string, any>,
  behaviors: Record<string, HvBehaviorDef[]>,
  styles: HvStyleDef[],
): string | null {
  const tagName = el.localName;

  if (tagName === 'styles') {
    styles.push(...parseStyles(el));
    return null;
  }
  if (tagName === 'behavior') return null;
  if (tagName === 'modifier') return null;

  const componentName = resolveComponent(el);
  if (!componentName) return null;

  const nodeId = tagName === 'doc' ? 'ROOT' : nextNodeId();
  const props = extractProps(el, tagName, componentName);
  const isCanvas = CANVAS_COMPONENTS.has(componentName);

  const childNodeIds: string[] = [];
  const nodeBehaviors: HvBehaviorDef[] = [];

  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i];
    if (child.localName === 'behavior') {
      nodeBehaviors.push(parseBehavior(child));
    } else {
      const childId = processElement(child, nodeId, nodes, behaviors, styles);
      if (childId) childNodeIds.push(childId);
    }
  }

  if (nodeBehaviors.length > 0) {
    behaviors[nodeId] = nodeBehaviors;
  }

  nodes[nodeId] = {
    type: { resolvedName: componentName },
    isCanvas,
    props,
    displayName: componentName.replace(/^(Hv|Mds)/, ''),
    custom: {},
    parent: parentId,
    nodes: childNodeIds,
    linkedNodes: {},
  };

  return nodeId;
}

export function deserializeHxml(hxml: string): DeserializeResult {
  nodeCounter = 0;
  const parser = new DOMParser();
  const doc = parser.parseFromString(hxml, 'application/xml');

  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error(`XML parse error: ${parserError.textContent}`);
  }

  const root = doc.documentElement;
  const nodes: Record<string, any> = {};
  const behaviors: Record<string, HvBehaviorDef[]> = {};
  const styles: HvStyleDef[] = [];

  processElement(root, '', nodes, behaviors, styles);

  return { nodes, styles, behaviors };
}
