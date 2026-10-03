import React, { useEffect, useRef } from 'react';
import {
    calculateValue,
    namespaceURI,
    parseTransformElement,
    type TransformConfig,
} from './utils';
import { createStyleProp, useScrollContext } from 'hyperview';
import * as Render from 'hyperview/src/services/render';
import { Animated } from 'react-native';
import type { HvComponentProps } from 'hyperview';
import { NODE_TYPE } from 'hyperview';


interface AnimatedValues {
    [key: string]: Animated.Value;
}

const ScrollTransformContainer = (props: HvComponentProps) => {
    const style = createStyleProp(props.element, props.stylesheets, {
        ...props.options,
        styleAttr: 'style',
    });

    // Parse transformOrigin prop
    const transformOriginValue = props.element.getAttribute('transform-origin');

    // Parse transform elements from children
    const transformConfigs: TransformConfig[] = [];
    const transformElements = Array.from(props.element.childNodes).filter(
        (child) =>
            child.nodeType === NODE_TYPE.ELEMENT_NODE &&
            (child as Element).namespaceURI === namespaceURI &&
            (child as Element).localName === 'transform'
    );

    transformElements.forEach((element) => {
        try {
            const config = parseTransformElement(element as Element);
            transformConfigs.push(config);
        } catch (error) {
            console.error('Error parsing transform element:', error);
        }
    });

    // Create animated values for each transform
    const animatedValuesRef = useRef<AnimatedValues>({});
    const { offsets } = useScrollContext();
    //console.log('offsets', offsets);
    // Initialize animated values
    transformConfigs.forEach((config, index) => {
        const key = `${config.styleAttr || config.transformAttr}-${index}`;
        if (!animatedValuesRef.current[key]) {
            // Assumes the default scroll position is 0
            const defaultPosition = { x: 0, y: 0 };
            const contextPosition = offsets[config.contextKey] || defaultPosition;
            const position = config.axis === 'horizontal' ? contextPosition.x : contextPosition.y;
            const initialValue = calculateValue(position, config.scrollRange, config.attrRange);
            animatedValuesRef.current[key] = new Animated.Value(initialValue);
        }
    });

    // Update animated values when scroll position changes
    useEffect(() => {
        transformConfigs.forEach((config, index) => {
            const key = `${config.styleAttr || config.transformAttr}-${index}`;
            const defaultPosition = { x: 0, y: 0 };
            const contextPosition = offsets[config.contextKey] || defaultPosition;
            const position = config.axis === 'horizontal' ? contextPosition.x : contextPosition.y;
            const toValue = calculateValue(position, config.scrollRange, config.attrRange);

            Animated.timing(animatedValuesRef.current[key], {
                duration: config.duration,
                toValue,
                useNativeDriver: true,
            }).start();
        });
    }, [transformConfigs, offsets]);

    // Build animated style from transform configs
    const animatedStyle: any = {};
    const transformArray: any[] = [];

    transformConfigs.forEach((config, index) => {
        const key = `${config.styleAttr || config.transformAttr}-${index}`;
        const animatedValue = animatedValuesRef.current[key];

        if (config.styleAttr) {
            // For style attributes like opacity, backgroundColor, etc.
            animatedStyle[config.styleAttr] = animatedValue;
        } else if (config.transformAttr) {
            // For transform attributes like scale, rotate, etc.
            const transformObj: any = {};
            transformObj[config.transformAttr] = animatedValue;
            transformArray.push(transformObj);
        }
    });

    if (transformArray.length > 0) {
        animatedStyle.transform = transformArray;
    }

    // Apply transformOrigin if specified
    if (transformOriginValue) {
        animatedStyle.transformOrigin = transformOriginValue;
    }

    // Filter out transform child elements since they're configuration, not content
    const nonTransformChildNodes = Array.from(props.element.childNodes).filter(
        (child) => {
            if (child.nodeType === NODE_TYPE.ELEMENT_NODE) { // Element node
                const element = child as Element;
                return !(element.namespaceURI === namespaceURI && element.localName === 'transform');
            }
            return true; // Keep text nodes and other types
        }
    );

    const children = Render.renderChildNodes(
        nonTransformChildNodes,
        props.stylesheets,
        props.onUpdate,
        props.options,
    );

    return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

ScrollTransformContainer.namespaceURI = namespaceURI;
ScrollTransformContainer.localName = 'container';

export { ScrollTransformContainer };
