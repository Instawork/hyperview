import { View } from 'react-native';
import { PureComponent } from 'react';
import type { ElementRef } from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
type Props = {
    children: any;
    onInvisible: () => void | null | undefined;
    onVisible: () => void | null | undefined;
    style: ViewStyleProp | null | undefined;
};
/** A view that lets you know when its contents become visible/invisible in the screen.
 *  Useful for progressively loading content in a scroll view.
 *  Uses a timer internally to periodically check whether or not it is visible/invisible
*/
export default class VisibilityDetectingView extends PureComponent<Props> {
    previouslyVisible: boolean;
    tickInterval: number | null | undefined;
    unmounted: boolean;
    view: ElementRef<typeof View> | null | undefined;
    onRef: (view?: ElementRef<typeof View> | null) => void;
    onTick: () => void;
    onMeasure: (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): any;
}
export {};
