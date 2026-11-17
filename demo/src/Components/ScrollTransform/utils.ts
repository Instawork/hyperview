export const namespaceURI = 'https://hyperview.org/scroll-transform';

export const getNumberAttr = (
    element: Element,
    attrName: string,
    defaultValue: number,
): number => {
    const value: string | null = element.getAttribute(attrName);
    if (!value) {
        return defaultValue;
    }
    return parseInt(value, 10);
};

export const getRangeAttr = (
    element: Element,
    attrName: string,
    defaultValue: [number, number],
): [number, number] => {
    const value: string | null = element.getAttribute(attrName);
    if (!value) {
        return defaultValue;
    }
    try {
        return JSON.parse(value);
    } catch (e) {
        throw new Error(`Invalid range attribute: ${value}`);
    }
};

// Reuse the same calculation function as ScrollOpacity
export const calculateValue = (
    position: number,
    inputRange: [number, number],
    outputRange: [number, number],
) => {
    const [a, b] = inputRange;
    const [c, d] = outputRange;

    // Check if the input range has the same start and end values
    if (a === b) {
        // If the position is exactly at a (or b), return the start of the output range
        // Otherwise, return the end of the output range
        return position <= a ? c : d;
    }

    // Calculate the slope
    const slope = (d - c) / (b - a);

    // Handle both ascending and descending input ranges
    const isAscending = b > a;

    if (isAscending) {
        // Ascending range: a < b
        if (position < a) {
            return c;
        }
        if (position > b) {
            return d;
        }
    } else {
        // Descending range: a > b
        if (position > a) {
            return c;
        }
        if (position < b) {
            return d;
        }
    }

    // Interpolate between the ranges
    return c + slope * (position - a);
};

export interface TransformConfig {
    contextKey: string;
    styleAttr?: string;
    transformAttr?: string;
    scrollRange: [number, number];
    attrRange: [number, number];
    axis: 'horizontal' | 'vertical';
    duration: number;
}

export const parseTransformElement = (element: Element): TransformConfig => {
    const contextKey = element.getAttribute('context-key');
    const styleAttr = element.getAttribute('style-attr') || undefined;
    const transformAttr = element.getAttribute('transform-attr') || undefined;
    const axis = (element.getAttribute('axis') || 'vertical') as 'horizontal' | 'vertical';
    const scrollRange = getRangeAttr(element, 'scroll-range', [0, 100]);
    const attrRange = getRangeAttr(element, 'attr-range', [0, 1]);
    const duration = getNumberAttr(element, 'duration', 0);

    if (!contextKey) {
        throw new Error('context-key is required for scroll-transform:transform');
    }

    if (!styleAttr && !transformAttr) {
        throw new Error('Either style-attr or transform-attr is required for scroll-transform:transform');
    }

    if (styleAttr && transformAttr) {
        throw new Error('Cannot specify both style-attr and transform-attr for scroll-transform:transform');
    }

    return {
        contextKey,
        styleAttr,
        transformAttr,
        scrollRange,
        attrRange,
        axis,
        duration,
    };
};
