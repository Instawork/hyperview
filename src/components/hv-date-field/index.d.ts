/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { HvComponentProps } from 'hyperview/src/types';
import { PureComponent } from 'react';
import type { ReactNode } from 'react';
/**
 * A date field renders a form field with ISO date fields (YYYY-MM-DD).
 * Focusing the field brings up a system-appropriate UI for date selection:
 * - On iOS, pressing the field brings up a custom bottom sheet with a picker and action buttons.
 * - On Android, pressing the field brings up the system date picker modal.
 */
export default class HvDateField extends PureComponent<HvComponentProps> {
    static namespaceURI: any;
    static localName: any;
    static localNameAliases: never[];
    static getFormInputValues: (element: Element) => Array<[string, string]>;
    props: HvComponentProps;
    /**
     * Given a Date object, returns an ISO date string (YYYY-MM-DD). If the Date
     * object is null, returns an empty string.
     */
    static createStringFromDate: (date?: Date | null) => string;
    /**
     * Given a ISO date string (YYYY-MM-DD), returns a Date object. If the string
     * cannot be parsed or is falsey, returns null.
     */
    static createDateFromString: (value?: string | null) => Date | null | undefined;
    /**
     * Shows the picker, defaulting to the field's value. If the field is not set, use today's date in the picker.
     */
    onFieldPress: () => void;
    /**
     * Hides the picker without applying the chosen value.
     */
    onModalCancel: () => void;
    /**
     * Hides the picker and applies the chosen value to the field.
     */
    onModalDone: (newValue?: Date | null) => void;
    /**
     * Updates the picker value while keeping the picker open.
     */
    setPickerValue: (value?: Date | null) => void;
    /**
     * Returns true if the field is focused (and picker is showing).
     */
    isFocused: () => boolean;
    /**
     * Returns a Date object representing the value in the picker.
     */
    getPickerValue: () => Date | null | undefined;
    /**
     * Returns a Date object representing the value in the field.
     */
    getValue: () => Date | null | undefined;
    /**
     * Renders the date picker component, with the given min and max dates.
     * Used for both iOS and Android. However, on iOS this component is rendered inline,
     * and on Android it's rendered as a modal. Thus, the on-change callback needs to be
     * handled differently in each Platform, and on iOS we need to wrap this component
     * in our own modal for consistency.
     */
    renderPicker: (onChange: (evt: Event, date?: Date) => void) => ReactNode;
    /**
     * Unlike iOS, the Android picker natively uses a modal. So we don't need
     * to wrap it in an extra component, just render it when we want the modal
     * to appear.
     */
    renderPickerModalAndroid: () => ReactNode | null | undefined;
    /**
     * Renders a bottom sheet with cancel/done buttons and a picker component.
     * Uses styles defined on the <picker-field> element for the modal and buttons.
     * This is used on iOS only.
     */
    renderPickerModaliOS: () => ReactNode;
    /**
     * Renders the field (view and text label).
     * Pressing the field will focus it and:
     * - on iOS, bring up a bottom sheet with date picker
     * - on Android, show the system date picker
     */
    render: () => ReactNode;
}
