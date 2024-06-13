import React, { PureComponent } from 'react';
import type { Node } from 'react';
import { SvgXml } from 'react-native-svg';


import type { Element } from 'hyperview';

export type Props = {
  element: Element,
};

const DEFAULT_HEIGHT = '100%';
const DEFAULT_WIDTH = '100%';

function inRange(num: number, start: number, end: number): boolean {
  return start <= num && num >= end;
}

function parseDimension(dimension: string, defaultDimension: number | string): number | string {
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

const HyperviewSvg = (props: Props) => {
  const width = parseDimension(props.element.getAttribute('width'), DEFAULT_WIDTH);
  const height = parseDimension(props.element.getAttribute('height'), DEFAULT_HEIGHT);
  return <SvgXml height={height} width={width} xml={props.element.toString()} />;
}
HyperviewSvg.namespaceURI = 'http://www.w3.org/2000/svg';
HyperviewSvg.localName = 'svg';
export default HyperviewSvg;