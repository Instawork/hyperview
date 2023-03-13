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
import type { State } from './types';
/**
 * A picker field renders a form field with values that come from a pre-defined list.
 * - On iOS, pressing the field brings up a custom bottom sheet with a picker and action buttons.
 * - On Android, the system picker is rendered inline on the screen. Pressing the picker
 *   opens a system dialog.
 */
export default class HvPickerField extends PureComponent<HvComponentProps, State> {
    static namespaceURI: any;
    static localName: any;
    static localNameAliases: never[];
    static getFormInputValues: (element: Element) => Array<[string, string]>;
    props: HvComponentProps;
    state: State;
    constructor(props: HvComponentProps);
    static getDerivedStateFromProps(nextProps: HvComponentProps, prevState: State): {
        value: any;
    } | {
        value?: undefined;
    };
    toggleFieldPress: () => void;
    toggleCancelPress: () => void;
    toggleSavePress: () => void;
    /**
     * Gets the label from the picker items for the given value.
     * If the value doesn't have a picker item, returns null.
     */
    getLabelForValue: (value: DOMString) => string | null | undefined;
    /**
     * Shows the picker, defaulting to the field's value.
     */
    onFieldPress: () => void;
    /**
     * Hides the picker without applying the chosen value.
     */
    onModalCancel: () => void;
    /**
     * Hides the picker and applies the chosen value to the field.
     */
    onModalDone: () => void;
    /**
     * Renders the picker component. Picker items come from the
     * <picker-item> elements in the <picker-field> element.
     */
    renderPicker: (style: StyleSheetType) => ReactNode;
    /**
     * Renders a bottom sheet with cancel/done buttons and a picker component.
     * Uses styles defined on the <picker-field> element for the modal and buttons.
     */
    renderPickerModal: () => ReactNode;
    /**
     * On Android, we render a view containing the system picker. Android's system picker opens a modal
     * when pressed so the user can select an option. The selected option gets applied immediately. The user
     * can cancel by hitting the back button or tapping outside of the modal.
     */
    renderAndroid: () => ReactNode;
    /**
     * On iOS, we render a view containing a text label. Pressing the view opens a modal with a system picker and
     * action buttons along the bottom of the screen. After selecting an option, the user must press the save button.
     * To cancel, the user must press the cancel button.
     */
    renderiOS: () => ReactNode;
    render(): ReactNode;
}
