import type { Document, Element, NavigationProps } from 'hyperview/src/types';
export declare const ANCHOR_ID_SEPARATOR = "#";
export default class Navigation {
    url: string;
    document: Document | null | undefined;
    navigation: NavigationProps;
    preloadScreens: {
        [key: number]: Element;
    };
    constructor(url: string, navigation: NavigationProps);
    setUrl: (url: string) => void;
    setDocument: (document: Document) => void;
    getPreloadScreen: (id: number) => Element | null | undefined;
    setPreloadScreen: (id: number, element: Element) => void;
    removePreloadScreen: (id: number) => void;
    getRouteKey: (href: string) => string | null | undefined;
    setRouteKey: (href: string, key: string) => void;
    removeRouteKey: (href: string) => void;
    navigate: (href: string, action: NavAction, element: Element, formComponents: ComponentRegistry, opts: BehaviorOptions) => void;
}
