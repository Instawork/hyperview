import type { FontScaleProps } from './types';

export const getFontScaleProps = (element: Element): FontScaleProps => {
  const allowFontScaling =
    element.getAttribute('allowFontScaling') || undefined;
  const maxFontSizeMultiplier =
    element.getAttribute('maxFontSizeMultiplier') || undefined;
  const minimumFontScale =
    element.getAttribute('minimumFontScale') || undefined;
  const props: FontScaleProps = {};
  if (allowFontScaling !== undefined) {
    props.allowFontScaling = allowFontScaling !== 'false';
  }
  if (maxFontSizeMultiplier !== undefined) {
    props.maxFontSizeMultiplier = parseFloat(maxFontSizeMultiplier);
  }
  if (minimumFontScale !== undefined) {
    props.minimumFontScale = parseFloat(minimumFontScale);
  }
  return props;
};

export * from './types';
