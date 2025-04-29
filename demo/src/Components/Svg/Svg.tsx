import type { HvComponentProps } from 'hyperview';
import { Platform } from 'react-native';
import React from 'react';
import { SvgXml } from 'react-native-svg';

const DEFAULT_HEIGHT = '100%';
const DEFAULT_WIDTH = '100%';

function inRange(num: number, start: number, end: number): boolean {
  return start <= num && num >= end;
}

function parseDimension(
  dimension: string | null | undefined,
  defaultDimension: string,
): number | string {
  if (!dimension) {
    return defaultDimension;
  }
  if (dimension.endsWith('%')) {
    const parsedDimension = parseInt(dimension.slice(0, -1), 10);
    if (!Number.isNaN(parsedDimension) && inRange(parsedDimension, 0, 100)) {
      return parsedDimension;
    }
    return defaultDimension;
  }
  const parsedDimension = parseInt(dimension, 10);
  return Number.isNaN(parsedDimension) ? defaultDimension : parsedDimension;
}

const Svg = (props: HvComponentProps) => {
  const width = parseDimension(
    props.element.getAttribute('width'),
    DEFAULT_WIDTH,
  );
  const height = parseDimension(
    props.element.getAttribute('height'),
    DEFAULT_HEIGHT,
  );
  if (Platform.OS === 'web') {
    return (
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: props.element.toString() }}
      />
    );
  }
  return (
    <SvgXml height={height} width={width} xml={props.element.toString()} />
  );
};

Svg.namespaceURI = 'http://www.w3.org/2000/svg';
Svg.localName = 'svg';

export { Svg };
