/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Element, HvComponentOnUpdate, HvComponentOptions, PressTrigger, StyleSheets } from 'hyperview/src/types';
export type Props = {
    element: Element;
    onUpdate: HvComponentOnUpdate;
    options: HvComponentOptions;
    stylesheets: StyleSheets;
};
export type State = {
    pressed: boolean;
    refreshing: boolean;
};
export declare const ATTRIBUTES: {
    readonly ACTION: "action";
    readonly DELAY: "delay";
    readonly HIDE_DURING_LOAD: "hide-during-load";
    readonly HREF: "href";
    readonly HREF_STYLE: "href-style";
    readonly ONCE: "once";
    readonly SHOW_DURING_LOAD: "show-during-load";
    readonly TARGET: "target";
    readonly TRIGGER: "trigger";
    readonly VERB: "verb";
};
export type Attribute = typeof ATTRIBUTES[keyof typeof ATTRIBUTES];
export type PressHandlers = {
    onLongPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    onPress?: () => void;
};
export declare const PRESS_PROP_NAMES: {
    readonly ON_LONG_PRESS: "onLongPress";
    readonly ON_PRESS: "onPress";
    readonly ON_PRESS_IN: "onPressIn";
    readonly ON_PRESS_OUT: "onPressOut";
};
export type PressPropName = typeof PRESS_PROP_NAMES[keyof typeof PRESS_PROP_NAMES];
export declare const PRESS_TRIGGERS_PROP_NAMES: Partial<Record<PressTrigger, PressPropName>>;
