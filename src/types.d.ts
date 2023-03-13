import { Flow } from 'flow-to-typescript-codemod';
/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { ElementRef, Component } from 'react';
export type DOMString = string;
export type NamespaceURI = string;
export declare const LOCAL_NAME: {
    readonly BEHAVIOR: "behavior";
    readonly BODY: "body";
    readonly DATE_FIELD: "date-field";
    readonly DOC: "doc";
    readonly FORM: "form";
    readonly HEADER: "header";
    readonly IMAGE: "image";
    readonly ITEM: "item";
    readonly ITEMS: "items";
    readonly LIST: "list";
    readonly MODIFIER: "modifier";
    readonly OPTION: "option";
    readonly PICKER_FIELD: "picker-field";
    readonly PICKER_ITEM: "picker-item";
    readonly SCREEN: "screen";
    readonly SECTION_LIST: "section-list";
    readonly SECTION_TITLE: "section-title";
    readonly SELECT_MULTIPLE: "select-multiple";
    readonly SELECT_SINGLE: "select-single";
    readonly SPINNER: "spinner";
    readonly STYLE: "style";
    readonly STYLES: "styles";
    readonly SWITCH: "switch";
    readonly TEXT: "text";
    readonly TEXT_AREA: "text-area";
    readonly TEXT_FIELD: "text-field";
    readonly VIEW: "view";
    readonly WEB_VIEW: "web-view";
};
export type LocalName = typeof LOCAL_NAME[keyof typeof LOCAL_NAME];
export declare const NODE_TYPE: {
    readonly ATTRIBUTE_NODE: 2;
    readonly CDATA_SECTION_NODE: 4;
    readonly COMMENT_NODE: 8;
    readonly DOCUMENT_FRAGMENT_NODE: 11;
    readonly DOCUMENT_NODE: 9;
    readonly DOCUMENT_TYPE_NODE: 10;
    readonly ELEMENT_NODE: 1;
    readonly ENTITY_NODE: 6;
    readonly ENTITY_REFERENCE_NODE: 5;
    readonly NOTATION_NODE: 12;
    readonly PROCESSING_INSTRUCTION_NODE: 7;
    readonly TEXT_NODE: 3;
};
export type NodeType = typeof NODE_TYPE[keyof typeof NODE_TYPE];
export type Node = {
    tagName: DOMString;
    localName: LocalName;
    readonly attributes: NamedNodeMap | null | undefined;
    readonly childNodes: NodeList<Node> | null | undefined;
    readonly firstChild: Node | null | undefined;
    readonly lastChild: Node | null | undefined;
    readonly localName: LocalName | null | undefined;
    readonly namespaceURI: NamespaceURI | null | undefined;
    readonly nextSibling: Node | null | undefined;
    readonly nodeName: DOMString;
    readonly nodeType: NodeType;
    nodeValue: string | null | undefined;
    readonly ownerDocument: Document | null | undefined;
    readonly parentNode: Node | null | undefined;
    readonly previousSibling: Node | null | undefined;
    appendChild: (newChild: Node) => Node;
    hasAttributes: () => boolean;
    hasChildNodes: () => boolean;
    insertBefore: (newChild: Node, refChild: Node) => Node;
    isSupported: (feature: DOMString, version: DOMString) => boolean;
    normalize: () => void;
    removeChild: (oldChild: Node) => Node;
    replaceChild: (newChild: Node, oldChild: Node) => Node;
};
export type Attribute = Node & {
    value: DOMString;
    nodeType: typeof NODE_TYPE.ATTRIBUTE_NODE;
    readonly name: DOMString;
    readonly specified: true;
    ownerElement: Element;
};
export type DocumentType = {
    entities: NamedNodeMap;
    internalSubset: DOMString;
    name: DOMString;
    notations: NamedNodeMap;
    publicId: DOMString;
    systemId: DOMString;
};
export type DOMImplementation = {
    createDocument: (namespaceURI: NamespaceURI, qualifiedName: DOMString, doctype: DocumentType) => Document;
    createDocumentType: (qualifiedName: DOMString, publicId: DOMString, systemId: DOMString) => DocumentType;
    hasFeature: (feature: DOMString, version: DOMString) => boolean;
};
export type Document = Node & {
    doctype: DocumentType;
    documentElement: Element;
    implementation: DOMImplementation;
    createAttribute: (name: DOMString) => Attribute;
    createAttributeNS: (namespaceURI: NamespaceURI, qualifiedName: DOMString) => Attribute;
    createCDATASection: (data: DOMString) => CDATASection;
    createComment: (data: DOMString) => Comment;
    createDocumentFragment: () => DocumentFragment;
    createElement: (tagName: DOMString) => Element;
    createElementNS: (namespaceURI: NamespaceURI, qualifiedName: DOMString) => Node;
    createEntityReference: (name: DOMString) => EntityReference;
    createProcessingInstruction: (target: DOMString, data: DOMString) => ProcessingInstruction;
    createTextNode: (data: DOMString) => Node;
    getElementById: (elementId: DOMString) => Element | null | undefined;
    getElementsByTagName: (tagName: DOMString) => NodeList<Element>;
    getElementsByTagNameNS: (namespaceURI: NamespaceURI, localName: LocalName) => NodeList<Element>;
    importNode: (importedNode: Node, deep: boolean) => Node;
};
export type Element = Node & {
    cloneNode: (deep: boolean) => Element;
    getAttribute: (name: DOMString) => DOMString | null | undefined;
    getAttributeNode: (name: DOMString) => Attribute | null | undefined;
    getAttributeNodeNS: (namespaceURI: NamespaceURI, localName: LocalName) => Attribute | null | undefined;
    getAttributeNS: (namespaceURI: NamespaceURI, localName: LocalName) => DOMString | null | undefined;
    getElementsByTagName: (name: DOMString) => NodeList<Element>;
    getElementsByTagNameNS: (namespaceURI: NamespaceURI, localName: LocalName) => NodeList<Element>;
    hasAttribute: (name: DOMString) => boolean;
    hasAttributeNS: (namespaceURI: NamespaceURI, localName: LocalName) => boolean;
    removeAttribute: (name: DOMString) => void;
    removeAttributeNode: (attribute: Attribute) => Attribute;
    removeAttributeNS: (namespaceURI: NamespaceURI, localName: LocalName) => void;
    setAttribute: (name: DOMString, value: DOMString) => void;
    setAttributeNode: (attribute: Attribute) => Attribute;
    setAttributeNodeNS: (attribute: Attribute) => Attribute;
    setAttributeNS: (namespaceURI: NamespaceURI, qualifiedName: LocalName, value: DOMString) => void;
};
export type DocumentFragment = Node;
export type EntityReference = Node;
export type ProcessingInstruction = Node & {
    data: DOMString;
    readonly target: DOMString;
};
export type CharacterData = Node & {
    data: DOMString;
    appendData: (data: DOMString) => void;
    deleteData: (offset: number, count: number) => void;
    insertData: (offset: number, data: DOMString) => void;
    replaceData: (offset: number, count: number, data: DOMString) => void;
    substringData: (offset: number, count: number) => DOMString;
};
export type Text = CharacterData & {
    nodeName: '#text';
    nodeType: typeof NODE_TYPE.TEXT_NODE;
    splitText: (offset: number) => Text;
};
export type Comment = CharacterData & {
    nodeName: '#comment';
    nodeType: typeof NODE_TYPE.COMMENT_NODE;
};
export type CDATASection = CharacterData & {
    nodeName: '#cdata-section';
    nodeType: typeof NODE_TYPE.CDATA_SECTION_NODE;
};
export type NodeList<T> = {
    length: number;
    item: (index: number) => T | null | undefined;
};
export type NamedNodeMap = {
    getNamedItem: (key: string) => Attribute | null | undefined;
    getNamedItemNS: (namespaceURI: NamespaceURI, localName: LocalName) => Attribute | null | undefined;
    item: (index: number) => Attribute | null | undefined;
    length: number;
    removeNamedItem: (key: string) => Attribute | null | undefined;
    removeNamedItemNS: (namespaceURI: NamespaceURI, localName: LocalName) => Attribute | null | undefined;
    setNamedItem: (attribute: Attribute) => Attribute | null | undefined;
    setNamedItemNS: (attribute: Attribute) => Attribute | null | undefined;
};
export type StyleSheet = any;
export type StyleSheets = {
    regular: StyleSheet;
    selected: StyleSheet;
    pressed: StyleSheet;
    focused: StyleSheet;
    pressedSelected: StyleSheet;
};
export type ComponentRegistry = {
    [key: string]: {
        [key: string]: HvComponent;
    };
};
export type HvComponentOptions = {
    behaviorElement?: Element | null | undefined;
    componentRegistry?: ComponentRegistry;
    delay?: DOMString | null | undefined;
    focused?: boolean | null | undefined;
    hideIndicatorIds?: DOMString | null | undefined;
    once?: DOMString | null | undefined;
    onEnd?: () => void | null | undefined;
    onSelect?: (value?: DOMString | null | undefined) => void | null | undefined;
    onToggle?: (value?: DOMString | null | undefined) => void | null | undefined;
    pressed?: boolean | null | undefined;
    pressedSelected?: boolean | null | undefined;
    registerInputHandler?: (ref?: ElementRef<any> | null | undefined) => void;
    screenUrl?: string | null | undefined;
    selected?: boolean | null | undefined;
    skipHref?: boolean | null | undefined;
    showIndicatorIds?: DOMString | null | undefined;
    styleAttr?: DOMString | null | undefined;
    targetId?: DOMString | null | undefined;
};
export type HvComponentOnUpdate = (path: DOMString | null | undefined, action: DOMString | null | undefined, element: Element, options: HvComponentOptions) => void;
export type HvGetRoot = () => Document;
export type HvUpdateRoot = (root: Document) => void;
export type HvComponentProps = {
    element: Element;
    onUpdate: HvComponentOnUpdate;
    options: HvComponentOptions;
    stylesheets: StyleSheets;
};
export type HvFormValues = {
    getFormInputValues: (element: Element) => Array<[string, string]>;
};
export type HvComponentStatics = {
    localName: LocalName | string;
    localNameAliases: Array<LocalName | string>;
    namespaceURI: NamespaceURI;
};
export type HvComponent = Flow.Class<Component<HvComponentProps, any>> & HvComponentStatics;
export type HvBehavior = {
    action: string;
    callback: (element: Element, onUpdate: HvComponentOnUpdate, getRoot: HvGetRoot, updateRoot: HvUpdateRoot) => void;
};
export type BehaviorRegistry = {
    [key: string]: HvBehavior;
};
export declare const TRIGGERS: Readonly<{
    DESELECT: "deselect";
    LOAD: "load";
    LONG_PRESS: "longPress";
    ON_EVENT: "on-event";
    PRESS: "press";
    PRESS_IN: "pressIn";
    PRESS_OUT: "pressOut";
    REFRESH: "refresh";
    SELECT: "select";
    VISIBLE: "visible";
}>;
export type Trigger = typeof TRIGGERS[keyof typeof TRIGGERS];
export declare const PRESS_TRIGGERS: readonly ("longPress" | "press" | "pressIn" | "pressOut")[];
export type PressTrigger = 'longPress' | 'pressIn' | 'pressOut' | 'press';
export declare const ACTIONS: {
    readonly APPEND: "append";
    readonly BACK: "back";
    readonly CLOSE: "close";
    readonly DEEP_LINK: "deep-link";
    readonly DISPATCH_EVENT: "dispatch-event";
    readonly NAVIGATE: "navigate";
    readonly NEW: "new";
    readonly PREPEND: "prepend";
    readonly PUSH: "push";
    readonly RELOAD: "reload";
    readonly REPLACE: "replace";
    readonly REPLACE_INNER: "replace-inner";
    readonly SWAP: "swap";
};
export declare const NAV_ACTIONS: {
    readonly BACK: "back";
    readonly CLOSE: "close";
    readonly DEEP_LINK: "deep-link";
    readonly NAVIGATE: "navigate";
    readonly NEW: "new";
    readonly PUSH: "push";
};
export type NavAction = typeof NAV_ACTIONS[keyof typeof NAV_ACTIONS];
export declare const UPDATE_ACTIONS: {
    readonly APPEND: "append";
    readonly PREPEND: "prepend";
    readonly REPLACE: "replace";
    readonly REPLACE_INNER: "replace-inner";
};
export type UpdateAction = typeof UPDATE_ACTIONS[keyof typeof UPDATE_ACTIONS];
export type BehaviorOptions = {
    newElement: Element;
    behaviorElement: Element;
    showIndicatorId?: string;
    delay?: number;
};
export type NavigationRouteParams = {
    delay: number | null | undefined;
    preloadScreen: number | null | undefined;
    url: string;
};
export type NavigationProps = {
    back: (routeParams?: NavigationRouteParams | null | undefined) => void;
    closeModal: (routeParams?: NavigationRouteParams | null | undefined) => void;
    navigate: (routeParams: NavigationRouteParams, key?: string | null | undefined) => void;
    openModal: (routeParams?: NavigationRouteParams | null | undefined) => void;
    push: (routeParams: NavigationRouteParams) => void;
};
export declare const ON_EVENT_DISPATCH = "hyperview:on-event";
